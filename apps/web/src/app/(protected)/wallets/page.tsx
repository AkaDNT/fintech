"use client";

import { useWallets } from "@/modules/wallets/hooks/use-wallets";
import { WalletList } from "@/modules/wallets/components/wallet-list";
import { PageTitle } from "@/shared/components/page-title";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { EmptyState } from "@/shared/components/empty-state";

export default function WalletsPage() {
  const walletsQuery = useWallets();

  if (walletsQuery.isLoading) {
    return <LoadingState label="Loading wallets..." />;
  }

  if (walletsQuery.isError) {
    return (
      <ErrorState
        title="Cannot load wallets"
        description={walletsQuery.error.message}
      />
    );
  }

  if (!walletsQuery.data || walletsQuery.data.length === 0) {
    return (
      <EmptyState
        title="No wallets"
        description="No wallet assigned to this user yet."
      />
    );
  }

  return (
    <section className="space-y-5">
      <PageTitle title="Wallets" subtitle="Your balances across currencies" />
      <WalletList wallets={walletsQuery.data} />
    </section>
  );
}
