"use client";

import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";
export default function Toast({ message, variant="success", onDismiss, duration=6000 }: { message:string|null; variant?:ToastVariant; onDismiss?:()=>void; duration?:number }) {
  if (!message) return null;
  return <ToastItem key={`${variant}:${message}`} message={message} variant={variant} onDismiss={onDismiss} duration={duration} />;
}
function ToastItem({ message, variant, onDismiss, duration }: { message:string; variant:ToastVariant; onDismiss?:()=>void; duration:number }) {
  const [visible,setVisible]=useState(true); const [paused,setPaused]=useState(false);
  useEffect(()=>{ if(paused)return; const timer=window.setTimeout(()=>{setVisible(false);onDismiss?.();},duration); return()=>window.clearTimeout(timer);},[duration,onDismiss,paused]);
  if(!visible)return null;
  const Icon={success:CheckCircle2,error:AlertCircle,warning:TriangleAlert,info:Info}[variant];
  return <div className={`ui-toast ui-toast-${variant}`} role={variant==="error"?"alert":"status"} aria-live={variant==="error"?"assertive":"polite"} aria-atomic="true" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}><Icon aria-hidden="true"/><p>{message}</p><button type="button" onClick={()=>{setVisible(false);onDismiss?.();}} aria-label="Dismiss notification"><X aria-hidden="true"/></button></div>;
}
