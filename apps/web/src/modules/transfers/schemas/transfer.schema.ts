import { z } from "zod";

export const transferSchema = z.object({
  toUserId: z.string().min(1, "Destination user is required"),
  currency: z.enum(["VND", "USD"]),
  amount: z.string().regex(/^[0-9]+$/, "Amount must be numeric string"),
  note: z.string().optional(),
});

export type TransferSchemaInput = z.infer<typeof transferSchema>;
