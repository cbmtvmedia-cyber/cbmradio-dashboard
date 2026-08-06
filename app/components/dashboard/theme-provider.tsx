"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
type ThemeContextValue = { mode: ThemeMode; resolvedTheme: "light" | "dark"; setMode: (mode: ThemeMode) => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "dashboard-theme";

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });
  const [systemDark, setSystemDark] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const resolvedTheme = mode === "system" ? (systemDark ? "dark" : "light") : mode;
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.dataset.dashboardTheme = resolvedTheme;
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, resolvedTheme]);

  const value = useMemo(() => ({ mode, resolvedTheme, setMode }), [mode, resolvedTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useDashboardTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useDashboardTheme must be used within DashboardThemeProvider.");
  return value;
}
