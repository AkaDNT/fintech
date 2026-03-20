import type { Currency } from "@/shared/types/common.types";

const FRACTION_DIGITS: Record<Currency, number> = {
  VND: 0,
  USD: 2,
};

export function currencyText(
  amountMinor: bigint,
  currency: string,
  options?: { unit?: "minor" | "major" },
) {
  const normalizedCurrency = (currency === "USD" ? "USD" : "VND") as Currency;
  const fractionDigits = FRACTION_DIGITS[normalizedCurrency];
  const isMajorUnit = options?.unit === "major";
  const divisor = isMajorUnit ? BigInt(1) : BigInt(10 ** fractionDigits);

  const isNegative = amountMinor < BigInt(0);
  const absAmount = isNegative ? amountMinor * BigInt(-1) : amountMinor;
  const whole = absAmount / divisor;
  const fraction = absAmount % divisor;

  const wholeText = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const sign = isNegative ? "-" : "";

  if (fractionDigits === 0) {
    return `${sign}${wholeText} ${normalizedCurrency}`;
  }

  const fractionText = fraction.toString().padStart(fractionDigits, "0");
  return `${sign}${wholeText}.${fractionText} ${normalizedCurrency}`;
}
