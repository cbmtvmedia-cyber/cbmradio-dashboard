"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface TopbarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export default function Topbar({ isCollapsed, setIsCollapsed }: TopbarProps) {
  const router = useRouter();
  const [adminUsername, setAdminUsername] = useState("Admin User");

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok && data.user?.username) {
          setAdminUsername(data.user.username);
        }
      })
      .catch(() => undefined);
  }, []);

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.clear();
      router.replace("/login");
    }
  };

  return (
    <header className="h-16 w-full bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
      
      {/* 🔘 HAMBURGER OPEN / CLOSE INTERACTIVE BUTTON */}
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 transition cursor-pointer flex items-center justify-center"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <span className="text-xs font-bold font-mono">
            {isCollapsed ? "☰ OPEN" : "✕ CLOSE"}
          </span>
        </button>
        <div className="text-xs text-slate-400 font-medium font-mono hidden sm:inline-block">
          ADMIN PLATFORM LAYER v4
        </div>
      </div>

    {/* User Information Profile & Quick Logout */}
    <div className="flex items-center space-x-3">
  <div className="text-right">
    <div className="text-xs font-semibold text-white">
      {/* 🟢 SAFE CHECK: Prevents server-side compilation crashes */}
      {adminUsername}
    </div>
    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
      Station Manager
    </div>
  </div>
</div>

  
  {/* 🚪 WORKING LOGOUT ACTION BUTTON */}
  <button 
    onClick={signOut}
    className="px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 hover:border-rose-500 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition cursor-pointer font-mono"
  >
    🚪 SIGN OUT
  </button>


  
    </header>
  );
}
