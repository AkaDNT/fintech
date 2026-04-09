import { useMemo, useState } from "react";
import Link from "next/link";
import { currencyText } from "@/shared/lib/currency";
import type { Payment } from "@/modules/payments/types/payment.types";

function statusClass(status: string) {
  switch (status) {
    case "CAPTURED":
      return "bg-[#e2f9ed] text-[#1f8265]";
    case "HELD":
      return "bg-[#fff3d8] text-[#946200]";
    case "REFUNDED":
      return "bg-[#e8edf7] text-[#052538]";
    case "CANCELED":
      return "bg-[#ffe6e6] text-[#be2b2b]";
    default:
      return "bg-[#eef2f8] text-[#5b667a]";
  }
}

export function PaymentsTable({
  payments,
  detailBasePath = "/payments",
  showUserId = false,
  pageSize = 10,
}: {
  payments: Payment[];
  detailBasePath?: string;
  showUserId?: boolean;
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(payments.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return payments.slice(start, start + pageSize);
  }, [currentPage, pageSize, payments]);

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#d9deea] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#e3e8f2]">
          <thead className="bg-[#f3f5fa]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#5b667a]">
                Payment
              </th>
              {showUserId ? (
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#5b667a]">
                  User
                </th>
              ) : null}
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#5b667a]">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#5b667a]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#5b667a]">
                Merchant Ref
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#5b667a]">
                Created
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[#5b667a]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef2f8]">
            {paginatedPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-[#f9fbff]">
                <td className="px-4 py-3 text-sm font-semibold text-[#111827]">
                  <p className="max-w-55 truncate">{payment.id}</p>
                  <p className="text-xs font-normal text-[#5b667a]">
                    Wallet: {payment.walletId}
                  </p>
                </td>

                {showUserId ? (
                  <td className="px-4 py-3 text-sm text-[#5b667a]">
                    {payment.userId ?? "-"}
                  </td>
                ) : null}

                <td className="px-4 py-3 text-sm font-semibold text-[#111827]">
                  {currencyText(payment.amount, payment.currency, {
                    unit: "major",
                  })}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(payment.status)}`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#5b667a]">
                  {payment.merchantRef ?? "-"}
                </td>
                <td className="px-4 py-3 text-sm text-[#5b667a]">
                  {new Date(payment.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`${detailBasePath}/${payment.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#d9deea] px-3 py-1.5 text-xs font-semibold text-[#052538] transition hover:bg-[#e8edf7]"
                  >
                    Detail
                    <span>→</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e3e8f2] bg-[#f8fafc] px-4 py-3">
        <p className="text-xs text-[#5b667a]">
          Showing {(currentPage - 1) * pageSize + 1}-
          {Math.min(currentPage * pageSize, payments.length)} of{" "}
          {payments.length} payments
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-[#d9deea] px-3 py-1.5 text-xs font-semibold text-[#052538] transition hover:bg-[#e8edf7] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="text-xs font-semibold text-[#5b667a]">
            Page {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            className="rounded-lg border border-[#d9deea] px-3 py-1.5 text-xs font-semibold text-[#052538] transition hover:bg-[#e8edf7] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
