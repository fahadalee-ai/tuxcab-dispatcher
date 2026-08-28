import { cn } from "@/lib/utils";

export function DarkMap({
  zoneName,
  driverCount,
  selected = true,
  className,
}: {
  zoneName: string;
  driverCount?: number;
  selected?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-[#0a0a0a]", className)}>
      <svg viewBox="0 0 360 180" className="h-full w-full" aria-hidden>
        <rect width="360" height="180" fill="#0a0a0a" />
        <g stroke="#1c1c1c" strokeWidth="6">
          <path d="M0 48 H360" />
          <path d="M0 96 H360" />
          <path d="M0 144 H360" />
          <path d="M72 0 V180" />
          <path d="M168 0 V180" />
          <path d="M258 0 V180" />
        </g>
        <g stroke="#151515" strokeWidth="2">
          <path d="M0 70 H360" />
          <path d="M0 120 H360" />
          <path d="M120 0 V180" />
          <path d="M210 0 V180" />
        </g>
        <path
          d="M58 38 C92 22, 148 18, 198 36 C248 54, 286 48, 312 72 C330 92, 318 128, 276 142 C230 158, 170 164, 118 150 C72 138, 40 108, 46 76 C50 58, 48 46, 58 38 Z"
          fill={selected ? "rgba(201,162,39,0.12)" : "rgba(255,255,255,0.03)"}
          stroke={selected ? "#C9A227" : "#292929"}
          strokeWidth="1.5"
        />
        <circle cx="168" cy="88" r="5" fill="#C9A227" />
        <circle cx="168" cy="88" r="10" fill="none" stroke="#C9A227" strokeOpacity="0.35" />
        <circle cx="132" cy="70" r="3.5" fill="#4f8a62" />
        <circle cx="198" cy="104" r="3.5" fill="#4f8a62" />
        <circle cx="220" cy="68" r="3.5" fill="#C9A227" />
        <text x="64" y="32" fill="#C9A227" fontSize="10" fontFamily="Inter, sans-serif" letterSpacing="1.2">
          {zoneName.toUpperCase()}
        </text>
      </svg>

      {typeof driverCount === "number" && (
        <div className="absolute bottom-3 left-3 rounded-xl border border-gold/30 bg-black/80 px-3 py-2 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#6f6f6f]">In zone</p>
          <p className="text-sm font-semibold text-gold">{driverCount} drivers</p>
        </div>
      )}
    </div>
  );
}
