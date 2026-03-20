"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWalletLedger } from "@/modules/wallets/hooks/use-wallet-ledger";
import { LedgerTable } from "@/modules/wallets/components/ledger-table";
import { PageTitle } from "@/shared/components/page-title";
import { Button } from "@/shared/components/ui/button";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { EmptyState } from "@/shared/components/empty-state";

export default function WalletLedgerPage() {
  const params = useParams<{ walletId: string }>();
  const router = useRouter();
  const [cursor, setCursor] = useState<string | null>(null);
  const ledgerQuery = useWalletLedger(params.walletId, cursor);
  const goBackToWallets = () => router.push("/wallets");
  const backButton = (
    <Button
      variant="ghost"
      className="w-fit gap-2 px-1"
      onClick={goBackToWallets}
    >
      <span aria-hidden="true">&larr;</span>
      <span>Back to wallets</span>
    </Button>
  );

  if (ledgerQuery.isLoading) {
    return <LoadingState label="Loading ledger..." />;
  }

  if (ledgerQuery.isError) {
    return (
      <section className="space-y-4">
        {backButton}
        <ErrorState
          title="Cannot load ledger"
          description={ledgerQuery.error.message}
          actionLabel="Back to wallets"
          onAction={goBackToWallets}
        />
      </section>
    );
  }

  if (!ledgerQuery.data || ledgerQuery.data.items.length === 0) {
    return (
      <section className="space-y-4">
        {backButton}
        <EmptyState
          title="No transactions"
          description="No ledger entries for this wallet yet."
        />
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {backButton}
      <PageTitle
        title="Wallet Ledger"
        subtitle={`Wallet ${ledgerQuery.data.items[0]?.currency ?? params.walletId}`}
      />
      <LedgerTable ledger={ledgerQuery.data} />
      {ledgerQuery.data.nextCursor ? (
        <Button
          variant="secondary"
          onClick={() => setCursor(ledgerQuery.data?.nextCursor ?? null)}
        >
          Next page
        </Button>
      ) : null}
    </section>
  );
}
