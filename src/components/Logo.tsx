import { cn } from "@/lib/utils";
import logo from "@/img/logo.png";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const height = size === "sm" ? "h-14" : size === "lg" ? "h-36" : size === "xl" ? "h-44" : "h-20";
  return (
    <img
      src={logo}
      alt="TuxCab"
      className={cn("mx-auto w-auto object-contain", height, className)}
    />
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="text-center">
      <Logo size={compact ? "sm" : "xl"} />
      <p className="mt-4 text-sm font-medium uppercase tracking-[0.28em] text-gold">Dispatch</p>
      <div className="mx-auto mt-3 h-px w-16 bg-gold" />
    </div>
  );
}
