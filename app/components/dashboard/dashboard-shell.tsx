"use client";

import { useRef, useState } from "react";
import AuthGuard from "./auth-guard";
import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import MobileDashboardNavigation from "./mobile-dashboard-navigation";
import { DashboardThemeProvider } from "./theme-provider";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return <DashboardThemeProvider><AuthGuard>{(user) => <AuthenticatedShell user={user}>{children}</AuthenticatedShell>}</AuthGuard></DashboardThemeProvider>;
}

function AuthenticatedShell({ user, children }: { user: import("../../lib/backend-auth").AdminUser; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  return <div className="dashboard-shell"><aside className="dashboard-desktop-sidebar"><DashboardSidebar /></aside><MobileDashboardNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} triggerRef={menuTriggerRef} /><div className="dashboard-workspace"><DashboardHeader user={user} navigationOpen={mobileOpen} onOpenNavigation={() => setMobileOpen(true)} menuTriggerRef={menuTriggerRef} /><main className="dashboard-main"><div>{children}</div></main></div></div>;
}
