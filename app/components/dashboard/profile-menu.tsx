"use client";

import { LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AdminUser } from "../../lib/backend-auth";

export default function ProfileMenu({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => { if (!wrapperRef.current?.contains(event.target as Node)) { setOpen(false); triggerRef.current?.focus(); } };
    const closeEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener("pointerdown", closeOutside); document.addEventListener("keydown", closeEscape);
    return () => { document.removeEventListener("pointerdown", closeOutside); document.removeEventListener("keydown", closeEscape); };
  }, [open]);
  const logout = async () => { if (signingOut) return; setSigningOut(true); try { await fetch("/api/auth/logout", { method: "POST" }); } finally { window.location.replace("/login"); } };
  return <div className="dashboard-profile" ref={wrapperRef}><button ref={triggerRef} type="button" className="dashboard-profile-trigger" aria-label={`Open account menu for ${displayName}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span className="dashboard-profile-copy"><strong>{displayName}</strong><small>Signed in</small></span><span className="dashboard-avatar" aria-hidden="true">{displayName.slice(0,2).toUpperCase()}</span></button>{open && <div role="menu" aria-label="Account menu" className="dashboard-profile-menu"><div><UserRound aria-hidden="true" /><span><strong>{displayName}</strong><small>{user.email}</small></span></div><button type="button" role="menuitem" onClick={() => void logout()} disabled={signingOut}><LogOut aria-hidden="true" />{signingOut ? "Signing out…" : "Sign out"}</button></div>}</div>;
}
