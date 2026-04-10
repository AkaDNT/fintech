"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { useToastError } from "@/shared/hooks/use-toast-error";
import { currencyText } from "@/shared/lib/currency";
import type {
  CreatePaymentIntentResponse,
  PaymentActionResponse,
} from "@/modules/payments/types/payment.types";
import { createTopUpIntentByProvider } from "@/modules/payments/api/create-topup-intent-by-provider";
import { settleTopUp } from "@/modules/payments/api/settle-topup";
import type { Wallet } from "@/modules/wallets/types/wallet.types";

type FormValues = {
  walletId: string;
  amount: string;
  merchantRef: string;
  description: string;
};

const STRIPE_TOPUP_LIMITS = {
  VND: {
    min: BigInt("10000"),
    max: BigInt("50000000"),
    helperText: "Valid range: 10,000 to 50,000,000 (minor units)",
    errorText: "Amount must be between 10,000 and 50,000,000 VND",
  },
  USD: {
    min: BigInt("50"),
    max: BigInt("99999999"),
    helperText:
      "Valid range: 50 to 99,999,999 (minor units, equals 0.50 to 999,999.99 USD)",
    errorText: "Amount must be between 0.50 and 999,999.99 USD",
  },
} as const;

function getTopUpLimitByCurrency(currency?: string) {
  if (currency === "USD") {
    return STRIPE_TOPUP_LIMITS.USD;
  }

  return STRIPE_TOPUP_LIMITS.VND;
}

function validateStripeTopUpAmount(value: string, currency?: string) {
  if (!value.trim()) {
    return "Please enter an amount";
  }

  if (!/^[0-9]+$/.test(value)) {
    return "Amount must contain digits only";
  }

  const amount = BigInt(value);
  const limit = getTopUpLimitByCurrency(currency);

  if (amount < limit.min || amount > limit.max) {
    return limit.errorText;
  }

  return true;
}

const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

const cardElementOptions = {
  style: {
    base: {
      color: "#111827",
      fontSize: "16px",
      fontFamily: "inherit",
      "::placeholder": {
        color: "#9aa3b1",
      },
    },
    invalid: {
      color: "#be2b2b",
    },
  },
};

const smallCardElementOptions = {
  ...cardElementOptions,
  style: {
    ...cardElementOptions.style,
    base: {
      ...cardElementOptions.style.base,
      fontSize: "14px",
    },
  },
};

