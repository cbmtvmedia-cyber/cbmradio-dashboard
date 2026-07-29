"use client";
import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import Image from "next/image";
import Sidebar from "../components/sidebar";
// ⚡ Link your exact local database file mock arrays
import {
  initialTeamMembers,
  initialPrograms,
  initialEpisodes,
  initialArticles,
  initialGallery,
  initialComments
} from "../service/mockdata";

// 🧠 Create the master communication context pipe to share totals live
const CMSContext = createContext<unknown>(null);
export const useCMS = () => useContext(CMSContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "system">("system");
  const [resolvedDark, setResolvedDark] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    email: string;
    photo: string | null;
  }>({
    username: "Admin",
    email: "",
    photo: null,
  });

  // 📁 LIVE STATE TRACKING VAULTS: Keeps counts accurate when items change
  const [team, setTeam] = useState(initialTeamMembers);
  const [programs, setPrograms] = useState(initialPrograms);
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [articles, setArticles] = useState(initialArticles);
  const [gallery, setGallery] = useState(initialGallery);
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (themeMode === "dark" || (themeMode === "system" && systemDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
    if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => setResolvedDark(e.matches);
      Promise.resolve().then(() => setResolvedDark(mediaQuery.matches));
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      Promise.resolve().then(() => setResolvedDark(themeMode === "dark"));
    }
  }, [themeMode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (resolvedDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [resolvedDark]);

  useEffect(() => {
    let active = true;

    async function loadCurrentAdmin() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok || !data.user) {
          window.location.replace("/login");
          return;
        }

        if (active) {
          setCurrentUser((user) => ({
            ...user,
            username: data.user.username,
            email: data.user.email,
          }));
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch {
        // Keep the dashboard visible during a temporary network interruption.
      }
    }

    loadCurrentAdmin();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const id = "radio-dashboard-universal-theme-animations";
    let tag = document.getElementById(id) as HTMLStyleElement;
    if (!tag) {
      tag = document.createElement("style");
      tag.id = id;
      document.head.appendChild(tag);
    }
    tag.innerHTML = `
      .view-fade { animation: dFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .form-slide { animation: dSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      @keyframes dFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes dSlideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .bg-slate-900 { background-color: ${resolvedDark ? "rgba(11,27,38,0.45)" : "#ffffff"} !important; backdrop-filter: blur(16px); border: 1px solid ${resolvedDark ? "rgba(255, 255, 255, 0.06)" : "#e2e8f0"} !important; color: ${resolvedDark ? "#cbd5e1" : "#334155"} !important; transition: all 0.25s ease; }
      .text-white { color: ${resolvedDark ? "#ffffff" : "#0f172a"} !important; }
      .text-slate-400 { color: ${resolvedDark ? "#94a3b8" : "#64748b"} !important; }
      .bg-slate-950 { background-color: ${resolvedDark ? "#030712" : "#f1f5f9"} !important; border: 1px solid ${resolvedDark ? "rgba(255, 255, 255, 0.06)" : "#e2e8f0"} !important; color: ${resolvedDark ? "#f8fafc" : "#0f172a"} !important; }
    `;
  }, [resolvedDark]);

  const currentBg = resolvedDark ? "#06151f" : "#f1f5f9";
  const currentTextColor = resolvedDark ? "#f8fafc" : "#0f172a";
  const headerBg = resolvedDark ? "rgba(11,27,38,0.3)" : "rgba(255, 255, 255, 0.85)";
  const profileCardBg = resolvedDark ? "rgba(255,255,255,0.04)" : "rgba(15, 23, 42, 0.03)";
  const sidebarBg = resolvedDark ? "#0b131a" : "#e2e8f0";
  const sidebarBorder = resolvedDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #cbd5e1";
  const displayName = currentUser.username || "Admin";
  const initials = displayName.slice(0, 2).toUpperCase();

  const updatePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCurrentUser((user) => ({ ...user, photo: URL.createObjectURL(file) }));
  };

  const signOut = async () => {
    setProfileDropdownOpen(false);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.clear();
      window.location.replace("/login");
    }
  };


  return (
    <CMSContext.Provider value={{ team, setTeam, programs, setPrograms, episodes, setEpisodes, articles, setArticles, gallery, setGallery, comments, setComments }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          height: "100vh",
          width: "100vw",
          backgroundColor: currentBg,
          color: currentTextColor,
          overflow: "hidden",
          fontFamily: "sans-serif",
          transition: "all 0.3s ease",
        }}
      >
        {resolvedDark && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-10%",
                left: "-5%",
                width: "550px",
                height: "550px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(52,211,153,0.18) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(50px)",
              }}
            />
          </div>
        )}

        <div
          className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${
            mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={`relative flex w-64 max-w-xs flex-col h-full transition-transform duration-300 ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ backgroundColor: sidebarBg, borderRight: sidebarBorder }}
          >
            <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar">
              <Sidebar
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                resolvedDark={resolvedDark}
              />
            </div>
          </div>
        </div>

        <div
          className="hidden lg:flex lg:w-64 lg:flex-col lg:h-full lg:shrink-0 no-scrollbar overflow-y-auto min-h-0"
          style={{
            backgroundColor: sidebarBg,
            borderRight: sidebarBorder,
            zIndex: 10,
          }}
        >
          <Sidebar
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            resolvedDark={resolvedDark}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-w-0 z-10">
          <header
            className="relative z-40"
            style={{
              height: "64px",
              width: "100%",
              backgroundColor: headerBg,
              backdropFilter: "blur(12px)",
              borderBottom: resolvedDark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid #cbd5e1",
              paddingLeft: "24px",
              paddingRight: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden px-2.5 py-1.5 rounded-md bg-emerald-500 text-slate-950 text-xs font-extrabold cursor-pointer transition hover:bg-emerald-400"
              >
                ☰ MENU
              </button>
              <div
                style={{
                  fontSize: "11px",
                  color: resolvedDark ? "#cbd5e1" : "#475569",
                  fontWeight: "700",
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  borderLeft: "3px solid #34d399",
                  paddingLeft: "12px",
                }}
              >
                Control Station
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
  <div
    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      backgroundColor: profileCardBg,
      border: resolvedDark
        ? "1px solid rgba(255,255,255,0.06)"
        : "1px solid #cbd5e1",
      borderRadius: "9999px",
      padding: "4px 6px 4px 16px",
      cursor: "pointer",
    }}
    className="hover:border-emerald-500/50 shadow-sm group transition select-none"
  >
    <div style={{ textAlign: "right" }} className="hidden sm:block">
      <div
        style={{
          fontSize: "12px",
          fontWeight: "700",
          color: currentTextColor,
        }}
      >
        {displayName}
      </div>
      <div
        style={{
          fontSize: "10px",
          color: "#34d399",
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        Signed In
      </div>
    </div>

    {currentUser.photo ? (
      <Image
        src={currentUser.photo}
        alt="Profile"
        width={25}
        height={25}
        style={{
          width: "25px",
          height: "25px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    ) : (
      <div
        style={{
          width: "25px",
          height: "25px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #34d399 0%, #a855f7 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: "900",
          color: "#ffffff",
        }}
      >
        {initials}
      </div>
    )}
  </div>

  {profileDropdownOpen && (
    <div
      className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border p-2 form-slide text-xs"
      style={{
        backgroundColor: resolvedDark ? "#0b1b26" : "#f1f5f9",
        borderColor: resolvedDark
          ? "rgba(255,255,255,0.08)"
          : "#cbd5e1",
        color: currentTextColor,
        zIndex: 9999,
      }}
    >
      <div className="px-3 py-2 mb-1 border-b">
        <p className="font-bold text-slate-400 font-mono text-[9px] uppercase">
          Current Account
        </p>
       
      </div>

      <input
        ref={profilePhotoInputRef}
        type="file"
        accept="image/*"
        onChange={updatePhoto}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => profilePhotoInputRef.current?.click()}
        className="w-full text-left px-3 py-2 rounded-lg font-medium transition cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-500"
      >
        📷 Update Profile Photo
      </button>

      <div className="my-1 border-t" />

      <button
        type="button"
        onClick={signOut}
        className="w-full text-left px-3 py-2 rounded-lg text-rose-500 font-bold transition cursor-pointer hover:bg-rose-500/10"
      >
        🚪 Sign Out
      </button>
    </div>
  )}
</div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-transparent min-w-0 no-scrollbar">
            <div className="max-w-7xl mx-auto space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </CMSContext.Provider>
  );
}
