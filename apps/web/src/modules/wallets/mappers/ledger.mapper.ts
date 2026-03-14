import type { WalletDto, Wallet } from "@/modules/wallets/types/wallet.types";

export function mapWallet(dto: WalletDto): Wallet {
  return {
    ...dto,
    availableBalance: BigInt(dto.availableBalance),
    lockedBalance: BigInt(dto.lockedBalance),
  };
}
