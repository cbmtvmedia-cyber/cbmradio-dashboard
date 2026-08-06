"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import DashboardSidebar from "./dashboard-sidebar";

export default function MobileDashboardNavigation({ open, onClose, triggerRef }: { open: boolean; onClose: () => void; triggerRef: React.RefObject<HTMLButtonElement | null> }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return <dialog ref={dialogRef} id="dashboard-mobile-navigation" aria-label="Dashboard navigation" className="dashboard-mobile-dialog" onCancel={(event) => { event.preventDefault(); onClose(); }} onClose={() => { onClose(); triggerRef.current?.focus(); }}>
    <div className="dashboard-mobile-panel"><button type="button" className="dashboard-mobile-close" onClick={onClose} aria-label="Close dashboard navigation"><X aria-hidden="true" /></button><DashboardSidebar onNavigate={onClose} /></div>
  </dialog>;
}
