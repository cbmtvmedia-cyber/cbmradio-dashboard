// 📁 FIXED DYNAMIC LIGHT SIDEBAR: components/sidebar.tsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  themeMode: "dark" | "light" | "system";
  setThemeMode: (mode: "dark" | "light" | "system") => void;
  resolvedDark: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({
  themeMode,
  setThemeMode,
  resolvedDark,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview Matrix", icon: "📊" },
    { href: "/dashboard/page-sections", label: "Page Hero Zones", icon: "🖼️" },
    { href: "/dashboard/team", label: "Station Team", icon: "👥" },
    { href: "/dashboard/programs", label: "Radio Programs", icon: "🎙️" },
    { href: "/dashboard/episodes", label: "Episode Archives", icon: "🎞️" },
    { href: "/dashboard/articles", label: "News Articles", icon: "📰" },
    { href: "/dashboard/gallery", label: "Media Gallery", icon: "🖼️" },
    { href: "/dashboard/comments", label: "User Comments", icon: "💬" },
  ];

  // 🎨 CONTRAST LINK COLORS: Changes colors smoothly based on active theme choice
  const activeLinkClass = resolvedDark
    ? "bg-slate-800 text-emerald-400 border-slate-700/60"
    : "bg-slate-900 text-emerald-400 shadow-md";

  const inactiveLinkClass = resolvedDark
    ? "text-slate-400 hover:bg-slate-800/50 hover:text-white"
    : "text-slate-700 hover:bg-slate-300/60 hover:text-slate-950";

  const brandingLineColor = resolvedDark
    ? "border-slate-800"
    : "border-slate-300";
  const labelTextColor = resolvedDark
    ? "text-slate-500"
    : "text-slate-600 font-bold";

  return (
    <div
      className="w-full flex flex-col justify-between p-4 min-h-full font-sans transition-colors duration-300"
      /* 🚀 THE FIXED INLINE LINE: Guarantees the sidebar turns dark-white in Light Mode instead of staying black */
      style={{ backgroundColor: resolvedDark ? "#0b131a" : "#e2e8f0" }}
    >
      {/* Upper Navigation Links Area */}
      <div className="w-full">
        {/* Station Branding Header */}
        <div
          className={`h-12 flex items-center px-3 border-b ${brandingLineColor} mb-4 whitespace-nowrap`}
        >
          <span className="text-emerald-500 dark:text-emerald-400 font-extrabold tracking-wider text-base">
            RADIO CMS
          </span>
        </div>

        <div
          className={`text-[10px] font-bold uppercase tracking-widest ${labelTextColor} px-3 mb-2 font-mono`}
        >
          Control Tower
        </div>

        <nav className="flex flex-col space-y-1 w-full">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  if (setMobileOpen) setMobileOpen(false);
                }}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition duration-200 border border-transparent w-full ${
                  isActive ? activeLinkClass : inactiveLinkClass
                }`}
              >
                <span className="text-sm shrink-0">{link.icon}</span>
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* LOWER ANCHOR DECK: THE INTEGRATED THEME CONTROLLER SELECTOR */}
      <div className={`pt-4 border-t ${brandingLineColor} mt-6 px-1`}>
        <label
          className={`block text-[10px] font-bold ${labelTextColor} uppercase tracking-widest mb-2 font-mono`}
        >
          Interface Theme
        </label>
        <div className="relative w-full">
          <select
            value={themeMode}
            onChange={(e) =>
              setThemeMode(e.target.value as "dark" | "light" | "system")
            }
            className="w-full text-xs font-bold px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 outline-none cursor-pointer focus:border-emerald-500/50 transition duration-200"
            style={{
              backgroundColor: resolvedDark ? "#1e293b" : "#ffffff",
              borderColor: resolvedDark ? "rgba(255,255,255,0.1)" : "#cbd5e1",
              color: resolvedDark ? "#f8fafc" : "#0f172a",
            }}
          >
            <option
              value="dark"
              style={{ backgroundColor: "#0b131a", color: "#f8fafc" }}
            >
              🌙 Dark Mode
            </option>
            <option
              value="light"
              style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
            >
              ☀️ Light Mode
            </option>
            <option
              value="system"
              style={{
                backgroundColor: resolvedDark ? "#0b131a" : "#ffffff",
                color: resolvedDark ? "#94a3b8" : "#0f172a",
              }}
            >
              💻 System Default
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
