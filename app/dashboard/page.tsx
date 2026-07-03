"use client";
import React from "react";
// 📁 SECURED SYSTEM PATHS: Step back one level (../) to read the mock data values
import {
  initialTeamMembers,
  initialPrograms,
  initialEpisodes,
  initialArticles,
  initialGallery,
  initialComments,
} from "../service/mockdata";

export default function DashboardPage() {
  return (
    <div className="space-y-8 view-fade">
      {/* 📋 REQUIREMENTS TITLE BLOCK */}
      <div>
        <h1 className="text-xl font-bold text-white uppercase tracking-wider text-emerald-400">
          Dashboard Home
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 font-sans">
          Provide an overview of the entire platform metrics database records.
        </p>
      </div>

      {/* 📊 THE RENDERED METRIC GRID CONTAINING THE 6 EXACT BLOCKS REQUESTED IN YOUR DOC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* TILE 1: TOTAL TEAM MEMBERS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider font-mono">
            👥 Total Team Members
          </span>
          <div className="text-3xl font-extrabold text-white mt-1">
            {initialTeamMembers ? initialTeamMembers.length : 0}
          </div>
        </div>

        {/* TILE 2: TOTAL PROGRAMS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider font-mono">
            🎙️ Total Programs
          </span>
          <div className="text-3xl font-extrabold text-white mt-1">
            {initialPrograms ? initialPrograms.length : 0}
          </div>
        </div>

        {/* TILE 3: TOTAL EPISODES */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider font-mono">
            🎞️ Total Episodes
          </span>
          <div className="text-3xl font-extrabold text-white mt-1">
            {initialEpisodes ? initialEpisodes.length : 0}
          </div>
        </div>
        {/* TILE 4: TOTAL ARTICLES */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider font-mono">
            📰 Total Articles
          </span>
          <div className="text-3xl font-extrabold text-white mt-1">
            {initialArticles ? initialArticles.length : 0}
          </div>
        </div>

        {/* TILE 5: TOTAL GALLERY ITEMS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider font-mono">
            🖼️ Total Gallery Items
          </span>
          <div className="text-3xl font-extrabold text-white mt-1">
            {initialGallery ? initialGallery.length : 0}
          </div>
        </div>

        {/* TILE 6: TOTAL COMMENTS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider font-mono">
            💬 Total Comments
          </span>
          <div className="text-3xl font-extrabold text-white mt-1">
            {initialComments ? initialComments.length : 0}
          </div>
        </div>
      </div>
    </div>
  );
}
