"use client";

import { useParams } from "next/navigation";
import { AdjustWalletForm } from "@/modules/admin-wallets/components/adjust-wallet-form";
import { PageTitle } from "@/shared/components/page-title";
import { RoleGuard } from "@/shared/components/role-guard";

export default function AdminWalletDetailPage() {
  const params = useParams<{ walletId: string }>();

  return (
    <RoleGuard allow={["ADMIN"]}>
      <section className="space-y-5">
        <PageTitle
          title="Admin Wallet Adjustment"
          subtitle={`Wallet ${params.walletId}`}
        />
        <div className="card p-5">
          <AdjustWalletForm walletId={params.walletId} />
        </div>
      </section>
    </RoleGuard>
  );
}
