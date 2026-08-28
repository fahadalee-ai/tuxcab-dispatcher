import { Badge, bookingBadgeTone } from "@/components/kit";
import { bookingStatusLabel, driverStatusLabel, type BookingStatus, type DriverStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function BookingStatusBadge({ status, awaiting }: { status: BookingStatus; awaiting?: boolean }) {
  const label = awaiting && status === "pending" ? "Awaiting Assignment" : bookingStatusLabel(status);
  return <Badge tone={bookingBadgeTone(status)}>{label}</Badge>;
}

export function DriverStatusDot({ status, label = true }: { status: DriverStatus; label?: boolean }) {
  const color = {
    available: "bg-[#4f8a62]",
    assigned: "bg-gold",
    on_trip: "bg-info",
    offline: "bg-[#6f6f6f]",
    unavailable: "bg-danger",
  }[status];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[#a5a5a5]">
      <span className={cn("h-2 w-2 rounded-full", color)} />
      {label && driverStatusLabel(status)}
    </span>
  );
}

export function PermitBadge({ eligible }: { eligible: boolean }) {
  return eligible ? <Badge tone="gold">Permit Eligible</Badge> : <Badge tone="muted">Not Eligible</Badge>;
}

export function CashBadge() {
  return <Badge tone="gold">Cash Only</Badge>;
}
