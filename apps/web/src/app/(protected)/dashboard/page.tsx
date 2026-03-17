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
    <section className="space-y-6">
      <PageTitle
        title="Dashboard"
        subtitle="Quick overview of your balances by currency"
      />

      {entries.length === 0 ? (
        <EmptyState
          title="No wallet data"
          description="No balances available for this user yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {entries.map(([currency, amount]) => (
            <article
              key={currency}
              className="overflow-hidden rounded-[20px] border border-[#d9deea] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
            >
              <div className="bg-[#052538] px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                  Currency
                </p>
                <h2 className="mt-0.5 text-lg font-bold text-white">
                  {currency}
                </h2>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#5b667a]">
                  Total available
                </p>
                <p className="mt-1.5 text-3xl font-bold tracking-tight text-[#111827]">
                  {currencyText(amount, currency)}
                </p>
                <p className="mt-2 text-xs text-[#5b667a]">
                  Aggregated from all wallets
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
