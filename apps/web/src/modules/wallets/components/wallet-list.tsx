import type { Wallet } from "@/modules/wallets/types/wallet.types";
import { WalletCard } from "@/modules/wallets/components/wallet-card";

export function WalletList({ wallets }: { wallets: Wallet[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </div>
  );
}
