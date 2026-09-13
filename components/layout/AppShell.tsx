"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { logout } from "@/actions/logout";
import { navigationItems, isNavigationItemActive } from "./navigation";

function Brand() {
  return (
    <Link href="/dashboard" className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <div className="text-base font-semibold tracking-tight text-foreground">Syllarc</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">Learning OS</div>
    </Link>
  );
}

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = isNavigationItemActive(item, pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              active
                ? "bg-white/[0.07] text-foreground"
                : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
            }`}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.8} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary ${compact ? "justify-center" : ""}`}
      >
        <LogOut className="size-4 shrink-0" strokeWidth={1.8} />
        {!compact && <span>Log out</span>}
      </button>
    </form>
  );
}

function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.08] bg-[#080808] lg:flex lg:flex-col">
      <div className="flex h-full flex-col px-4 py-5">
        <div className="px-3 pb-7">
          <Brand />
        </div>

        <NavItems />

        <div className="mt-auto border-t border-white/[0.07] pt-3">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button
        type="button"
        aria-label="Close navigation"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <aside className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col border-r border-white/[0.08] bg-[#080808] px-4 py-5 shadow-2xl">
        <div className="mb-8 flex items-start justify-between px-3">
          <Brand />
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground outline-none hover:bg-white/[0.04] hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="size-5" />
          </button>
        </div>

        <NavItems onNavigate={onClose} />

        <div className="mt-auto border-t border-white/[0.07] pt-3">
          <LogoutButton />
        </div>
      </aside>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DesktopSidebar />

      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#080808]/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Brand />
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-muted-foreground outline-none hover:bg-white/[0.04] hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-64">
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
