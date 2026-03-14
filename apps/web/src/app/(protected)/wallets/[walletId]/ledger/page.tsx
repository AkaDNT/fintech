"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useWalletLedger } from "@/modules/wallets/hooks/use-wallet-ledger";
import { LedgerTable } from "@/modules/wallets/components/ledger-table";
import { PageTitle } from "@/shared/components/page-title";
import { Button } from "@/shared/components/ui/button";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { EmptyState } from "@/shared/components/empty-state";

export default function WalletLedgerPage() {
  const params = useParams<{ walletId: string }>();
  const [cursor, setCursor] = useState<string | null>(null);
  const ledgerQuery = useWalletLedger(params.walletId, cursor);

  if (ledgerQuery.isLoading) {
    return <LoadingState label="Loading ledger..." />;
  }

  if (ledgerQuery.isError) {
    return (
      <ErrorState
        title="Cannot load ledger"
        description={ledgerQuery.error.message}
      />
    );
  }

  if (!ledgerQuery.data || ledgerQuery.data.items.length === 0) {
    return (
      <EmptyState
        title="No transactions"
        description="No ledger entries for this wallet yet."
      />
    );
  }

  return (
    <section className="space-y-5">
      <PageTitle title="Wallet Ledger" subtitle={`Wallet ${params.walletId}`} />
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
