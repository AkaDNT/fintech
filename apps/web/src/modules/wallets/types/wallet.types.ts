export interface WalletDto {
  id: string;
  currency: string;
  status: string;
  availableBalance: string;
  lockedBalance: string;
}

export interface Wallet {
  id: string;
  currency: string;
  status: string;
  availableBalance: bigint;
  lockedBalance: bigint;
}

export interface LedgerEntryDto {
  id: string;
  walletId: string;
  type: string;
  amount: string;
  currency: string;
  createdAt: string;
}

export interface LedgerTransactionDto {
  id: string;
  kind: string;
  status: string;
  currency: string;
  amount: string;
  reference: string | null;
  createdBy: string;
  createdAt: string;
  entries: LedgerEntryDto[];
}

export interface WalletLedgerDto {
  items: LedgerTransactionDto[];
  nextCursor: string | null;
}
