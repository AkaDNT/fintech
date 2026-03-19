import type {
  Payment,
  PaymentDto,
} from "@/modules/payments/types/payment.types";

export function mapPayment(dto: PaymentDto): Payment {
  return {
    ...dto,
    amount: BigInt(String(dto.amount)),
  };
}
