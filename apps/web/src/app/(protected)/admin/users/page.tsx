import { PageTitle } from "@/shared/components/page-title";
import { RoleGuard } from "@/shared/components/role-guard";
import { AdminUserProvisionForm } from "@/modules/auth/components/admin-user-provision-form";

export default function AdminUsersPage() {
  return (
    <RoleGuard allow={["ADMIN"]}>
      <section className="space-y-5">
        <PageTitle
          title="Admin User Provisioning"
          subtitle="Create users and initialize wallets"
        />
        <AdminUserProvisionForm />
      </section>
    </RoleGuard>
  );
}
