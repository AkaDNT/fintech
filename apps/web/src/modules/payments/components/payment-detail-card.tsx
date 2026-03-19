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

export function PaymentDetailCard({
  payment,
  showUserId = false,
}: {
  payment: Payment;
  showUserId?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[20px] border border-[#d9deea] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
      <div className="bg-[#052538] px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-white/65">
          Payment ID
        </p>
        <h2 className="mt-1 truncate text-base font-bold text-white">
          {payment.id}
        </h2>
      </div>

      <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
        {showUserId ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5b667a]">
              User
            </p>
            <p className="mt-1 break-all text-sm text-[#111827]">
              {payment.userId ?? "-"}
            </p>
          </div>
        ) : null}

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5b667a]">
            Amount
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-[#111827]">
            {currencyText(payment.amount, payment.currency)}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5b667a]">
            Status
          </p>
          <span
            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(payment.status)}`}
          >
            {payment.status}
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5b667a]">
            Wallet
          </p>
          <p className="mt-1 break-all text-sm text-[#111827]">
            {payment.walletId}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5b667a]">
            Ledger Tx
          </p>
          <p className="mt-1 break-all text-sm text-[#111827]">
            {payment.ledgerTxId ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5b667a]">
            Merchant Ref
          </p>
          <p className="mt-1 break-all text-sm text-[#111827]">
            {payment.merchantRef ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5b667a]">
            External Ref
          </p>
          <p className="mt-1 break-all text-sm text-[#111827]">
            {payment.externalRef ?? "-"}
          </p>
        </div>
      </div>

      {payment.description ? (
        <div className="border-t border-[#e6ebf4] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5b667a]">
            Description
          </p>
          <p className="mt-1 text-sm text-[#30384a]">{payment.description}</p>
        </div>
      ) : null}
    </article>
  );
}
