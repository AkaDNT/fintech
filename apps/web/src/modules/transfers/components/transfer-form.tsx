"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transferSchema,
  type TransferSchemaInput,
} from "@/modules/transfers/schemas/transfer.schema";
import { useCreateTransfer } from "@/modules/transfers/hooks/use-create-transfer";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";

export function TransferForm() {
  const createTransferMutation = useCreateTransfer();
  const form = useForm<TransferSchemaInput>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      toUserEmail: "",
      currency: "VND",
      amount: "",
      note: "",
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        createTransferMutation.mutate(values, {
          onSuccess: () => {
            form.reset({
              toUserEmail: "",
              currency: "VND",
              amount: "",
              note: "",
            });
          },
        });
      })}
    >
      <div className="space-y-1">
        <label className="text-sm font-semibold">To User Email</label>
        <Input
          placeholder="user@example.com"
          {...form.register("toUserEmail")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold">Currency</label>
          <Select {...form.register("currency")}>
            <option value="VND">VND</option>
            <option value="USD">USD</option>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Amount</label>
          <Input {...form.register("amount")} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Note</label>
        <Textarea rows={3} {...form.register("note")} />
      </div>

      <Button type="submit" disabled={createTransferMutation.isPending}>
        {createTransferMutation.isPending ? "Submitting..." : "Create transfer"}
      </Button>
    </form>
  );
}
