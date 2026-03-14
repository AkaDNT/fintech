"use client";

import { useParams } from "next/navigation";
import { AdjustWalletForm } from "@/modules/admin-wallets/components/adjust-wallet-form";
import { PageTitle } from "@/shared/components/page-title";

export default function AdminWalletDetailPage() {
  const params = useParams<{ walletId: string }>();

  return (
    <section className="space-y-5">
      <PageTitle
        title="Admin Wallet Adjustment"
        subtitle={`Wallet ${params.walletId}`}
      />
      <div className="card p-5">
        <AdjustWalletForm walletId={params.walletId} />
      </div>
    </section>
  );
}
