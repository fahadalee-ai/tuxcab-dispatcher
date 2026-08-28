import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Screen({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={cn("min-h-dvh bg-background text-foreground", padded && "px-4 py-4", className)}>
      {children}
    </div>
  );
}

export function Header({
  title,
  subtitle,
  back = true,
  right,
  fallbackTo = "/overview",
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  fallbackTo?: string;
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return (
    <header className="sticky top-0 z-30 bg-background/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md">
      <div className="flex items-center gap-3">
        {back && (
          <button
            type="button"
            aria-label="Go back"
            onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: fallbackTo as "/" }))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-foreground transition-colors hover:border-gold/40"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[22px] font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

const buttonStyles = {
  primary: "bg-gold text-black hover:bg-gold-hover",
  secondary: "bg-elevated text-white hover:bg-[#1c1c1c]",
  outline: "border border-gold bg-transparent text-gold hover:bg-gold/10",
  destructive: "bg-danger/15 text-danger hover:bg-danger/25",
  ghost: "bg-transparent text-gold hover:bg-gold/10",
} as const;

export function Button({
  children,
  variant = "primary",
  full,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonStyles;
  full?: boolean;
}) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold tracking-tight transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        buttonStyles[variant],
        full && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  to,
  params,
  children,
  variant = "primary",
  full,
  className,
}: {
  to: string;
  params?: Record<string, string>;
  children: ReactNode;
  variant?: keyof typeof buttonStyles;
  full?: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to as "/"}
      params={params}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-center text-sm font-semibold tracking-tight transition-colors",
        buttonStyles[variant],
        full && "w-full",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Card({
  children,
  className,
  highlight,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border bg-card p-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
        highlight ? "border-gold/35" : "border-border",
        onClick && "cursor-pointer transition-colors hover:border-gold/30",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
  subtitle,
}: {
  children: ReactNode;
  action?: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-3 mt-6 flex items-end justify-between first:mt-0">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{children}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const badgeTone: Record<string, string> = {
  gold: "border-gold/30 bg-gold/10 text-gold",
  green: "border-[#4f8a62]/30 bg-[#4f8a62]/12 text-[#8fcaa3]",
  red: "border-danger/30 bg-danger/12 text-[#d4a0a0]",
  blue: "border-info/30 bg-info/12 text-[#9bb6cc]",
  muted: "border-border bg-elevated text-muted-foreground",
  dark: "border-border bg-[#111] text-[#a5a5a5]",
};

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        badgeTone[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function bookingBadgeTone(status: string): keyof typeof badgeTone {
  if (status === "pending" || status === "Pending Assignment" || status === "Awaiting Assignment") return "gold";
  if (status === "assigned" || status === "Assigned") return "gold";
  if (status === "active" || status === "Active") return "blue";
  if (status === "completed" || status === "Completed") return "green";
  if (status === "cancelled" || status === "Cancelled") return "red";
  return "muted";
}

export function Field({
  label,
  error,
  children,
  hint,
  optional,
}: {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.12em] text-[#a5a5a5]">
        {label}
        {optional && <span className="normal-case tracking-normal text-[#6f6f6f]">Optional</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs text-[#6f6f6f]">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs font-medium text-danger">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-border bg-elevated px-3 py-3 text-sm text-white outline-none placeholder:text-[#6f6f6f] transition-colors focus:border-gold disabled:opacity-40";

export function Input({
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return <input {...props} className={cn(inputClass, error && "border-danger", className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputClass, "min-h-28", props.className)} />;
}

export function Select({
  error,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return <select {...props} className={cn(inputClass, "appearance-none", error && "border-danger", className)} />;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-t-3xl border-t border-border bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
          <button type="button" aria-label="Close" onClick={onClose} className="flex h-11 w-11 items-center justify-center text-[#a5a5a5]">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
      {icon && <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-elevated text-gold">{icon}</div>}
      <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#a5a5a5]">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function IconButton({
  label,
  children,
  onClick,
  className,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-white transition-colors hover:border-gold/40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Meta({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6f6f6f]">{children}</p>;
}
