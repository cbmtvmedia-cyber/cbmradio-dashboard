import { Film, Image, LayoutDashboard, LayoutTemplate, MessageSquare, Newspaper, Radio, Users, type LucideIcon } from "lucide-react";

export type DashboardNavigationItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };
export type DashboardNavigationGroup = { label: string; items: DashboardNavigationItem[] };

export const dashboardNavigation: DashboardNavigationGroup[] = [
  { label: "Overview", items: [{ href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true }] },
  { label: "Content", items: [
    { href: "/dashboard/programs", label: "Programs", icon: Radio },
    { href: "/dashboard/episodes", label: "Episodes", icon: Film },
    { href: "/dashboard/articles", label: "Articles", icon: Newspaper },
    { href: "/dashboard/gallery", label: "Gallery", icon: Image },
  ] },
  { label: "People and Engagement", items: [
    { href: "/dashboard/team", label: "Team", icon: Users },
    { href: "/dashboard/comments", label: "Comments", icon: MessageSquare },
  ] },
  { label: "Site Management", items: [{ href: "/dashboard/page-sections", label: "Page Sections", icon: LayoutTemplate }] },
];

export function dashboardRouteIsActive(pathname: string, item: DashboardNavigationItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
