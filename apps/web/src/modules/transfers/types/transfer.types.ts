import type { Currency } from "@/shared/types/common.types";

export interface CreateTransferRequest {
  toUserEmail: string;
  currency: Currency;
  amount: string;
  note?: string;
}

export interface CreateTransferResponse {
  transferTxId: string;
  fromWalletId: string;
  toWalletId: string;
  currency: Currency;
  amount: string;
  createdAt: string;
}
