"use client";

import { useJobStatus } from "@/modules/admin-reports/hooks/use-job-status";
import { LoadingState } from "@/shared/components/loading-state";

export function ReportJobStatus({ jobId }: { jobId: string | null }) {
  const statusQuery = useJobStatus(jobId);

  if (!jobId) {
    return <p className="text-sm text-muted">No report job submitted yet.</p>;
  }

  if (statusQuery.isLoading) {
    return <LoadingState label="Fetching job status..." />;
  }

  if (statusQuery.isError || !statusQuery.data) {
    return <p className="text-sm text-danger">Cannot load report status.</p>;
  }

  const item = statusQuery.data;

  return (
    <div className="card p-4">
      <h3 className="text-lg font-bold">Job #{item.id}</h3>
      <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
        <p>
          <span className="font-semibold">Name:</span> {item.name}
        </p>
        <p>
          <span className="font-semibold">State:</span> {item.state}
        </p>
        <p>
          <span className="font-semibold">Progress:</span> {item.progress}
        </p>
        <p>
          <span className="font-semibold">Attempts:</span> {item.attemptsMade}
        </p>
      </div>
      {item.failedReason ? (
        <p className="mt-3 text-sm text-danger">{item.failedReason}</p>
      ) : null}
    </div>
  );
}
