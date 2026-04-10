import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";

export interface RecentUsersCsvFile {
  id: string;
  bucket: string;
  objectKey: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface RecentUsersCsvFilesResponse {
  count: number;
  items: RecentUsersCsvFile[];
}

export function getRecentUsersCsvFiles(limit = 10) {
  return apiRequest<RecentUsersCsvFilesResponse>(
    ENDPOINTS.admin.reports.usersFiles(limit),
  );
}
