"use client";

import { Menu } from "lucide-react";
import type { AdminUser } from "../../lib/backend-auth";
import ProfileMenu from "./profile-menu";

export default function DashboardHeader({ user, navigationOpen, onOpenNavigation, menuTriggerRef }: { user: AdminUser; navigationOpen: boolean; onOpenNavigation: () => void; menuTriggerRef: React.RefObject<HTMLButtonElement | null> }) {
  return <header className="dashboard-header"><div><button ref={menuTriggerRef} type="button" className="dashboard-menu-trigger" onClick={onOpenNavigation} aria-label="Open dashboard navigation" aria-expanded={navigationOpen} aria-controls="dashboard-mobile-navigation"><Menu aria-hidden="true" /></button><p>Control Station</p></div><ProfileMenu user={user} /></header>;
}
