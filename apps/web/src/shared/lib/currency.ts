import type { Currency } from "@/shared/types/common.types";

const FRACTION_DIGITS: Record<Currency, number> = {
  VND: 0,
  USD: 2,
};

export function currencyText(amountMinor: bigint, currency: string) {
  const normalizedCurrency = (currency === "USD" ? "USD" : "VND") as Currency;
  const fractionDigits = FRACTION_DIGITS[normalizedCurrency];
  const divisor = BigInt(10 ** fractionDigits);

  const whole = amountMinor / divisor;
  const fraction = amountMinor % divisor;

  const wholeText = Number(whole).toLocaleString();

  if (fractionDigits === 0) {
    return `${wholeText} ${normalizedCurrency}`;
  }

  const fractionText = fraction.toString().padStart(fractionDigits, "0");
  return `${wholeText}.${fractionText} ${normalizedCurrency}`;
}
