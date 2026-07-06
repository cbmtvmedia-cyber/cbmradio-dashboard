"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "system">(
    "dark",
  );
  const [resolvedDark, setResolvedDark] = useState(true);

  // 👤 USER PROFILE MENU DRAWERS
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Monitor computer system native light/dark preferences
  useEffect(() => {
    if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setResolvedDark(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setResolvedDark(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      setResolvedDark(themeMode === "dark");
    }
  }, [themeMode]);

  // Close profile dropdown when clicking outside the panel boundaries
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

  // Sync dark utility wrapper tags into document root headers
  useEffect(() => {
    const root = window.document.documentElement;
    if (resolvedDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedDark]);

  // Custom visual keyframe overrides and page-card content injectors
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

      /* FORCED ADAPTIVE OVERRIDES TRACK FOR EVERY SUB-PAGE CORE TILES GRID */
      .bg-slate-900 { 
        background-color: ${resolvedDark ? "rgba(11,27,38,0.45)" : "#ffffff"} !important;
        backdrop-filter: blur(16px);
        border: 1px solid ${resolvedDark ? "rgba(255, 255, 255, 0.06)" : "#e2e8f0"} !important;
        color: ${resolvedDark ? "#cbd5e1" : "#334155"} !important;
        transition: all 0.25s ease;
      }
      .text-white { color: ${resolvedDark ? "#ffffff" : "#0f172a"} !important; }
      .text-slate-400 { color: ${resolvedDark ? "#94a3b8" : "#64748b"} !important; }
      .bg-slate-950 {
        background-color: ${resolvedDark ? "#030712" : "#f1f5f9"} !important;
        border: 1px solid ${resolvedDark ? "rgba(255, 255, 255, 0.06)" : "#e2e8f0"} !important;
        color: ${resolvedDark ? "#f8fafc" : "#0f172a"} !important;
      }
    `;
  }, [resolvedDark]);

  // Color theme mapping matrix configuration parameters
  const currentBg = resolvedDark ? "#06151f" : "#f1f5f9";
  const currentTextColor = resolvedDark ? "#f8fafc" : "#0f172a";
  const headerBg = resolvedDark
    ? "rgba(11,27,38,0.3)"
    : "rgba(255, 255, 255, 0.85)";
  const profileCardBg = resolvedDark
    ? "rgba(255,255,255,0.04)"
    : "rgba(15, 23, 42, 0.03)";

  return (
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
      {/* FLOATING AURORA TECH GLOW BACKGROUND OVERLAY (DARK MODE ONLY) */}
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.01) 1px, transparent 1px)",
              backgroundSize: "32px_32px",
              opacity: 0.6,
            }}
          />
        </div>
      )}

      {/* 📱 RESPONSIVE SMART PHONE DRAWER SLIDE-OVER OVERLAY MENU */}
      <div
        className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`relative flex w-64 max-w-xs flex-col h-full bg-[#0b131a] border-r border-slate-800/60 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div
            className="flex-1 overflow-y-auto min-h-0 no-scrollbar"
            onClick={() => setMobileOpen(false)}
          >
            <Sidebar />
          </div>
        </div>
      </div>

      {/* 🖥️ DESKTOP SLEEK CHARCOAL-DARK PERMANENT LEFT SIDEBAR MENU */}
      <div
        className="hidden lg:flex lg:w-64 lg:flex-col lg:h-full lg:shrink-0 no-scrollbar bg-[#0b131a] border-r border-slate-800/60 overflow-y-auto min-h-0"
        style={{ zIndex: 10 }}
      >
        <Sidebar />
      </div>
      {/* RIGHT RUNTIME APPLICATION DISPLAY FRAME WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 z-10">
        {/* COMPACT STAGE TOPBAR CONTAINER HEADER WITH GLASS BLURS */}
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
              className="lg:hidden px-2.5 py-1.5 rounded-md bg-emerald-500 text-slate-950 text-xs font-extrabold font-mono tracking-wide cursor-pointer transition hover:bg-emerald-400"
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

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* 🎛️ HIGH-CONTRAST DROPDOWN CONTROLLER WITH BUILT-IN OPTION COLOR OVERRIDES */}
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as any)}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                backgroundColor: resolvedDark ? "#1e293b" : "#ffffff",
                border: resolvedDark
                  ? "1px solid rgba(255,255,255,0.2)"
                  : "1px solid #cbd5e1",
                color: currentTextColor,
                outline: "none",
              }}
              className="font-sans"
            >
              <option
                value="dark"
                style={{ backgroundColor: "#0f172a", color: "#f8fafc" }}
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
                style={{ backgroundColor: "#1e293b", color: "#f8fafc" }}
              >
                💻 System Default
              </option>
            </select>

            {/* 👤 ALEX MERCER AVATAR DECK BADGE (DROP CARD TRIGGER POINT) */}
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
                    Alex Mercer
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#34d399",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                    }}
                  >
                    Station Manager
                  </div>
                </div>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #34d399 0%, #a855f7 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "900",
                    color: "#ffffff",
                  }}
                  className="group-hover:scale-105 transition"
                >
                  AM
                </div>
              </div>

              {/* 🛡️ SOLID INTERACTIVE USER DETAILS PANEL (LOCKED AT TOP LAYER LEVEL VIA zIndex & BLUR ISOLATION) */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border p-2 form-slide text-xs"
                  style={{
                    backgroundColor: resolvedDark ? "#0b1b26" : "#f1f5f9", // Premium cream-slate background for Light Mode
                    borderColor: resolvedDark
                      ? "rgba(255,255,255,0.08)"
                      : "#cbd5e1",
                    color: currentTextColor,
                    zIndex: 100, // Forces card completely above all buttons
                    backdropFilter: "none", // 🛑 PREVENTS BACKGROUND BLUR LEAKAGE FROM FILTER COMPONENT
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div
                    className="px-3 py-2 mb-1 border-b"
                    style={{
                      borderColor: resolvedDark
                        ? "rgba(255,255,255,0.08)"
                        : "#cbd5e1",
                    }}
                  >
                    <p className="font-bold text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                      Account Node
                    </p>
                    <p className="font-semibold truncate text-emerald-600 dark:text-emerald-400">
                      alex.mercer@cbmradio.com
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <button
                      onClick={() =>
                        alert("Loading official profile credentials...")
                      }
                      className="w-full text-left px-3 py-2 rounded-lg font-medium transition cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-500"
                    >
                      👤 View Profile Settings
                    </button>
                    <button
                      onClick={() =>
                        alert("CMS Encryption Security Tokens verified.")
                      }
                      className="w-full text-left px-3 py-2 rounded-lg font-medium transition cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-500"
                    >
                      🔑 Security Tokens
                    </button>
                    <div
                      className="my-1 border-t"
                      style={{
                        borderColor: resolvedDark
                          ? "rgba(255,255,255,0.08)"
                          : "#cbd5e1",
                      }}
                    ></div>
                    <button
                      onClick={() =>
                        alert("Logging out of administrative session node...")
                      }
                      className="w-full text-left px-3 py-2 rounded-lg text-rose-500 font-bold transition cursor-pointer hover:bg-rose-500/10"
                    >
                      🚪 Sign Out System
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTAINER SCROLLBAR-FREE MAIN STAGE WORKSPACE BASEMENT LAYER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-transparent min-w-0 no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
