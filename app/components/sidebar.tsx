// 📁 FILE LOCATION ON YOUR LAPTOP: components/sidebar.tsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  
  const links = [
    { href: "/dashboard", label: "Overview Matrix", icon: "📊" },
    // 📁 FIXED LINK: Added the "s" back to match your folder name exactly
    { href: "/dashboard/page-sections", label: "Page Hero Zones", icon: "🖼️" },
    { href: "/dashboard/team", label: "Station Team", icon: "👥" },
    { href: "/dashboard/programs", label: "Radio Programs", icon: "🎙️" },
    { href: "/dashboard/episodes", label: "Episode Archives", icon: "🎞️" },
    { href: "/dashboard/articles", label: "News Articles", icon: "📰" },
    { href: "/dashboard/gallery", label: "Media Gallery", icon: "🖼️" },
    { href: "/dashboard/comments", label: "User Comments", icon: "💬" },
  ];

  return (
    <div className="w-full flex flex-col bg-slate-900 text-slate-100 font-sans p-4">
      {/* Station Branding Header */}
      <div className="h-12 flex items-center px-3 border-b border-slate-800 mb-4 whitespace-nowrap">
        <span className="text-emerald-400 font-bold tracking-wider text-base">RADIO CMS</span>
      </div>

      {/* Navigation Link Stack */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
        Control Tower
      </div>
      
      <nav className="flex flex-col space-y-1 w-full">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition w-full ${
                isActive 
                  ? "bg-slate-800 text-emerald-400 font-semibold border border-slate-700" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span className="text-sm shrink-0">{link.icon}</span>
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
