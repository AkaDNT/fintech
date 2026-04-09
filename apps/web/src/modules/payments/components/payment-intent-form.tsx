"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { usePaymentIntent } from "@/modules/payments/hooks/use-payment-intent";
import { useWallets } from "@/modules/wallets/hooks/use-wallets";
import type {
  CreatePaymentIntentRequest,
  PaymentCurrency,
} from "@/modules/payments/types/payment.types";

type FormValues = Omit<CreatePaymentIntentRequest, "currency">;

export function PaymentIntentForm() {
  const paymentIntent = usePaymentIntent();
  const walletsQuery = useWallets();
  const activeWallets = useMemo(
    () =>
      (walletsQuery.data ?? []).filter((wallet) => wallet.status === "ACTIVE"),
    [walletsQuery.data],
  );

  const form = useForm<FormValues>({
    defaultValues: {
      walletId: "",
      amount: "",
      merchantRef: "",
      externalRef: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!activeWallets.length) {
      return;
    }

    const currentWalletId = form.getValues("walletId");
    const hasCurrentWallet = activeWallets.some(
      (wallet) => wallet.id === currentWalletId,
    );

    if (!hasCurrentWallet) {
      form.setValue("walletId", activeWallets[0].id, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [activeWallets, form]);

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        const selectedWallet = activeWallets.find(
          (wallet) => wallet.id === values.walletId,
        );

        if (!selectedWallet) {
          form.setError("walletId", {
            type: "manual",
            message: "Please choose an active wallet",
          });
          return;
        }

        paymentIntent.mutate({
          ...values,
          currency: selectedWallet.currency as PaymentCurrency,
          merchantRef: values.merchantRef?.trim() || undefined,
          externalRef: values.externalRef?.trim() || undefined,
          description: values.description?.trim() || undefined,
        });
      })}
    >
      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#111827]">
          Wallet currency
        </label>
        <Select {...form.register("walletId", { required: true })}>
          {activeWallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.currency} wallet
            </option>
          ))}
        </Select>
        {!walletsQuery.isLoading && activeWallets.length === 0 ? (
          <p className="text-xs text-[#be2b2b]">
            No active wallet found. Create/activate a wallet before creating a
            payment intent.
          </p>
        ) : null}
      </div>

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

      <Button
        type="submit"
        disabled={
          paymentIntent.isPending ||
          walletsQuery.isLoading ||
          activeWallets.length === 0
        }
      >
        {paymentIntent.isPending
          ? "Creating intent..."
          : "Create payment intent"}
      </Button>
    </form>
  );
}
