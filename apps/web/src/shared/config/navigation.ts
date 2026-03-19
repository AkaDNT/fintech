import type { UserRole } from "@/shared/types/common.types";

export interface NavigationItem {
  label: string;
  href: string;
  roles?: UserRole[];
}

export const NAV_ITEMS: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", roles: ["USER", "ADMIN"] },
  { label: "Wallets", href: "/wallets", roles: ["USER", "ADMIN"] },
  { label: "Payments", href: "/payments", roles: ["USER", "ADMIN"] },
  { label: "Transfer", href: "/transfer", roles: ["USER", "ADMIN"] },
  { label: "Admin Payments", href: "/admin/payments", roles: ["ADMIN"] },
  { label: "Admin Users", href: "/admin/users", roles: ["ADMIN"] },
  { label: "Admin Reports", href: "/admin/reports", roles: ["ADMIN"] },
];
