"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/utils";
import { useAuthContext } from "@/providers/auth-provider";

export function AppSidebar() {
  const pathname = usePathname();
  const { role } = useAuthContext();

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!role) return false;
    return item.roles.includes(role);
  });

  return (
    <aside className="h-fit overflow-hidden rounded-[20px] border border-[#d9deea] bg-white shadow-[0_8px_24px_rgba(5,37,56,0.06)]">
      <div className="border-b border-[#d9deea] bg-[#f3f5fa] px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5b667a]">
          Menu
        </p>
      </div>
      <nav className="space-y-0.5 p-2">
        {visibleItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-[#052538] text-white shadow-[0_4px_10px_rgba(5,37,56,0.25)]"
                  : "text-[#30384a] hover:bg-[#e8edf7]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
