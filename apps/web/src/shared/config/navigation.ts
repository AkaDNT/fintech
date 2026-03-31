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
  { label: "Webhook Endpoints", href: "/admin/webhooks", roles: ["ADMIN"] },
  {
    label: "Webhook Deliveries",
    href: "/admin/webhook-deliveries",
    roles: ["ADMIN"],
  },
  { label: "Outbox Jobs", href: "/admin/outbox", roles: ["ADMIN"] },
  {
    label: "Observability",
    href: "/admin/observability",
    roles: ["ADMIN"],
  },
  { label: "Admin Users", href: "/admin/users", roles: ["ADMIN"] },
  { label: "Admin Reports", href: "/admin/reports", roles: ["ADMIN"] },
];
