import { TransferForm } from "@/modules/transfers/components/transfer-form";
import { PageTitle } from "@/shared/components/page-title";

export default function TransferPage() {
  return (
    <section className="space-y-5">
      <PageTitle
        title="Create Transfer"
        subtitle="Internal transfer between wallets"
      />
      <div className="card p-5">
        <TransferForm />
      </div>
    </section>
  );
}
