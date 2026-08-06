"use client";
import React, { useState, useEffect } from "react";
import Toast from "../components/toast";
import { LockIcon } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  // ☀️ Forces the page context to ignore dark mode styles while on this path
useEffect(() => {
  document.documentElement.classList.remove("dark");
}, []);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    
    setLoading(true);
    try {
      // 📡 Calls your local API handler bridge
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setToast("⚡ Authorization Verified! Unlocking Control Tower Room...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        setToast(data.error || "❌ Access Denied: Invalid Administrator Credentials.");
      }
    } catch {
      setToast("❌ Network Error: Failed to reach authorization server.");
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-mono transition-colors duration-300">
    <Toast message={toast} />

    {/* 🟢 CHANGED: bg-slate-900 to bg-white, and added gray border shadow */}
    <form onSubmit={handleAdminSubmit} className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xl relative overflow-hidden border-t-4 border-t-emerald-500">
      
      <div>
        <LockIcon className="mx-auto h-8 w-8 text-emerald-500" />
        {/* 🟢 CHANGED: text-white to text-slate-900 */}
        <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest text-center">Lock</h1>
        {/* 🟢 CHANGED: text-slate-500 to text-slate-400 */}
        <p className="text-[10px] text-slate-400 text-center mt-1">Authorized Station Personnel Access Only</p>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          {/* 🟢 CHANGED: text-slate-400 to text-slate-600 */}
          <label className="block text-slate-600 mb-1">Admin Username</label>
          {/* 🟢 CHANGED: bg-slate-950/border-slate-800 to bg-slate-50/border-slate-200, and text color to slate-900 */}
          <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 transition" placeholder="e.g., admin_station" />
        </div>
        <div>
          {/* 🟢 CHANGED: text-slate-400 to text-slate-600 */}
          <label className="block text-slate-600 mb-1">Secure Password</label>
          {/* 🟢 CHANGED: bg-slate-950/border-slate-800 to bg-slate-50/border-slate-200, and text color to slate-900 */}
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 transition" placeholder="••••••••" />
        </div>
      </div>

      {/* 🟢 CHANGED: text-slate-950 for high contrast text on the emerald button, disabled classes changed to clean light styles */}
      <button type="submit" disabled={loading} className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-100 disabled:text-slate-400 text-slate-950 font-bold rounded-md text-xs uppercase tracking-wider transition cursor-pointer">
        {loading ? "Verifying Passport..." : "Verify Authorization"}
      </button>
    </form>
  </div>
);
}

