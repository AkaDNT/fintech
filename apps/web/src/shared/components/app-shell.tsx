import { AppHeader } from "@/shared/components/app-header";
import { AppSidebar } from "@/shared/components/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#052538] px-3 py-3">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <AppHeader />
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <AppSidebar />
          <main className="min-h-[50vh] overflow-hidden rounded-[20px] border border-[#d9deea] bg-white p-6 shadow-[0_8px_24px_rgba(5,37,56,0.08)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
