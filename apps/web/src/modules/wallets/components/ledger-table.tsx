import Link from "next/link";
import type { WalletLedgerDto } from "@/modules/wallets/types/wallet.types";

export function LedgerTable({ ledger }: { ledger: WalletLedgerDto }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-xs uppercase text-muted">
            <th className="px-3">Transaction</th>
            <th className="px-3">Kind</th>
            <th className="px-3">Amount</th>
            <th className="px-3">Status</th>
            <th className="px-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {ledger.items.map((tx) => (
            <tr key={tx.id} className="card">
              <td className="px-3 py-3 text-sm font-semibold">
                <Link href={`/admin/ledger/${tx.id}`} className="text-primary">
                  {tx.id}
                </Link>
              </td>
              <td className="px-3 py-3 text-sm">{tx.kind}</td>
              <td className="px-3 py-3 text-sm">
                {tx.amount} {tx.currency}
              </td>
              <td className="px-3 py-3 text-sm">{tx.status}</td>
              <td className="px-3 py-3 text-sm text-muted">
                {new Date(tx.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
