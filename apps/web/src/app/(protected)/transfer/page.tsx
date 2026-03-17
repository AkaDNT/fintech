import { TransferForm } from "@/modules/transfers/components/transfer-form";
import { PageTitle } from "@/shared/components/page-title";

export default function TransferPage() {
  return (
    <section className="space-y-6">
      <PageTitle
        title="Create Transfer"
        subtitle="Internal transfer between wallets"
      />
      <div className="rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-6">
        <TransferForm />
      </div>
    </section>
  );
}
