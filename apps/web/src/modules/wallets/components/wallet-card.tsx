import Link from "next/link";
import type { Wallet } from "@/modules/wallets/types/wallet.types";
import { currencyText } from "@/shared/lib/currency";

export function WalletCard({ wallet }: { wallet: Wallet }) {
  return (
    <article className="group overflow-hidden rounded-[20px] border border-[#d9deea] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition hover:shadow-[0_12px_28px_rgba(5,37,56,0.12)]">
      {/* header bar */}
      <div className="flex items-center justify-between bg-[#052538] px-5 py-4">
        <h3 className="text-base font-bold tracking-tight text-white">
          {wallet.currency}
        </h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            wallet.status === "ACTIVE"
              ? "bg-[#d2f44f] text-[#1a3a0a]"
              : "bg-white/20 text-white/70"
          }`}
        >
          {wallet.status}
        </span>
      </div>
      {/* body */}
      <div className="px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#5b667a]">
          Available balance
        </p>
        <p className="mt-1.5 text-3xl font-bold tracking-tight text-[#111827]">
          {currencyText(wallet.availableBalance, wallet.currency)}
        </p>
        <p className="mt-2 text-xs text-[#5b667a]">
          Locked: {currencyText(wallet.lockedBalance, wallet.currency)}
        </p>
        <div className="mt-4 border-t border-[#d9deea] pt-3">
          <Link
            href={`/wallets/${wallet.id}/ledger`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#052538] transition hover:gap-2"
          >
            View ledger
            <span className="text-sm leading-none">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
