"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminUser } from "../../lib/backend-auth";
import { SESSION_EXPIRED_EVENT } from "../../lib/api-client";

export default function AuthGuard({ children }: { children: (user: AdminUser) => React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [state, setState] = useState<"checking" | "error">("checking");

  const checkSession = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store", signal });
      if (response.status === 401 || response.status === 403) {
        window.location.replace("/login");
        return;
      }
      const data: unknown = await response.json().catch(() => ({}));
      const candidate = data && typeof data === "object" ? (data as { user?: AdminUser }).user : undefined;
      if (!response.ok || !candidate) throw new Error("Authentication service unavailable.");
      setUser(candidate);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setState("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void checkSession(controller.signal), 0);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [checkSession]);

  useEffect(() => {
    const expire = () => window.location.replace("/login?reason=session-expired");
    window.addEventListener(SESSION_EXPIRED_EVENT, expire);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, expire);
  }, []);

  if (user) return children(user);
  if (state === "error") return <main className="dashboard-auth-state" role="alert"><div><h1>Dashboard unavailable</h1><p>We could not verify your administrator session. Your dashboard remains protected.</p><button type="button" onClick={() => { setState("checking"); void checkSession(); }}>Try again</button></div></main>;
  return <main className="dashboard-auth-state" role="status" aria-live="polite"><div><span className="dashboard-spinner" aria-hidden="true" /><h1>Checking authentication</h1><p>Verifying your administrator session.</p></div></main>;
}
