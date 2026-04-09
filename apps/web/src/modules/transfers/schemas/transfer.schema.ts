import { z } from "zod";

export const transferSchema = z.object({
  toUserEmail: z
    .string()
    .min(1, "Destination email is required")
    .email("Destination email is invalid"),
  currency: z.enum(["VND", "USD"]),
  amount: z.string().regex(/^[0-9]+$/, "Amount must be numeric string"),
  note: z.string().optional(),
});

export type TransferSchemaInput = z.infer<typeof transferSchema>;
