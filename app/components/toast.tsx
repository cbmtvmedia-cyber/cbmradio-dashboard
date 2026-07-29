"use client";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;
  
  return (
    <div className="fixed top-4 right-8 bg-slate-900 border-2 border-emerald-500 text-white font-medium text-xs px-4 py-3 rounded-xl shadow-xl z-50 flex items-center space-x-2">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      <span>{message}</span>
    </div>
  );
}
