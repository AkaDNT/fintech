"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="card h-fit p-3">
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Navigation
      </p>
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-primary text-white"
                  : "text-app-foreground hover:bg-surface-2",
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
