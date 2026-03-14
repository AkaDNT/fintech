"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/shared/api/api-client";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { PageTitle } from "@/shared/components/page-title";
import { RoleGuard } from "@/shared/components/role-guard";

interface LedgerDetail {
  id: string;
  kind: string;
  status: string;
  currency: string;
  amount: string;
  reference: string | null;
  createdBy: string;
  createdAt: string;
  entries: Array<{
    id: string;
    walletId: string;
    type: string;
    amount: string;
    currency: string;
    createdAt: string;
  }>;
}

export default function AdminLedgerTxPage() {
  const params = useParams<{ txId: string }>();

  const txQuery = useQuery({
    queryKey: ["admin-ledger", params.txId],
    queryFn: () =>
      apiRequest<LedgerDetail>(ENDPOINTS.admin.ledger.tx(params.txId)),
  });

  if (txQuery.isLoading) {
    return <LoadingState label="Loading transaction..." />;
  }

  if (txQuery.isError || !txQuery.data) {
    return (
      <ErrorState
        title="Cannot load transaction"
        description={txQuery.error?.message}
      />
    );
  }

  const tx = txQuery.data;

  return (
    <RoleGuard allow={["ADMIN"]}>
      <section className="space-y-4">
        <PageTitle title="Ledger Transaction" subtitle={tx.id} />
        <article className="card p-4">
          <p className="text-sm">Kind: {tx.kind}</p>
          <p className="text-sm">Status: {tx.status}</p>
          <p className="text-sm">
            Amount: {tx.amount} {tx.currency}
          </p>
          <p className="text-sm">Reference: {tx.reference ?? "-"}</p>
        </article>
        <article className="card p-4">
          <h2 className="text-lg font-bold">Entries</h2>
          <ul className="mt-3 space-y-2">
            {tx.entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-border p-3 text-sm"
              >
                <p>
                  {entry.type} {entry.amount} {entry.currency}
                </p>
                <p className="text-muted">Wallet: {entry.walletId}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </RoleGuard>
  );
}
