"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/modules/auth/hooks/use-logout";
import Image from "next/image";

const TITLE_BY_PREFIX: Array<{ prefix: string; title: string }> = [
  { prefix: "/dashboard", title: "Dashboard" },
  { prefix: "/wallets", title: "Wallets" },
  { prefix: "/payments", title: "Payments" },
  { prefix: "/transfer", title: "Transfer" },
  { prefix: "/admin/payments", title: "Admin Payments" },
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
    <header className="flex items-center justify-between overflow-hidden rounded-[20px] border border-white/10 bg-[#052538] px-5 py-3 shadow-[0_8px_24px_rgba(3,25,39,0.35)]">
      <div className="flex items-center gap-3">
        <Image
          src="/yubeepay-logo.svg"
          alt="Yubeepay"
          width={32}
          height={32}
          className="h-8 w-8 rounded-lg"
        />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
            Yubeepay Operations
          </p>
          <h1 className="text-sm font-bold text-white">{title}</h1>
        </div>
      </div>
      <button
        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/20 px-4 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
        onClick={async () => {
          await logoutMutation.mutateAsync();
          router.replace("/");
        }}
      >
        <span>Sign out</span>
        <span className="text-sm leading-none">→</span>
      </button>
    </header>
  );
}
