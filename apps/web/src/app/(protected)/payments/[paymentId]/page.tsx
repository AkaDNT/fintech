"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageTitle } from "@/shared/components/page-title";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { PaymentDetailCard } from "@/modules/payments/components/payment-detail-card";
import { PaymentActionsPanel } from "@/modules/payments/components/payment-actions-panel";
import { usePaymentDetail } from "@/modules/payments/hooks/use-payment-detail";

export default function PaymentDetailPage() {
  const params = useParams<{ paymentId: string }>();
  const paymentId = params?.paymentId ?? "";

  const paymentQuery = usePaymentDetail(paymentId);

  if (paymentQuery.isLoading) {
    return <LoadingState label="Loading payment detail..." />;
  }

  if (paymentQuery.isError || !paymentQuery.data) {
    return (
      <ErrorState
        title="Cannot load payment detail"
        description={paymentQuery.error?.message ?? "Payment not found"}
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <PageTitle
          title="Payment Detail"
          subtitle="Inspect payment data and execute lifecycle actions"
        />
        <Link
          href="/payments"
          className="inline-flex h-10 items-center rounded-xl border border-[#d9deea] px-4 text-sm font-semibold text-[#052538] transition hover:bg-[#e8edf7]"
        >
          Back to payments
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <PaymentDetailCard payment={paymentQuery.data} />

        <article className="overflow-hidden rounded-[20px] border border-[#d9deea] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div className="bg-[#052538] px-5 py-4">
            <h2 className="text-base font-bold text-white">
              Lifecycle Actions
            </h2>
            <p className="mt-1 text-xs text-white/65">
              Pre-filled with current payment ID
            </p>
          </div>
          <div className="px-5 py-5">
            <PaymentActionsPanel initialPaymentId={paymentId} />
          </div>
        </article>
      </div>
    </section>
  );
}
