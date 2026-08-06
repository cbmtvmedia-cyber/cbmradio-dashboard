"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, SunMoon } from "lucide-react";
import { dashboardNavigation, dashboardRouteIsActive } from "../../data/dashboard-navigation";
import { useDashboardTheme, type ThemeMode } from "./theme-provider";

export default function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { mode, setMode } = useDashboardTheme();
  return <div className="dashboard-sidebar-inner">
    <div><div className="dashboard-brand"><Radio aria-hidden="true" /><span>CBM</span></div>
      <nav aria-label="Dashboard navigation" className="dashboard-navigation">
        {dashboardNavigation.map((group) => <div key={group.label} className="dashboard-nav-group"><p>{group.label}</p>{group.items.map((item) => { const Icon=item.icon; const active=dashboardRouteIsActive(pathname,item); return <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={active ? "is-active" : undefined}><Icon aria-hidden="true" /><span>{item.label}</span></Link>; })}</div>)}
      </nav>
    </div>
    <label className="dashboard-theme-control"><span><SunMoon aria-hidden="true" /> Interface theme</span><select value={mode} onChange={(event) => setMode(event.target.value as ThemeMode)}><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></select></label>
  </div>;
}
