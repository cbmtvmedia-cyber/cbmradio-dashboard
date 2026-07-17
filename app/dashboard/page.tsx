// 📁 FILE PATH: app/dashboard/page.tsx - BLOCK 1 OF 4
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  MessageSquare, 
  Newspaper, 
  Image as ImageIcon, 
  ArrowUpRight, 
  Play, 
  Users,
  Activity
} from "lucide-react";
import { 
  initialTeamMembers, 
  initialPrograms, 
  initialEpisodes, 
  initialArticles, 
  initialGallery, 
  initialComments 
} from "../service/mockdata";

interface EpisodeSchema {
  id: string;
  programTitle: string;
  title: string;
  description: string;
  thumbnailImage: string;
  youtubeLink: string;
  downloadLink: string;
  publishDate: string;
}

interface ProgramSchema {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  presenter: string;
}

interface ArticleSchema {
  id: string;
  title: string;
  summary: string;
  content: string;
  status: string;
  date: string;
  image: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [liveEpisodes, setLiveEpisodes] = useState<EpisodeSchema[]>([]);
  const [livePrograms, setLivePrograms] = useState<ProgramSchema[]>([]);
  const [liveArticles, setLiveArticles] = useState<ArticleSchema[]>([]);

  // 🔄 SLIDER INDEX TRACKERS
  const [currentProgIndex, setCurrentProgIndex] = useState(0);
  const [currentEpIndex, setCurrentEpIndex] = useState(0);

  const [counts, setCounts] = useState({
    team: 0,
    programs: 0,
    episodes: 0,
    articles: 0,
    gallery: 0,
    comments: 0,
    activeListeners: 20,
    dailyVisitors: 142,
    audioDownloads: 109
  });

