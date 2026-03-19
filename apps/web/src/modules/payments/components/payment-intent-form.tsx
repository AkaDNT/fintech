"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { usePaymentIntent } from "@/modules/payments/hooks/use-payment-intent";
import type { CreatePaymentIntentRequest } from "@/modules/payments/types/payment.types";

type FormValues = CreatePaymentIntentRequest;

export function PaymentIntentForm() {
  const paymentIntent = usePaymentIntent();
  const form = useForm<FormValues>({
    defaultValues: {
      walletId: "",
      amount: "",
      currency: "VND",
      merchantRef: "",
      externalRef: "",
      description: "",
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        paymentIntent.mutate({
          ...values,
          merchantRef: values.merchantRef?.trim() || undefined,
          externalRef: values.externalRef?.trim() || undefined,
          description: values.description?.trim() || undefined,
        });
      })}
    >
      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#111827]">
          Wallet ID
        </label>
        <Input
          placeholder="wallet_xxx"
          {...form.register("walletId", { required: true })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#111827]">
            Amount (minor units)
          </label>
          <Input
            placeholder="10000"
            {...form.register("amount", {
              required: true,
              pattern: /^[0-9]+$/,
            })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#111827]">
            Currency
          </label>
          <Select {...form.register("currency", { required: true })}>
            <option value="VND">VND</option>
            <option value="USD">USD</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#111827]">
            Merchant Ref
          </label>
          <Input
            placeholder="order_20260318"
            {...form.register("merchantRef")}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#111827]">
            External Ref
          </label>
          <Input
            placeholder="partner_ref_abc"
            {...form.register("externalRef")}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#111827]">
          Description
        </label>
        <Textarea
          rows={3}
          placeholder="Payment description..."
          {...form.register("description")}
        />
      </div>

      <Button type="submit" disabled={paymentIntent.isPending}>
        {paymentIntent.isPending
          ? "Creating intent..."
          : "Create payment intent"}
      </Button>
    </form>
  );
}
