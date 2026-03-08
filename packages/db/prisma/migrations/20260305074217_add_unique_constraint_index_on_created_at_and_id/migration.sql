/*
  Warnings:

  - A unique constraint covering the columns `[createdAt,id]` on the table `LedgerTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "LedgerTransaction_createdAt_id_idx" ON "LedgerTransaction"("createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerTransaction_createdAt_id_key" ON "LedgerTransaction"("createdAt", "id");