  useEffect(() => {
    // 🧠 SYSTEM DEFAULT LOGIC: Checks local preference first, otherwise matches native OS settings
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      if (savedTheme === "dark" || (!savedTheme && prefersSystemDark)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    const updateAllLiveCounts = () => {
      if (typeof window !== "undefined") {
        const savedEps = localStorage.getItem("radio_episodes");
        const savedProgs = localStorage.getItem("radio_programs");
        const savedArts = localStorage.getItem("radio_articles");
        
        const currentEps = savedEps ? JSON.parse(savedEps) : initialEpisodes;
        const currentProgs = savedProgs ? JSON.parse(savedProgs) : initialPrograms;
        const currentArts = savedArts ? JSON.parse(savedArts) : initialArticles;

        setLiveEpisodes(currentEps);
        setLivePrograms(currentProgs);
        setLiveArticles(currentArts);

        setCounts({
          team: initialTeamMembers?.length || 0,
          programs: currentProgs?.length || 0,
          episodes: currentEps?.length || 0,
          articles: currentArts?.length || 0,
          gallery: initialGallery?.length || 0,
          comments: initialComments?.length || 0,
          activeListeners: Math.floor(Math.random() * 10) + 18,
          dailyVisitors: 142,
          audioDownloads: 109 + (currentEps?.length || 0) * 3
        });
      }
      setLoading(false);
    };

    updateAllLiveCounts();

    const studioTickerInterval = setInterval(() => {
      setCounts(prev => ({
        ...prev,
        activeListeners: Math.max(8, prev.activeListeners + (Math.floor(Math.random() * 3) - 1)),
        dailyVisitors: prev.dailyVisitors + (Math.random() > 0.85 ? 1 : 0),
        audioDownloads: prev.audioDownloads + (Math.random() > 0.5 ? 1 : 0)
      }));
    }, 4000);

    const contentRotationInterval = setInterval(() => {
      setCurrentProgIndex(prev => prev + 1);
      setCurrentEpIndex(prev => prev + 1);
    }, 5000);

    return () => {
      clearInterval(studioTickerInterval);
      clearInterval(contentRotationInterval);
    };
  }, []);

  if (loading) return (
    <div className="p-4 text-xs text-slate-500 animate-pulse font-mono min-h-screen bg-slate-950">📡 Handshaking Theme Parameters...</div>
  );

  const activeMainEpisode = liveEpisodes[0] || null;
  const activeLatestArticle = liveArticles[0] || null;
  
  const activeSlidingProgram = livePrograms.length > 0 ? livePrograms[currentProgIndex % livePrograms.length] : null;
  const activeSlidingEpisode = liveEpisodes.length > 0 ? liveEpisodes[currentEpIndex % liveEpisodes.length] : null;
// 📁 FILE PATH: app/dashboard/page.tsx - BLOCK 2 OF 4
  return (
    <div className="space-y-6 view-fade px-1 sm:px-0 select-none text-xs text-slate-400 bg-slate-950 min-h-screen p-4">
      
      {/* BRANDING HUB TITLE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-black uppercase text-white flex items-center gap-2 tracking-wide">
            <span className="text-emerald-500 font-mono font-bold">|</span> CONTROL STATION
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Comprehensive real-time reporting console mapping database logs and network traffic metrics.</p>
        </div>
      </div>

      {/* MAIN TWO-COLUMN STUDIO PRESENTATION SPLIT LAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* 📺 LEFT COLUMN (7 SPANS): MEDIA PERFORMANCE WORKSPACE */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* ⚡ FIXED DARK THEME OVERRIDE: Switched panel container styling background to crisp deep slate-900 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 min-h-[220px] flex flex-col justify-between shadow-sm">
            {activeMainEpisode ? (
              <div className="space-y-4 animate-slide flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Latest Episode Performance</h3>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800 mt-3 group">
                    <Image 
                      src={activeMainEpisode.thumbnailImage || "https://unsplash.com"} 
                      alt={activeMainEpisode.title} 
                      fill 
                      className="object-cover transition duration-300 group-hover:scale-101"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md hover:bg-emerald-600 transition">
                        <Play className="w-4 h-4 fill-current stroke-none pl-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 bg-slate-950/90 px-2 py-0.5 font-mono text-[9px] rounded text-white uppercase border border-slate-800 tracking-wider font-bold">
                      {activeMainEpisode.programTitle}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-3 truncate">{activeMainEpisode.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{activeMainEpisode.description || "No description logged for this broadcast asset slot."}</p>
                </div>
                
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Published: {activeMainEpisode.publishDate}</span>
                  <a href={activeMainEpisode.youtubeLink} target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline flex items-center gap-0.5">
                    See Video Metrics <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 font-mono text-slate-500 text-[10px]">No active episode parameters cached.</div>
            )}
          </div>

          {/* ⚡ WIDENED PANEL FIX: Removed width caps so the bulletin covers the entire bottom row workspace block */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm w-full">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Latest Article Bulletin</h3>
            
            {activeLatestArticle ? (
              <div className="mt-3 flex gap-4 animate-slide items-start w-full">
                <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                  <Image 
                    src={activeLatestArticle.image || "https://unsplash.com"} 
                    alt={activeLatestArticle.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 text-left flex-1 flex flex-col justify-between min-h-[80px] w-full">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black uppercase px-1.5 py-0.2 rounded font-mono">
                        {activeLatestArticle.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono font-medium">{activeLatestArticle.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wide mt-1.5 truncate">
                      {activeLatestArticle.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {activeLatestArticle.summary}
                    </p>
                  </div>
                  <a href="/dashboard/articles" className="text-emerald-400 font-bold hover:underline flex items-center gap-0.5 text-[10px] mt-2 self-start">
                    Read Full Bulletin <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 font-mono text-slate-600 text-[10px]">No active text bulletins published.</div>
            )}
          </div>

        </div>


        {/* 📊 RIGHT COLUMN (5 SPANS): THE AUTOMATICALLY SLIDING DECK SIDEBAR */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* CARD A: CHANNEL ANALYTICS TRAFFIC PULSE PANEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-black text-white font-sans tracking-tight">Channel Analytics</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold mt-0.5">Summary • Last 28 Days</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Live Counts
              </div>
            </div>

            <div className="space-y-3 pt-1 border-t border-slate-800/60 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 font-medium">Platform Play Views</span>
                <span className="font-bold text-white font-mono text-sm tracking-tight transition duration-150 animate-pulse">{counts.audioDownloads}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 font-medium">Daily Unique Visitors</span>
                <span className="font-bold text-white font-mono text-sm tracking-tight">{counts.dailyVisitors}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 font-medium flex items-center gap-1"><Activity className="w-3 h-3 text-rose-500 animate-pulse" /> Listeners Active Now</span>
                <span className="font-black text-rose-500 font-mono text-sm animate-pulse">{counts.activeListeners}</span>
              </div>
            </div>
          </div>

          {/* CARD B: AUTOMATICALLY SLIDING TOTAL PROGRAMS SUB-BLOCK CONTAINER */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-white uppercase tracking-wide font-sans text-left">Programs Analytics</h4>
              <p className="text-[10px] text-slate-500 font-mono font-bold uppercase text-left">Active Station Show Registry</p>
            </div>

            {activeSlidingProgram ? (
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between transition hover:border-slate-700/80 form-slide">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="relative w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 shrink-0 overflow-hidden">
                    <Image 
                      src={activeSlidingProgram.coverImage || "https://unsplash.com"} 
                      alt="Programs Icon" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 text-left space-y-0.5">
                    <p className="text-xs font-bold text-white uppercase tracking-wide font-mono truncate">{activeSlidingProgram.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-none">Total Running Programs</p>
                  </div>
                </div>
                <div className="font-mono font-black text-emerald-400 text-xs shrink-0 bg-slate-900 px-2.5 py-1 border border-slate-800 rounded-lg shadow-sm ml-2">
                  {counts.programs}
                </div>
              </div>
            ) : null}

            <div className="pt-2">
              <a href="/dashboard/programs" className="w-full py-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-bold rounded-md transition text-center uppercase tracking-wider block text-[10px] shadow-sm">
                Go to programs analytics
              </a>
            </div>
          </div>

          {/* CARD C: AUTOMATICALLY SLIDING TOTAL EPISODES SUB-BLOCK CONTAINER */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-white uppercase tracking-wide font-sans text-left">Episodes Analytics</h4>
              <p className="text-[10px] text-slate-500 font-mono font-bold uppercase text-left">Broadcast Catalog Metrics</p>
            </div>

            {activeSlidingEpisode ? (
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between transition hover:border-slate-700/80 form-slide">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="relative w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 shrink-0 overflow-hidden">
                    <Image 
                      src={activeSlidingEpisode.thumbnailImage || "https://unsplash.com"} 
                      alt="Episodes Icon" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 text-left space-y-0.5">
                    <p className="text-xs font-bold text-white uppercase tracking-wide font-mono truncate">{activeSlidingEpisode.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">Total Published Episodes</p>
                  </div>
                </div>
                <div className="font-mono font-black text-purple-400 text-xs shrink-0 bg-slate-900 px-2.5 py-1 border border-slate-800 rounded-lg shadow-sm ml-2">
                  {counts.episodes}
                </div>
              </div>
            ) : null}

            <div className="pt-2">
              <a href="/dashboard/episodes" className="w-full py-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-bold rounded-md transition text-center uppercase tracking-wider block text-[10px] shadow-sm">
                Go to episodes analytics
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* 📊 OVERHAULED METADATA MATRIX DECK: High-contrast slate-900 grid cards replace the flat layout lines natively */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[95px] shadow-md hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-500 font-bold uppercase tracking-wider font-mono text-[9px] sm:text-[10px]">
            <span>Comments Log</span>
            <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">{counts.comments}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[95px] shadow-md hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-500 font-bold uppercase tracking-wider font-mono text-[9px] sm:text-[10px]">
            <span>Bulletins Published</span>
            <Newspaper className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">{counts.articles}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[95px] shadow-md hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-500 font-bold uppercase tracking-wider font-mono text-[9px] sm:text-[10px]">
            <span>Gallery CDN Links</span>
            <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">{counts.gallery}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[95px] shadow-md hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-500 font-bold uppercase tracking-wider font-mono text-[9px] sm:text-[10px]">
            <span>Staff Roster</span>
            <Users className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">{counts.team}</div>
        </div>

      </div>

    </div>
  );
}
