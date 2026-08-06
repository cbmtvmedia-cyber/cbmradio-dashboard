"use client";

import { useEffect, useRef } from "react";
import { Button } from "./button";

export function ConfirmationDialog({ open, title, description, confirmLabel="Delete", cancelLabel="Cancel", loading=false, error, onConfirm, onCancel }: { open:boolean; title:string; description:string; confirmLabel?:string; cancelLabel?:string; loading?:boolean; error?:string; onConfirm:()=>void; onCancel:()=>void }) {
  const dialogRef=useRef<HTMLDialogElement>(null); const returnFocusRef=useRef<HTMLElement|null>(null);
  useEffect(()=>{const dialog=dialogRef.current;if(!dialog)return;if(open&&!dialog.open){returnFocusRef.current=document.activeElement as HTMLElement;dialog.showModal();}else if(!open&&dialog.open){dialog.close();returnFocusRef.current?.focus();}},[open]);
  return <dialog ref={dialogRef} className="ui-confirmation" aria-labelledby="confirmation-title" aria-describedby="confirmation-description" onCancel={(event)=>{event.preventDefault();if(!loading)onCancel();}} onClose={()=>returnFocusRef.current?.focus()}><form method="dialog" onSubmit={(event)=>event.preventDefault()}><h2 id="confirmation-title">{title}</h2><p id="confirmation-description">{description}</p>{error&&<p className="ui-field-error" role="alert">{error}</p>}<div><Button variant="outline" onClick={onCancel} disabled={loading}>{cancelLabel}</Button><Button variant="destructive" onClick={onConfirm} loading={loading} loadingLabel="Deleting…">{confirmLabel}</Button></div></form></dialog>;
}
