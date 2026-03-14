"use client";

import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { useAdjustWallet } from "@/modules/admin-wallets/hooks/use-adjust-wallet";

export function AdjustWalletForm({ walletId }: { walletId: string }) {
  const adjustMutation = useAdjustWallet(walletId);
  const [direction, setDirection] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        adjustMutation.mutate({
          direction,
          payload: { amount, reason },
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold">Direction</label>
          <Select
            value={direction}
            onChange={(event) =>
              setDirection(event.target.value as "CREDIT" | "DEBIT")
            }
          >
            <option value="CREDIT">Credit</option>
            <option value="DEBIT">Debit</option>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">Amount (minor units)</label>
          <Input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Reason</label>
        <Textarea
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </div>

      <Button type="submit" disabled={adjustMutation.isPending}>
        {adjustMutation.isPending ? "Applying..." : "Apply adjustment"}
      </Button>
    </form>
  );
}
