"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useObservabilityMetrics } from "@/modules/observability/hooks/use-observability-metrics";
import { useObservabilitySummary } from "@/modules/observability/hooks/use-observability-summary";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { PageTitle } from "@/shared/components/page-title";
import { RoleGuard } from "@/shared/components/role-guard";
import { Button } from "@/shared/components/ui/button";
import { Select } from "@/shared/components/ui/select";

const REFRESH_OPTIONS = [5000, 10000, 15000, 30000, 60000] as const;

type SummarySample = {
  outboxPending: number;
  deliveryFailed: number;
  deliveryDead: number;
  inboxFailed: number;
  generatedAt: string;
};

export default function AdminObservabilityPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showMetrics, setShowMetrics] = useState(false);
  const [refreshMs, setRefreshMs] = useState<number>(10000);
  const [samples, setSamples] = useState<SummarySample[]>([]);

  const summaryQuery = useObservabilitySummary({
    refetchIntervalMs: autoRefresh ? refreshMs : false,
  });

  const metricsQuery = useObservabilityMetrics({
    enabled: showMetrics,
    refetchIntervalMs: autoRefresh && showMetrics ? refreshMs : false,
  });

  const summary = summaryQuery.data;

  const currentSample = useMemo<SummarySample | null>(() => {
    if (!summary) return null;
    return {
      outboxPending: summary.outbox.pending,
      deliveryFailed: summary.delivery.failed,
      deliveryDead: summary.delivery.dead,
      inboxFailed: summary.inbox.failed,
      generatedAt: summary.generatedAt,
    };
  }, [summary]);

  useEffect(() => {
    if (!currentSample) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSamples((prev) => {
      const last = prev[prev.length - 1];
      if (last?.generatedAt === currentSample.generatedAt) {
        return prev;
      }

      const next = [...prev, currentSample];
      return next.length > 30 ? next.slice(next.length - 30) : next;
    });
  }, [currentSample]);

  const trend = useMemo(() => {
    const latest = samples[samples.length - 1];
    const previous = samples[samples.length - 2];

    if (!latest || !previous) {
      return {
        outboxPending: 0,
        deliveryFailed: 0,
        deliveryDead: 0,
        inboxFailed: 0,
      };
    }

    return {
      outboxPending: latest.outboxPending - previous.outboxPending,
      deliveryFailed: latest.deliveryFailed - previous.deliveryFailed,
      deliveryDead: latest.deliveryDead - previous.deliveryDead,
      inboxFailed: latest.inboxFailed - previous.inboxFailed,
    };
  }, [samples]);

  if (summaryQuery.isLoading) {
    return <LoadingState label="Loading observability summary..." />;
  }

  if (summaryQuery.isError) {
    return (
      <ErrorState
        title="Cannot load observability summary"
        description={summaryQuery.error.message}
      />
    );
  }

  return (
    <RoleGuard allow={["ADMIN"]}>
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <PageTitle
            title="Observability"
            subtitle="Operational counters for outbox, webhook delivery, and inbox processing"
          />

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/outbox"
              className="inline-flex h-10 items-center rounded-xl border border-[#d9deea] px-4 text-sm font-semibold text-[#052538] transition hover:bg-[#e8edf7]"
            >
              Outbox jobs
            </Link>
            <Link
              href="/admin/webhook-deliveries"
              className="inline-flex h-10 items-center rounded-xl border border-[#d9deea] px-4 text-sm font-semibold text-[#052538] transition hover:bg-[#e8edf7]"
            >
              Deliveries
            </Link>
          </div>
        </div>

        <article className="rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
                Auto refresh
              </p>
              <Button
                type="button"
                variant={autoRefresh ? "secondary" : "ghost"}
                onClick={() => setAutoRefresh((prev) => !prev)}
              >
                {autoRefresh ? "On" : "Off"}
              </Button>
            </div>

            <div className="min-w-[160px]">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
                Interval
              </p>
              <Select
                value={String(refreshMs)}
                onChange={(event) => setRefreshMs(Number(event.target.value))}
                disabled={!autoRefresh}
              >
                {REFRESH_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option / 1000}s
                  </option>
                ))}
              </Select>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                void summaryQuery.refetch();
                if (showMetrics) {
                  void metricsQuery.refetch();
                }
              }}
              disabled={summaryQuery.isFetching || metricsQuery.isFetching}
            >
              {summaryQuery.isFetching || metricsQuery.isFetching
                ? "Refreshing..."
                : "Refresh now"}
            </Button>
          </div>
        </article>

        <article className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Outbox Pending"
            value={summary?.outbox.pending ?? 0}
            delta={trend.outboxPending}
          />
          <MetricCard
            label="Delivery Failed"
            value={summary?.delivery.failed ?? 0}
            delta={trend.deliveryFailed}
          />
          <MetricCard
            label="Delivery Dead"
            value={summary?.delivery.dead ?? 0}
            delta={trend.deliveryDead}
          />
          <MetricCard
            label="Inbox Failed"
            value={summary?.inbox.failed ?? 0}
            delta={trend.inboxFailed}
          />
        </article>

        <article className="space-y-3 rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[#111827]">
              Prometheus Metrics
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5b667a]">
                Generated:{" "}
                {summary?.generatedAt
                  ? new Date(summary.generatedAt).toLocaleString()
                  : "-"}
              </span>
              <Button
                type="button"
                variant={showMetrics ? "secondary" : "ghost"}
                onClick={() => setShowMetrics((prev) => !prev)}
              >
                {showMetrics ? "Hide metrics" : "Show metrics"}
              </Button>
            </div>
          </div>

          {!showMetrics ? (
            <p className="text-sm text-[#5b667a]">
              Metrics text is collapsed by default to reduce network and render
              overhead.
            </p>
          ) : metricsQuery.isError ? (
            <ErrorState
              title="Cannot load metrics text"
              description={metricsQuery.error.message}
            />
          ) : metricsQuery.isLoading ? (
            <LoadingState label="Loading metrics text..." />
          ) : (
            <pre className="max-h-[460px] overflow-auto rounded-xl border border-[#d9deea] bg-white p-3 text-xs text-[#334155]">
              {metricsQuery.data || "No metrics available"}
            </pre>
          )}
        </article>
      </section>
    </RoleGuard>
  );
}

function MetricCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: number;
  delta: number;
}) {
  const deltaText = delta === 0 ? "0" : `${delta > 0 ? "+" : ""}${delta}`;

  return (
    <div className="rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
        {label}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <p className="text-2xl font-black text-[#111827]">{value}</p>
        <span className="rounded-full bg-[#e8edf7] px-2 py-0.5 text-xs font-semibold text-[#334155]">
          {deltaText}
        </span>
      </div>
    </div>
  );
}
