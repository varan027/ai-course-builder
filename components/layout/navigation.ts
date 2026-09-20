import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Plus } from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "New Goal", href: "/create-goal", icon: Plus },
];

export function isNavigationItemActive(
  item: NavigationItem,
  pathname: string,
): boolean {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
