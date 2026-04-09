"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Select } from "@/shared/components/ui/select";
import {
  useCancelPayment,
  useCapturePayment,
  useHoldPayment,
  useRefundPayment,
} from "@/modules/payments/hooks/use-payment-actions";
import { usePayments } from "@/modules/payments/hooks/use-payments";
import { currencyText } from "@/shared/lib/currency";

export function PaymentActionsPanel({
  initialPaymentId = "",
}: {
  initialPaymentId?: string;
}) {
  const [paymentId, setPaymentId] = useState(initialPaymentId);
  const createdPaymentsQuery = usePayments({ status: "CREATED" });

  const createdPayments = useMemo(
    () => createdPaymentsQuery.data ?? [],
    [createdPaymentsQuery.data],
  );

  useEffect(() => {
    if (initialPaymentId) {
      setPaymentId(initialPaymentId);
      return;
    }

    if (!createdPayments.length) {
      return;
    }

    const hasCurrent = createdPayments.some(
      (payment) => payment.id === paymentId,
    );
    if (!hasCurrent) {
      setPaymentId(createdPayments[0].id);
    }
  }, [createdPayments, initialPaymentId, paymentId]);

  const holdMutation = useHoldPayment();
  const captureMutation = useCapturePayment();
  const cancelMutation = useCancelPayment();
  const refundMutation = useRefundPayment();

  const disabled = !paymentId.trim();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#111827]">
          Select created payment
        </label>
        <Select
          value={paymentId}
          onChange={(event) => setPaymentId(event.target.value)}
          disabled={
            createdPaymentsQuery.isLoading || createdPayments.length === 0
          }
        >
          {createdPayments.length === 0 ? (
            <option value="">No CREATED payments</option>
          ) : null}

          {createdPayments.map((payment) => (
            <option key={payment.id} value={payment.id}>
              {payment.id.slice(0, 12)}... -{" "}
              {currencyText(payment.amount, payment.currency, {
                unit: "major",
              })}
            </option>
          ))}
        </Select>

        {createdPayments.length === 0 ? (
          <p className="text-xs text-[#be2b2b]">
            No payment in CREATED status is available.
          </p>
        ) : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="secondary"
          disabled={disabled || holdMutation.isPending}
          onClick={() => holdMutation.mutate(paymentId.trim())}
        >
          {holdMutation.isPending ? "Holding..." : "Hold"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={disabled || captureMutation.isPending}
          onClick={() => captureMutation.mutate(paymentId.trim())}
        >
          {captureMutation.isPending ? "Capturing..." : "Capture"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={disabled || cancelMutation.isPending}
          onClick={() => cancelMutation.mutate(paymentId.trim())}
        >
          {cancelMutation.isPending ? "Canceling..." : "Cancel"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={disabled || refundMutation.isPending}
          onClick={() => refundMutation.mutate(paymentId.trim())}
        >
          {refundMutation.isPending ? "Refunding..." : "Refund"}
        </Button>
      </div>

      <p className="text-[#5b667a]">
        <strong>CREATED:</strong> The transaction has been created (intent), and
        you can place a hold to temporarily lock the payment amount.
      </p>
      <p className="text-[#5b667a]">
        <strong>HELD:</strong> The amount has been temporarily held, and you can
        either capture it to complete the payment or cancel it to release the
        funds.
      </p>
      <p className="text-[#5b667a]">
        <strong>CAPTURED:</strong> The payment has been successfully captured,
        and you can only issue a refund if needed.
      </p>
      <p className="text-[#5b667a]">
        <strong>CANCELED:</strong> The held transaction has been canceled, the
        amount has been returned to the available balance, and no further action
        can be taken.
      </p>
      <p className="text-[#5b667a]">
        <strong>REFUNDED:</strong> The transaction has been successfully
        refunded, and no further action can be taken.
      </p>
    </div>
  );
}
