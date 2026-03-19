"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleGuard } from "@/shared/components/role-guard";
import { PageTitle } from "@/shared/components/page-title";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { PaymentDetailCard } from "@/modules/payments/components/payment-detail-card";
import { useAdminPaymentDetail } from "@/modules/payments/hooks/use-payment-detail";

export default function AdminPaymentDetailPage() {
  const params = useParams<{ paymentId: string }>();
  const paymentId = params?.paymentId ?? "";

  const paymentQuery = useAdminPaymentDetail(paymentId);

  if (paymentQuery.isLoading) {
    return <LoadingState label="Loading admin payment detail..." />;
  }

  if (paymentQuery.isError || !paymentQuery.data) {
    return (
      <ErrorState
        title="Cannot load admin payment detail"
        description={paymentQuery.error?.message ?? "Payment not found"}
      />
    );
  }

  return (
    <RoleGuard allow={["ADMIN"]}>
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <PageTitle
            title="Admin Payment Detail"
            subtitle="Cross-user payment inspection view"
          />
          <Link
            href="/admin/payments"
            className="inline-flex h-10 items-center rounded-xl border border-[#d9deea] px-4 text-sm font-semibold text-[#052538] transition hover:bg-[#e8edf7]"
          >
            Back to admin payments
          </Link>
        </div>

        <PaymentDetailCard payment={paymentQuery.data} showUserId />
      </section>
    </RoleGuard>
  );
}
