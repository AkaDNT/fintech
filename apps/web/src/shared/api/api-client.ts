import { httpRequest } from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { ApiClientError } from "@/shared/api/api-error";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/modules/auth/utils/auth-storage";

let refreshingPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshingPromise) {
    refreshingPromise = httpRequest<{ accessToken: string }>({
      path: ENDPOINTS.auth.refresh,
      method: "POST",
    })
      .then((res) => {
        setAccessToken(res.accessToken);
        return res.accessToken;
      })
      .catch(() => {
        clearAccessToken();
        return null;
      })
      .finally(() => {
        refreshingPromise = null;
      });
  }

  return refreshingPromise;
}

export async function apiRequest<T>(
  path: string,
  init?: Omit<Parameters<typeof httpRequest<T>>[0], "path" | "token">,
) {
  const token = getAccessToken();

  try {
    return await httpRequest<T>({
      path,
      token,
      ...(init ?? {}),
    });
  } catch (error) {
    if (!(error instanceof ApiClientError) || error.status !== 401) {
      throw error;
    }

    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      throw error;
    }

    return httpRequest<T>({
      path,
      token: refreshed,
      ...(init ?? {}),
    });
  }
}
