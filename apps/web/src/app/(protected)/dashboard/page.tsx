"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useWallets } from "@/modules/wallets/hooks/use-wallets";
import { currencyText } from "@/shared/lib/currency";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { EmptyState } from "@/shared/components/empty-state";
import { PageTitle } from "@/shared/components/page-title";

export default function DashboardPage() {
  const walletsQuery = useWallets();

  const summaryByCurrency = useMemo(() => {
    return (walletsQuery.data ?? []).reduce<
      Record<string, { available: bigint; locked: bigint }>
    >((acc, wallet) => {
      const current = acc[wallet.currency] ?? {
        available: BigInt(0),
        locked: BigInt(0),
      };

      acc[wallet.currency] = {
        available: current.available + wallet.availableBalance,
        locked: current.locked + wallet.lockedBalance,
      };

      return acc;
    }, {});
  }, [walletsQuery.data]);

  const wallets = useMemo(() => walletsQuery.data ?? [], [walletsQuery.data]);

  const activeWalletCount = useMemo(
    () => wallets.filter((wallet) => wallet.status === "ACTIVE").length,
    [wallets],
  );

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

  const entries = Object.entries(summaryByCurrency);
  const currencyCodes = entries.map(([currency]) => currency);

  return (
    <section className="space-y-6">
      <PageTitle
        title="Dashboard"
        subtitle="Command center for balances, activity and operational shortcuts"
      />

      {wallets.length === 0 ? (
        <EmptyState
          title="No wallet data"
          description="No balances available for this user yet."
        />
      ) : (
        <>
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="rounded-[20px] border border-[#d9deea] bg-white p-6 shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
          >
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5b667a]">
                  Portfolio Snapshot
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.02em] text-[#111827] sm:text-4xl">
                  Multi-wallet liquidity
                  <br />
                  at a glance
                </h2>
                <p className="mt-3 max-w-xl text-sm text-[#5b667a]">
                  Keep an eye on available and locked balances, then jump into
                  transfer or ledger workflows instantly.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href="/wallets"
                    className="inline-flex items-center gap-1 rounded-xl border border-[#d9deea] bg-[#f7f9fe] px-4 py-2 text-sm font-semibold text-[#052538] transition hover:bg-[#eef3fb]"
                  >
                    View wallets
                    <span>→</span>
                  </Link>
                  <Link
                    href="/transfer"
                    className="inline-flex items-center gap-1 rounded-xl border border-[#052538] bg-[#052538] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d3a53]"
                  >
                    New transfer
                    <span>↗</span>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 self-start text-center">
                <div className="rounded-2xl border border-[#d9deea] bg-[#f7f9fe] p-4">
                  <p className="text-xs uppercase tracking-wider text-[#5b667a]">
                    Wallets
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[#111827]">
                    {wallets.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#d9deea] bg-[#f7f9fe] p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-[#5b667a]">
                    Active
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[#111827]">
                    {activeWalletCount}
                  </p>
                </div>
                <div className="col-span-2 rounded-2xl border border-[#d9deea] bg-[#f7f9fe] p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-[#5b667a]">
                    Currencies in use
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[#111827]">
                    {entries.length}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    {currencyCodes.map((currency) => (
                      <span
                        key={currency}
                        className="inline-flex min-w-16 items-center justify-center rounded-full border border-[#cfd8ea] bg-white px-3 py-1 text-xs font-semibold tracking-wide text-[#052538] shadow-[0_1px_4px_rgba(15,23,42,0.08)]"
                      >
                        {currency}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4, ease: "easeOut" }}
            className="grid gap-4 lg:grid-cols-2"
          >
            {entries.map(([currency, balances]) => (
              <article
                key={currency}
                className="overflow-hidden rounded-[20px] border border-[#d9deea] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-center justify-between border-b border-[#e8edf7] bg-[#f7f9fe] px-5 py-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b667a]">
                      Currency Block
                    </p>
                    <h3 className="mt-1 text-xl font-bold tracking-tight text-[#111827]">
                      {currency}
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#052538] px-3 py-1 text-xs font-semibold text-white">
                    Live
                  </span>
                </div>

                <div className="space-y-4 px-5 py-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5b667a]">
                      Available
                    </p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-[#111827]">
                      {currencyText(balances.available, currency, {
                        unit: "major",
                      })}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#e6ecf7] bg-[#f8fbff] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5b667a]">
                      Locked
                    </p>
                    <p className="mt-1 text-lg font-bold text-[#052538]">
                      {currencyText(balances.locked, currency, {
                        unit: "major",
                      })}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </>
      )}
    </section>
  );
}
