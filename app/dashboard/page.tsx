// 📁 MODERN METRICS CONTAINER: app/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
// ⚡ IMPORT SYSTEM METRICS DESIGN VECTORS FROM LUCIDE
import {
  Users,
  Radio,
  Film,
  Newspaper,
  Image,
  MessageSquare,
} from "lucide-react";
import {
  initialTeamMembers,
  initialPrograms,
  initialEpisodes,
  initialArticles,
  initialGallery,
  initialComments,
} from "../service/mockdata";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <div className="p-4 text-xs text-slate-500 animate-pulse font-mono">
        📡 Loading CMS Grid Metrics...
      </div>
    );

  // Configuration helper map containing data parameters end-to-end
  const tilesData = [
    {
      title: "Team Members",
      count: initialTeamMembers?.length || 0,
      icon: Users,
      color: "text-blue-500 dark:text-blue-400",
    },
    {
      title: "Programs",
      count: initialPrograms?.length || 0,
      icon: Radio,
      color: "text-emerald-500 dark:text-emerald-400",
    },
    {
      title: "Episodes",
      count: initialEpisodes?.length || 0,
      icon: Film,
      color: "text-purple-500 dark:text-purple-400",
    },
    {
      title: "Articles",
      count: initialArticles?.length || 0,
      icon: Newspaper,
      color: "text-amber-500 dark:text-amber-400",
    },
    {
      title: "Gallery",
      count: initialGallery?.length || 0,
      icon: Image,
      color: "text-cyan-500 dark:text-cyan-400",
    },
    {
      title: "Comments",
      count: initialComments?.length || 0,
      icon: MessageSquare,
      color: "text-rose-500 dark:text-rose-400",
    },
  ];

  return (
    <div className="space-y-5 view-fade px-1 sm:px-0">
      <div>
        <h1 className="text-base sm:text-xl font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
          Dashboard Home
        </h1>
        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
          Centralized platform metrics database logs.
        </p>
      </div>

      {/* 📊 SIDE-BY-SIDE 2 COLUMN MOBILE GRID COMPLIANT */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {tilesData.map((tile, index) => {
          const TileIcon = tile.icon;
          return (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-5 shadow-sm hover:border-slate-700 dark:hover:border-slate-700/60 transition flex flex-col justify-between min-h-[105px] sm:min-h-[120px]"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase tracking-wider font-mono truncate mr-1">
                  {tile.title}
                </span>
                {/* ⚡ PREMIUM ICON GRAPHIC INTEGRATION */}
                <TileIcon
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${tile.color} stroke-[2.25]`}
                />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-auto">
                {tile.count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
