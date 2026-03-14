"use client";

import { useMemo } from "react";
import { useWallets } from "@/modules/wallets/hooks/use-wallets";
import { currencyText } from "@/shared/lib/currency";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { EmptyState } from "@/shared/components/empty-state";
import { PageTitle } from "@/shared/components/page-title";

export default function DashboardPage() {
  const walletsQuery = useWallets();

  const totalByCurrency = useMemo(() => {
    return (walletsQuery.data ?? []).reduce<Record<string, bigint>>(
      (acc, wallet) => {
        acc[wallet.currency] =
          (acc[wallet.currency] ?? BigInt(0)) + wallet.availableBalance;
        return acc;
      },
      {},
    );
  }, [walletsQuery.data]);

  if (walletsQuery.isLoading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (walletsQuery.isError) {
    return (
      <ErrorState
        title="Cannot load wallets"
        description={walletsQuery.error.message}
      />
    );
  }

  const entries = Object.entries(totalByCurrency);

  return (
    <section className="space-y-5">
      <PageTitle
        title="Dashboard"
        subtitle="Quick overview of balances by currency"
      />

      {entries.length === 0 ? (
        <EmptyState
          title="No wallet data"
          description="No balances available for this user yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {entries.map(([currency, amount]) => (
            <article key={currency} className="card p-5">
              <p className="text-sm text-muted">Available</p>
              <h2 className="mt-2 text-3xl font-bold">
                {currencyText(amount, currency)}
              </h2>
              <p className="mt-2 text-xs text-muted">
                Real-time from wallet snapshots
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
