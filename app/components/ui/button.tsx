import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean; loadingLabel?: string; icon?: ReactNode; iconPosition?: "start" | "end" };
export function Button({ variant="primary", loading=false, loadingLabel="Working…", icon, iconPosition="start", children, className="", disabled, type="button", ...props }: Props) {
  return <button type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={`ui-button ui-button-${variant} ${className}`} {...props}>{loading ? <><span className="ui-button-spinner" aria-hidden="true" />{loadingLabel}</> : <>{iconPosition === "start" && icon}{children}{iconPosition === "end" && icon}</>}</button>;
}
export function ButtonLink({ href, variant="primary", icon, children, className="" }: { href:string; variant?:ButtonVariant; icon?:ReactNode; children:ReactNode; className?:string }) { return <Link href={href} className={`ui-button ui-button-${variant} ${className}`}>{icon}{children}</Link>; }
