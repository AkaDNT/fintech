"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RoleGuard } from "@/shared/components/role-guard";
import { PageTitle } from "@/shared/components/page-title";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { EmptyState } from "@/shared/components/empty-state";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { PaymentsTable } from "@/modules/payments/components/payments-table";
import { useAdminPayments } from "@/modules/payments/hooks/use-payments";
import { useRunExpireHoldsJob } from "@/modules/payments/hooks/use-payment-actions";

export default function AdminPaymentsPage() {
  const [status, setStatus] = useState("");
  const [currency, setCurrency] = useState("");
  const [merchantRefInput, setMerchantRefInput] = useState("");
  const [merchantRef, setMerchantRef] = useState("");

  const applyMerchantRefFilter = () => {
    setMerchantRef(merchantRefInput.trim());
  };

  const filters = useMemo(
    () => ({
      status: status || undefined,
      currency: (currency || undefined) as "VND" | "USD" | undefined,
      merchantRef: merchantRef || undefined,
    }),
    [status, currency, merchantRef],
  );

  const paymentsQuery = useAdminPayments(filters);
  const expireJobMutation = useRunExpireHoldsJob();

  if (paymentsQuery.isLoading) {
    return <LoadingState label="Loading admin payments..." />;
  }

  if (paymentsQuery.isError) {
    return (
      <ErrorState
        title="Cannot load admin payments"
        description={paymentsQuery.error.message}
      />
    );
  }

  return (
    <RoleGuard allow={["ADMIN"]}>
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <PageTitle
            title="Admin Payments"
            subtitle="Inspect all users' payments and run hold-expiration maintenance"
          />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={expireJobMutation.isPending}
              onClick={() => expireJobMutation.mutate()}
            >
              {expireJobMutation.isPending ? "Running..." : "Run expire holds"}
            </Button>
            <Link
              href="/payments"
              className="inline-flex h-10 items-center rounded-xl border border-[#d9deea] px-4 text-sm font-semibold text-[#052538] transition hover:bg-[#e8edf7]"
            >
              User payments
            </Link>
          </div>
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
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyMerchantRefFilter();
                  }
                }}
                placeholder="order_20260318"
              />
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={applyMerchantRefFilter}
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
              key={`${status}|${currency}|${merchantRef}`}
              payments={paymentsQuery.data}
              detailBasePath="/admin/payments"
              showUserId
            />
          )}
        </article>
      </section>
    </RoleGuard>
  );
}
