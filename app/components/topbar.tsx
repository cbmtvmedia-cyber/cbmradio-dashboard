"use client";

interface TopbarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export default function Topbar({ isCollapsed, setIsCollapsed }: TopbarProps) {
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

      {/* User Information Profile */}
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-xs font-semibold text-white">Alex Mercer</div>
          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Station Manager</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
          AM
        </div>
      </div>
    </header>
  );
}
