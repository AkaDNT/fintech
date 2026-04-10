"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { LoadingState } from "@/shared/components/loading-state";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { downloadUsersCsvFile } from "@/modules/admin-reports/api/download-users-csv-file";
import { useRecentUsersCsvFiles } from "@/modules/admin-reports/hooks/use-recent-users-csv-files";

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function RecentUsersCsvFiles() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const filesQuery = useRecentUsersCsvFiles(10);
  const toastError = useToastError();

  return (
    <section className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">Recent User CSV Exports</h3>
          <p className="mt-1 text-sm text-muted">
            Last 10 queued exports with direct download action.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => filesQuery.refetch()}
          disabled={filesQuery.isFetching}
        >
          Refresh
        </Button>
      </div>

      {filesQuery.isLoading ? (
        <div className="mt-4">
          <LoadingState label="Loading recent CSV files..." />
        </div>
      ) : null}

      {filesQuery.isError ? (
        <p className="mt-4 text-sm text-danger">Cannot load CSV files.</p>
      ) : null}

      {!filesQuery.isLoading && !filesQuery.isError && filesQuery.data ? (
        filesQuery.data.items.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            No users CSV export found yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs uppercase text-muted">
                  <th className="px-3">File</th>
                  <th className="px-3">Size</th>
                  <th className="px-3">Created</th>
                  <th className="px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filesQuery.data.items.map((file) => {
                  const filename =
                    file.objectKey.split("/").pop() || `${file.id}.csv`;
                  const isDownloading = downloadingId === file.id;

                  return (
                    <tr key={file.id} className="card">
                      <td className="px-3 py-3 text-sm">
                        <p className="font-semibold">{filename}</p>
                        <p className="text-xs text-muted">{file.objectKey}</p>
                      </td>
                      <td className="px-3 py-3 text-sm text-muted">
                        {formatBytes(file.size)}
                      </td>
                      <td className="px-3 py-3 text-sm text-muted">
                        {new Date(file.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Button
                          variant="secondary"
                          disabled={isDownloading}
                          onClick={async () => {
                            try {
                              setDownloadingId(file.id);
                              await downloadUsersCsvFile(file.id);
                            } catch (error) {
                              toastError(error, "Cannot download CSV file");
                            } finally {
                              setDownloadingId(null);
                            }
                          }}
                        >
                          {isDownloading ? "Downloading..." : "Download"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </section>
  );
}
