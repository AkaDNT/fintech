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
  const [date, setDate] = useState("");
  const [currency, setCurrency] = useState<"VND" | "USD">("VND");

  return (
    <div className="space-y-4">
      <section className="card p-4">
        <h3 className="text-lg font-bold">Export users CSV</h3>
        <p className="mt-1 text-sm text-muted">
          Optional date filter in ISO format.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            placeholder="2026-03-14"
            className="max-w-xs"
          />
          <Button
            onClick={async () => {
              const res = await enqueueMutation.mutateAsync({
                kind: "USERS",
                date: date || undefined,
              });
              onCreated(res.jobId);
            }}
          >
            Enqueue CSV
          </Button>
        </div>
      </section>

      <section className="card p-4">
        <h3 className="text-lg font-bold">Reconcile wallets</h3>
        <p className="mt-1 text-sm text-muted">
          Run consistency check per currency.
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
            Enqueue reconcile
          </Button>
        </div>
      </section>
    </div>
  );
}
