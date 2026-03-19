"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  useCancelPayment,
  useCapturePayment,
  useHoldPayment,
  useRefundPayment,
} from "@/modules/payments/hooks/use-payment-actions";

export function PaymentActionsPanel({
  initialPaymentId = "",
}: {
  initialPaymentId?: string;
}) {
  const [paymentId, setPaymentId] = useState(initialPaymentId);

  const holdMutation = useHoldPayment();
  const captureMutation = useCapturePayment();
  const cancelMutation = useCancelPayment();
  const refundMutation = useRefundPayment();

  const disabled = !paymentId.trim();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#111827]">
          Payment ID
        </label>
        <Input
          placeholder="payment_xxx"
          value={paymentId}
          onChange={(event) => setPaymentId(event.target.value)}
        />
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

      <p className="text-xs text-[#5b667a]">
        Lifecycle actions: <strong>/hold</strong>, <strong>/capture</strong>,
        <strong> /cancel</strong>, <strong>/refund</strong>.
      </p>
    </div>
  );
}
