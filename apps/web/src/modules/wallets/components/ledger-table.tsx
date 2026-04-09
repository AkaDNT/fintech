"use client";

import Link from "next/link";
import { useAuthContext } from "@/providers/auth-provider";
import type { WalletLedgerDto } from "@/modules/wallets/types/wallet.types";

function toDate(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }

    // Fallback for non-ISO formats like "YYYY-MM-DD HH:mm:ss"
    const normalized = trimmed.replace(" ", "T");
    const fallback = new Date(normalized);
    if (!Number.isNaN(fallback.getTime())) {
      return fallback;
    }
  }

  return null;
}

function formatLedgerDate(value: unknown) {
  const date = toDate(value);

  if (!date) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
    return "-";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function LedgerTable({ ledger }: { ledger: WalletLedgerDto }) {
  const { role } = useAuthContext();
  const canViewAdminLedger = role === "ADMIN";

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
                {canViewAdminLedger ? (
                  <Link
                    href={`/admin/ledger/${tx.id}`}
                    className="text-primary"
                  >
                    {tx.id}
                  </Link>
                ) : (
                  <span>{tx.id}</span>
                )}
              </td>
              <td className="px-3 py-3 text-sm">{tx.kind}</td>
              <td className="px-3 py-3 text-sm">
                {tx.amount} {tx.currency}
              </td>
              <td className="px-3 py-3 text-sm">{tx.status}</td>
              <td className="px-3 py-3 text-sm text-muted">
                {formatLedgerDate(tx.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
