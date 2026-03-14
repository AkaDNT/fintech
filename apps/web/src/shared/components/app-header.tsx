"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/modules/auth/hooks/use-logout";
import { Button } from "@/shared/components/ui/button";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useLogout();

  return (
    <header className="card flex items-center justify-between px-5 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Fintech Operations
        </p>
        <h1 className="text-lg font-bold">{pathname}</h1>
      </div>
      <Button
        variant="ghost"
        onClick={async () => {
          await logoutMutation.mutateAsync();
          router.replace("/login");
        }}
      >
        Logout
      </Button>
    </header>
  );
}
