-- Add baseline monetary invariants at the database layer.
ALTER TABLE "Wallet"
ADD CONSTRAINT "Wallet_availableBalance_non_negative_chk"
CHECK ("availableBalance" >= 0);

ALTER TABLE "Wallet"
ADD CONSTRAINT "Wallet_lockedBalance_non_negative_chk"
CHECK ("lockedBalance" >= 0);

ALTER TABLE "LedgerTransaction"
ADD CONSTRAINT "LedgerTransaction_amount_positive_chk"
CHECK ("amount" > 0);

ALTER TABLE "LedgerEntry"
ADD CONSTRAINT "LedgerEntry_amount_positive_chk"
CHECK ("amount" > 0);

ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_amount_positive_chk"
CHECK ("amount" > 0);

ALTER TABLE "HoldRecord"
ADD CONSTRAINT "HoldRecord_amount_positive_chk"
CHECK ("amount" > 0);
