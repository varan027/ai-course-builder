export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
