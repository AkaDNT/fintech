import Link from "next/link";
import type { Wallet } from "@/modules/wallets/types/wallet.types";
import { currencyText } from "@/shared/lib/currency";

export function WalletCard({ wallet }: { wallet: Wallet }) {
  return (
    <article className="card p-4">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{wallet.currency}</h3>
        <span className="rounded-full bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">
          {wallet.status}
        </span>
      </header>
      <p className="mt-4 text-2xl font-bold">
        {currencyText(wallet.availableBalance, wallet.currency)}
      </p>
      <p className="mt-1 text-xs text-muted">
        Locked: {currencyText(wallet.lockedBalance, wallet.currency)}
      </p>
      <Link
        href={`/wallets/${wallet.id}/ledger`}
        className="mt-4 inline-block text-sm font-semibold text-primary"
      >
        View ledger
      </Link>
    </article>
  );
}