function StripeTopUpForm({ wallets }: { wallets: Wallet[] }) {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();
  const toastError = useToastError();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [lastResult, setLastResult] = useState<PaymentActionResponse | null>(
    null,
  );

  const activeWallets = useMemo(
    () => wallets.filter((wallet) => wallet.status === "ACTIVE"),
    [wallets],
  );

  const form = useForm<FormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      walletId: activeWallets[0]?.id ?? wallets[0]?.id ?? "",
      amount: "",
      merchantRef: "",
      description: "",
    },
  });

  const walletId = form.watch("walletId");
  const selectedWallet =
    wallets.find((wallet) => wallet.id === walletId) ??
    activeWallets[0] ??
    wallets[0];
  const topUpLimit = getTopUpLimitByCurrency(selectedWallet?.currency);

  useEffect(() => {
    if (!wallets.length) {
      return;
    }

    const currentWalletId = form.getValues("walletId");
    const hasCurrentWallet = wallets.some(
      (wallet) => wallet.id === currentWalletId,
    );

    if (!hasCurrentWallet) {
      form.setValue("walletId", activeWallets[0]?.id ?? wallets[0].id, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [activeWallets, form, walletId, wallets]);

  async function handleSubmit(values: FormValues) {
    if (!stripe || !elements) {
      toastError(new Error("Stripe has not loaded yet"), "Stripe is not ready");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    if (!cardNumberElement) {
      toastError(
        new Error("Missing Stripe card number element"),
        "Cannot start top up",
      );
      return;
    }

    if (!selectedWallet) {
      toastError(new Error("No wallet selected"), "Cannot start top up");
      return;
    }

    setIsSubmitting(true);

    try {
      const intent: CreatePaymentIntentResponse =
        await createTopUpIntentByProvider("stripe", {
          walletId: values.walletId,
          amount: values.amount,
          currency: selectedWallet.currency as "VND" | "USD",
          merchantRef: values.merchantRef.trim() || undefined,
          description: values.description.trim() || undefined,
        });

      const clientSecret = intent.providerData?.clientSecret;

      if (!clientSecret) {
        throw new Error("Stripe client secret was not returned by the server");
      }

      const confirmation = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: "Stripe test card",
          },
        },
      });

      if (confirmation.error) {
        throw new Error(
          confirmation.error.message || "Stripe card confirmation failed",
        );
      }

      if (confirmation.paymentIntent?.status !== "succeeded") {
        throw new Error(
          `Stripe payment did not complete successfully: ${confirmation.paymentIntent?.status ?? "unknown"}`,
        );
      }

      const result = await settleTopUp(intent.paymentId);

      setLastResult(result);
      form.reset({
        walletId: values.walletId,
        amount: "",
        merchantRef: "",
        description: "",
      });
      cardNumberElement.clear();
      cardExpiryElement?.clear();
      cardCvcElement?.clear();

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.paymentsBase }),
      ]);

      toast.success("Wallet topped up", {
        description: `${result.amount} ${result.currency} added to ${selectedWallet.currency} wallet`,
      });
    } catch (error) {
      toastError(error, "Cannot complete wallet top up");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!activeWallets.length) {
    return (
      <article className="rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-5">
        <h3 className="text-lg font-bold tracking-tight text-[#111827]">
          Top up wallet
        </h3>
        <p className="mt-2 text-sm text-[#5b667a]">
          No active wallets are available for funding.
        </p>
      </article>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        void handleSubmit(values);
      })}
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-5">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[#111827]">
              Top up wallet
            </h3>
            <p className="mt-1 text-sm text-[#5b667a]">
              Create a Stripe test payment and settle it directly into the
              selected wallet.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#111827]">
              Wallet
            </label>
            <Select {...form.register("walletId", { required: true })}>
              {activeWallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.currency} -{" "}
                  {currencyText(wallet.availableBalance, wallet.currency, {
                    unit: "major",
                  })}{" "}
                  available
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827]">
                Amount (minor units)
              </label>
              <Input
                placeholder="10000"
                inputMode="numeric"
                aria-invalid={Boolean(form.formState.errors.amount)}
                {...form.register("amount", {
                  validate: (value) =>
                    validateStripeTopUpAmount(value, selectedWallet?.currency),
                })}
              />
              <p
                className={
                  form.formState.errors.amount
                    ? "text-xs text-[#be2b2b]"
                    : "text-xs text-[#5b667a]"
                }
              >
                {form.formState.errors.amount?.message ?? topUpLimit.helperText}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827]">
                Currency
              </label>
              <Input value={selectedWallet?.currency ?? ""} disabled />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827]">
                Merchant ref
              </label>
              <Input
                placeholder="topup_20260318"
                {...form.register("merchantRef")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#111827]">
                Description
              </label>
              <Input
                placeholder="Wallet top up"
                {...form.register("description")}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[20px] border border-[#d9deea] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b667a]">
              Stripe card
            </h4>
            <p className="mt-1 text-sm text-[#5b667a]">
              Use the Stripe test Visa 4242 4242 4242 4242 with any future
              expiry date and CVC.
            </p>
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="mt-2 inline-flex text-sm font-semibold text-[#052538] underline underline-offset-2 hover:text-[#0a3b57]"
            >
              Open English test card guide
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-[#d9deea] bg-[#f8fafc] p-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
                Card number
              </label>
              <div className="rounded-xl border border-[#d9deea] bg-white px-3 py-2.5">
                <CardNumberElement options={cardElementOptions} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
                  Expiry
                </label>
                <div className="rounded-xl border border-[#d9deea] bg-white px-3 py-2.5">
                  <CardExpiryElement options={smallCardElementOptions} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
                  CVC
                </label>
                <div className="rounded-xl border border-[#d9deea] bg-white px-3 py-2.5">
                  <CardCvcElement options={smallCardElementOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#d9deea] bg-[#f8fafc] p-4 text-sm text-[#5b667a]">
            <p className="font-semibold text-[#111827]">Preview</p>
            <p className="mt-1">
              Funding {selectedWallet?.currency ?? "wallet"} wallet{" "}
              {selectedWallet ? `(${selectedWallet.id})` : ""}.
            </p>
            <p className="mt-1">
              Available balance:{" "}
              {selectedWallet
                ? currencyText(
                    selectedWallet.availableBalance,
                    selectedWallet.currency,
                    { unit: "major" },
                  )
                : "-"}
            </p>
          </div>

          {lastResult ? (
            <div className="rounded-2xl border border-[#b6e3b1] bg-[#f1fbef] p-4 text-sm text-[#1f5b2a]">
              <p className="font-semibold">Last top up completed</p>
              <p className="mt-1">
                New balance:{" "}
                {currencyText(
                  BigInt(lastResult.walletBalance?.availableBalance ?? "0"),
                  selectedWallet.currency,
                  { unit: "major" },
                )}
              </p>
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !stripe || !elements}
          >
            {isSubmitting
              ? "Processing top up..."
              : "Top up wallet with Stripe"}
          </Button>
        </div>
      </div>

      {isGuideOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#d9deea] bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h5 className="text-base font-bold text-[#111827]">
                  Stripe Test Card Guide
                </h5>
                <p className="mt-1 text-sm text-[#5b667a]">
                  Use these values to simulate successful and failed payments.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="rounded-lg border border-[#d9deea] px-2.5 py-1 text-sm font-semibold text-[#5b667a] hover:bg-[#f3f5fa]"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl border border-[#d9deea] bg-[#f8fafc] p-3">
                <p className="font-semibold text-[#111827]">
                  Successful payment
                </p>
                <p className="mt-1 text-[#5b667a]">Card: 4242 4242 4242 4242</p>
                <p className="text-[#5b667a]">Expiry: any future date</p>
                <p className="text-[#5b667a]">CVC: any 3 digits</p>
              </div>

              <div className="rounded-xl border border-[#d9deea] bg-[#f8fafc] p-3">
                <p className="font-semibold text-[#111827]">
                  Authentication required (3DS)
                </p>
                <p className="mt-1 text-[#5b667a]">Card: 4000 0025 0000 3155</p>
              </div>

              <div className="rounded-xl border border-[#d9deea] bg-[#f8fafc] p-3">
                <p className="font-semibold text-[#111827]">Declined payment</p>
                <p className="mt-1 text-[#5b667a]">Card: 4000 0000 0000 9995</p>
              </div>
            </div>

            <a
              href="https://docs.stripe.com/testing?testing-method=card-numbers"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-[#052538] underline underline-offset-2 hover:text-[#0a3b57]"
            >
              Read full Stripe testing docs
            </a>
          </div>
        </div>
      ) : null}
    </form>
  );
}

export function WalletTopUpCard({ wallets }: { wallets: Wallet[] }) {
  if (!stripePromise) {
    return (
      <article className="rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-5">
        <h3 className="text-lg font-bold tracking-tight text-[#111827]">
          Top up wallet
        </h3>
        <p className="mt-2 text-sm text-[#5b667a]">
          Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable Stripe card entry.
        </p>
      </article>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeTopUpForm wallets={wallets} />
    </Elements>
  );
}
