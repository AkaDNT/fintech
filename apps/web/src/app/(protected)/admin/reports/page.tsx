"use client";

import { useState } from "react";
import { useMe } from "@/modules/auth/hooks/use-me";
import { ReportsActions } from "@/modules/admin-reports/components/reports-actions";
import { ReportJobStatus } from "@/modules/admin-reports/components/report-job-status";
import { PageTitle } from "@/shared/components/page-title";
import { ErrorState } from "@/shared/components/error-state";

export default function AdminReportsPage() {
  const { data: me } = useMe();
  const [jobId, setJobId] = useState<string | null>(null);

  if (me?.role !== "ADMIN") {
    return (
      <ErrorState
        title="Forbidden"
        description="Only admin can access report operations."
      />
    );
  }

  return (
    <section className="space-y-5">
      <PageTitle
        title="Admin Reports"
        subtitle="Queue and monitor background reports"
      />
      <ReportsActions onCreated={setJobId} />
      <ReportJobStatus jobId={jobId} />
    </section>
  );
}
