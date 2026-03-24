"use client";

import { useMemo, useState } from "react";
import { PageTitle } from "@/shared/components/page-title";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { EmptyState } from "@/shared/components/empty-state";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { usePayments } from "@/modules/payments/hooks/use-payments";
import { PaymentIntentForm } from "@/modules/payments/components/payment-intent-form";
import { PaymentActionsPanel } from "@/modules/payments/components/payment-actions-panel";
import { PaymentsTable } from "@/modules/payments/components/payments-table";

export default function PaymentsPage() {
  const [status, setStatus] = useState("");
  const [currency, setCurrency] = useState("");
  const [merchantRefInput, setMerchantRefInput] = useState("");
  const [merchantRef, setMerchantRef] = useState("");

  const filters = useMemo(
    () => ({
      status: status || undefined,
      currency: (currency || undefined) as "VND" | "USD" | undefined,
      merchantRef: merchantRef || undefined,
    }),
    [status, currency, merchantRef],
  );

  const paymentsQuery = usePayments(filters);

  if (paymentsQuery.isLoading) {
    return <LoadingState label="Loading payments..." />;
  }

  if (paymentsQuery.isError) {
    return (
      <ErrorState
        title="Cannot load payments"
        description={paymentsQuery.error.message}
      />
    );
  }

  return (
    <section className="space-y-6">
      <PageTitle
        title="Payments"
        subtitle="Create intents, run lifecycle actions, and track every payment in one place"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="overflow-hidden rounded-[20px] border border-[#d9deea] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div className="bg-[#052538] px-5 py-4">
            <h2 className="text-base font-bold text-white">
              Create Payment Intent
            </h2>
          </div>
          <div className="px-5 py-5">
            <PaymentIntentForm />
          </div>
        </article>

        <article className="overflow-hidden rounded-[20px] border border-[#d9deea] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div className="bg-[#052538] px-5 py-4">
            <h2 className="text-base font-bold text-white">Payment Actions</h2>
          </div>
          <div className="px-5 py-5">
            <PaymentActionsPanel />
          </div>
        </article>
      </div>

      <article className="space-y-4 rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-full min-w-[180px] flex-1 sm:w-auto">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
              Status
            </label>
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All</option>
              <option value="CREATED">CREATED</option>
              <option value="HELD">HELD</option>
              <option value="CAPTURED">CAPTURED</option>
              <option value="CANCELED">CANCELED</option>
              <option value="REFUNDED">REFUNDED</option>
            </Select>
          </div>

          <div className="w-full min-w-[160px] flex-1 sm:w-auto">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
              Currency
            </label>
            <Select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
            >
              <option value="">All</option>
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </Select>
          </div>

          <div className="w-full min-w-[220px] flex-[1.5]">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
              Merchant Ref
            </label>
            <Input
              value={merchantRefInput}
              onChange={(event) => setMerchantRefInput(event.target.value)}
              placeholder="order_20260318"
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setMerchantRef(merchantRefInput.trim())}
          >
            Apply filters
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setStatus("");
              setCurrency("");
              setMerchantRefInput("");
              setMerchantRef("");
            }}
          >
            Reset
          </Button>
        </div>

        {!paymentsQuery.data || paymentsQuery.data.length === 0 ? (
          <EmptyState
            title="No payments found"
            description="No payment matches your current filters."
          />
        ) : (
          <PaymentsTable
            payments={paymentsQuery.data}
            detailBasePath="/payments"
          />
        )}
      </article>
    </section>
  );
}
