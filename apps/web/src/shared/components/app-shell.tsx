import { AppHeader } from "@/shared/components/app-header";
import { AppSidebar } from "@/shared/components/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6">
      <AppHeader />
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <AppSidebar />
        <main className="card min-h-[70vh] p-5">{children}</main>
      </div>
    </div>
  );
}
