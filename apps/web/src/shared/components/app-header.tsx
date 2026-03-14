"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/modules/auth/hooks/use-logout";
import { Button } from "@/shared/components/ui/button";

const TITLE_BY_PREFIX: Array<{ prefix: string; title: string }> = [
  { prefix: "/dashboard", title: "Dashboard" },
  { prefix: "/wallets", title: "Wallets" },
  { prefix: "/transfer", title: "Transfer" },
  { prefix: "/admin/reports", title: "Admin Reports" },
  { prefix: "/admin/users", title: "Admin Users" },
  { prefix: "/admin/ledger", title: "Ledger Detail" },
  { prefix: "/admin/wallets", title: "Admin Wallets" },
];

function resolveHeaderTitle(pathname: string) {
  if (pathname === "/") return "Home";

  const found = TITLE_BY_PREFIX.find((item) =>
    pathname.startsWith(item.prefix),
  );
  return found?.title ?? pathname;
}

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useLogout();
  const title = resolveHeaderTitle(pathname);

  return (
    <header className="card flex items-center justify-between px-5 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Fintech Operations
        </p>
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      <Button
        variant="ghost"
        onClick={async () => {
          await logoutMutation.mutateAsync();
          router.replace("/");
        }}
      >
        Logout
      </Button>
    </header>
  );
}
