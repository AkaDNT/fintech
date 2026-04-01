"use client";

import { useState } from "react";
import { useEnqueueReport } from "@/modules/admin-reports/hooks/use-enqueue-report";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";

interface ReportsActionsProps {
  onCreated: (jobId: string) => void;
}

export function ReportsActions({ onCreated }: ReportsActionsProps) {
  const enqueueMutation = useEnqueueReport();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [currency, setCurrency] = useState<"VND" | "USD">("VND");

  return (
    <div className="space-y-4">
      <section className="card p-4">
        <h3 className="text-lg font-bold">User CSV Export</h3>
        <p className="mt-1 text-sm text-muted">
          Optionally filter users by creation date range (YYYY-MM-DD).
        </p>
        <p className="mt-1 text-xs text-muted">
          Leave both fields empty to export the full user dataset.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold text-muted">Start Date</span>
            <Input
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="max-w-xs ml-2"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-muted">End Date</span>
            <Input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="max-w-xs ml-2"
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button
            onClick={async () => {
              const res = await enqueueMutation.mutateAsync({
                kind: "USERS",
                from: from || undefined,
                to: to || undefined,
              });
              onCreated(res.jobId);
            }}
          >
            Queue CSV Export
          </Button>
        </div>
      </section>

      <section className="card p-4">
        <h3 className="text-lg font-bold">Wallet Reconciliation</h3>
        <p className="mt-1 text-sm text-muted">
          Run a balance consistency check by currency.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Select
            value={currency}
            onChange={(event) =>
              setCurrency(event.target.value as "VND" | "USD")
            }
            className="max-w-xs"
          >
            <option value="VND">VND</option>
            <option value="USD">USD</option>
          </Select>
          <Button
            variant="secondary"
            onClick={async () => {
              const res = await enqueueMutation.mutateAsync({
                kind: "RECONCILE",
                currency,
              });
              onCreated(String(res.jobId));
            }}
          >
            Queue Reconciliation Job
          </Button>
        </div>
      </section>
    </div>
  );
}
