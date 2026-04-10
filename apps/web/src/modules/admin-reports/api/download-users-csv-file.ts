import { getAccessToken } from "@/modules/auth/utils/auth-storage";
import { ApiClientError } from "@/shared/api/api-error";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { ENV } from "@/shared/config/env";

function parseFileName(contentDisposition: string | null, fallback: string) {
  if (!contentDisposition) return fallback;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1];
  }

  return fallback;
}

export async function downloadUsersCsvFile(fileId: string) {
  const token = getAccessToken();
  const response = await fetch(
    `${ENV.apiBaseUrl}${ENDPOINTS.admin.reports.usersFileDownload(fileId)}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (!response.ok) {
    throw new ApiClientError({
      status: response.status,
      code: "DOWNLOAD_FAILED",
      message: `Download failed with status ${response.status}`,
      details: null,
      traceId: null,
    });
  }

  const blob = await response.blob();
  const fallback = `${fileId}.csv`;
  const filename = parseFileName(
    response.headers.get("content-disposition"),
    fallback,
  );

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}
