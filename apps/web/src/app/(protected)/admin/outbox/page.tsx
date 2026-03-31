"use client";

import Link from "next/link";
import { useState } from "react";
import { useRunOutboxPublish } from "@/modules/outbox-jobs/hooks/use-run-outbox-publish";
import { ErrorState } from "@/shared/components/error-state";
import { PageTitle } from "@/shared/components/page-title";
import { RoleGuard } from "@/shared/components/role-guard";
import { Button } from "@/shared/components/ui/button";

export default function AdminOutboxPage() {
  const runMutation = useRunOutboxPublish();
  const [lastJobId, setLastJobId] = useState<string | number | null>(null);

  return (
    <RoleGuard allow={["ADMIN"]}>
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <PageTitle
            title="Outbox Jobs"
            subtitle="Trigger outbox event publishing workers on demand"
          />

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/observability"
              className="inline-flex h-10 items-center rounded-xl border border-[#d9deea] px-4 text-sm font-semibold text-[#052538] transition hover:bg-[#e8edf7]"
            >
              View observability
            </Link>
            <Link
              href="/admin/webhook-deliveries"
              className="inline-flex h-10 items-center rounded-xl border border-[#d9deea] px-4 text-sm font-semibold text-[#052538] transition hover:bg-[#e8edf7]"
            >
              View deliveries
            </Link>
          </div>
        </div>

        <article className="space-y-4 rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-5">
          <h2 className="text-base font-bold text-[#111827]">
            Publish outbox events
          </h2>
          <p className="text-sm text-[#5b667a]">
            This enqueues the background worker that publishes pending outbox
            events.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              disabled={runMutation.isPending}
              onClick={() =>
                runMutation.mutate(undefined, {
                  onSuccess: (res) => setLastJobId(res.jobId),
                })
              }
            >
              {runMutation.isPending ? "Enqueuing..." : "Run publish job"}
            </Button>

            {lastJobId ? (
              <span className="rounded-full bg-[#e8edf7] px-3 py-1 text-xs font-semibold text-[#334155]">
                Last Job ID: {String(lastJobId)}
              </span>
            ) : null}
          </div>
        </article>

        {runMutation.isError ? (
          <ErrorState
            title="Cannot enqueue publish job"
            description={runMutation.error.message}
          />
        ) : null}
      </section>
    </RoleGuard>
  );
}
