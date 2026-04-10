"use client";

import { useState } from "react";
import { ReportsActions } from "@/modules/admin-reports/components/reports-actions";
import { ReportJobStatus } from "@/modules/admin-reports/components/report-job-status";
import { RecentUsersCsvFiles } from "@/modules/admin-reports/components/recent-users-csv-files";
import { PageTitle } from "@/shared/components/page-title";
import { RoleGuard } from "@/shared/components/role-guard";

export default function AdminReportsPage() {
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <RoleGuard allow={["ADMIN"]}>
      <section className="space-y-5">
        <PageTitle
          title="Admin Reports"
          subtitle="Queue and monitor background reports"
        />
        <ReportsActions onCreated={setJobId} />
        <RecentUsersCsvFiles />
        <ReportJobStatus jobId={jobId} />
      </section>
    </RoleGuard>
  );
}
