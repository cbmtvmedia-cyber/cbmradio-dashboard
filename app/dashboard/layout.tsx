// 📁 VIBRANT & WELCOMING GRADIENT MASTERPIECE: app/dashboard/layout.tsx
"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const id = "radio-dashboard-vibrant-aurora-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.innerHTML = `
      .view-fade { animation: dFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .form-slide { animation: dSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      @keyframes dFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes dSlideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      /* FLUID DYNAMIC COLOR ORB ANIMATIONS */
      @keyframes floatPulse1 {
        0%, 100 { transform: translate(0px, 0px) scale(1); opacity: 0.5; }
        50% { transform: translate(60px, 40px) scale(1.2); opacity: 0.8; }
      }
      @keyframes floatPulse2 {
        0%, 100% { transform: translate(0px, 0px) scale(1.1); opacity: 0.4; }
        50% { transform: translate(-50px, -30px) scale(0.9); opacity: 0.7; }
      }
      @keyframes floatPulse3 {
        0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
        50% { transform: translate(40px, -60px) scale(1.3); opacity: 0.6; }
      }
      .animate-aurora-1 { animation: floatPulse1 14s infinite ease-in-out; }
      .animate-aurora-2 { animation: floatPulse2 18s infinite ease-in-out; }
      .animate-aurora-3 { animation: floatPulse3 16s infinite ease-in-out; }
    `;
    document.head.appendChild(tag);
  }, []);

  return (
    <div 
      style={{
        position: "relative",
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#06151f", // Uplifting, high-end deep slate teal foundation
        color: "#f8fafc",
        overflow: "hidden",
        fontFamily: "sans-serif"
      }}
    >
      
      {/* 🌌 THE BRIGHT & COLORFUL AURORA SUNRISE BACKGROUND ORB MATRICES */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {/* Bright Neon Emerald Light Orb (Top Left) */}
        <div className="animate-aurora-1" style={{ position: "absolute", top: "-10%", left: "-5%", width: "550px", height: "550px", borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.22) 0%, rgba(0,0,0,0) 70%)", filter: "blur(50px)" }} />
        
        {/* Electric Violet / Fuchsia Energizing Light Orb (Center Left) */}
        <div className="animate-aurora-2" style={{ position: "absolute", top: "25%", left: "40%", width: "650px", height: "650px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(0,0,0,0) 70%)", filter: "blur(60px)" }} />
        
        {/* Welcoming Amber Gold Music Pulse Light Orb (Bottom Right) */}
        <div className="animate-aurora-3" style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(0,0,0,0) 70%)", filter: "blur(55px)" }} />

        {/* Sophisticated Geometric Dot-Matrix Grid Overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "32px_32px", opacity: 0.6 }} />
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      <div className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
        <div className="relative flex w-64 max-w-xs flex-col transition-transform duration-300 h-full" style={{ backgroundColor: "rgba(11,27,38,0.85)", backdropFilter: "blur(24px)", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* 🖥️ DESKTOP HIGH-CLASS TRANSLUCENT GLASS SIDEBAR TRACK */}
      <div 
        className="hidden lg:flex lg:w-64 lg:flex-col lg:h-full lg:shrink-0 no-scrollbar"
        style={{ 
          backgroundColor: "rgba(11,27,38,0.45)", 
          backdropFilter: "blur(20px)", 
          borderRight: "1px solid rgba(255,255,255,0.06)", 
          overflowY: "auto", 
          zIndex: 10 
        }}
      >
        <Sidebar />
      </div>

      {/* MAIN MAIN APP CONTROLLER STAGE WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0" style={{ zIndex: 10 }}>
        
        {/* BRIGHT GLOWING PLATFORM HEADER PANEL */}
        <header style={{ height: "64px", width: "100%", backgroundColor: "rgba(11,27,38,0.3)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingLeft: "32px", paddingRight: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              type="button" 
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="lg:hidden px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50 text-slate-300 text-xs font-bold font-mono tracking-wide"
            >
              ☰ MENU
            </button>
            <div style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: "700", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.18em", borderLeft: "3px solid #34d399", paddingLeft: "12px" }}>
              Administrative Control Station
            </div>
          </div>
          
          {/* PREMIUM USER PROFILE BLENDED PANEL PLUG */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9999px", padding: "4px 6px 4px 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#ffffff", letterSpacing: "0.025em" }}>Alex Mercer</div>
              <div style={{ fontSize: "9px", color: "#34d399", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.12em" }}>Station Manager</div>
            </div>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #34d399 0%, #a855f7 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "900", color: "#ffffff", boxShadow: "0 2px 8px rgba(52,211,153,0.3)" }}>
              <span style={{ width: "100%", textAlign: "center" }}>AM</span>
            </div>
          </div>
        </header>

        {/* MAIN CONTAINER CONTENT WINDOW SECTION - AURORA BLENDED */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-transparent min-w-0 no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
