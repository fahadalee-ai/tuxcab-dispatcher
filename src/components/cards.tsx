import { Link } from "@tanstack/react-router";
import { ArrowDown, ChevronRight, Clock3, MapPin } from "lucide-react";
import { Badge, Button, Card, LinkButton } from "@/components/kit";
import { BookingStatusBadge, CashBadge, DriverStatusDot, PermitBadge } from "@/components/StatusBadge";
import { fullName, shortName, type Booking, type Driver, type Zone } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function BookingCard({
  booking,
  compact,
  onDispatch,
}: {
  booking: Booking;
  compact?: boolean;
  onDispatch?: () => void;
}) {
  return (
    <Card highlight={booking.status === "pending"} className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[12px] font-medium tracking-wide text-gold">#{booking.id}</p>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div>
        <p className="text-base font-semibold text-white">{booking.riderName}</p>
        <p className="mt-0.5 text-xs text-[#6f6f6f]">{booking.pickupLabel}</p>
      </div>

      <div className="space-y-1.5 text-sm">
        <div className="flex items-start gap-2 text-[#a5a5a5]">
          <MapPin size={14} className="mt-0.5 shrink-0 text-gold" />
          <span>{compact ? booking.pickupShort : booking.pickup}</span>
        </div>
        {booking.dropoff && (
          <>
            <div className="pl-1 text-gold">
              <ArrowDown size={14} />
            </div>
            <div className="flex items-start gap-2 text-[#a5a5a5]">
              <MapPin size={14} className="mt-0.5 shrink-0 text-[#6f6f6f]" />
              <span>{compact ? booking.dropoffShort : booking.dropoff}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="dark">{booking.category}</Badge>
        {booking.permit ? <Badge tone="gold">Permit Ride</Badge> : <Badge tone="muted">Standard</Badge>}
        <CashBadge />
      </div>

      {booking.status === "pending" && (
        <div className="flex gap-2 pt-1">
          {onDispatch ? (
            <Button full onClick={onDispatch}>
              Dispatch
            </Button>
          ) : (
            <LinkButton full to="/bookings/$id/assign" params={{ id: booking.id }}>
              {compact ? "Assign Driver" : "Dispatch"}
            </LinkButton>
          )}
          <LinkButton variant="secondary" to="/bookings/$id" params={{ id: booking.id }} className="min-w-24">
            View
          </LinkButton>
        </div>
      )}
    </Card>
  );
}

export function DriverCard({
  driver,
  action,
  assignable,
  onAssign,
  compactName,
}: {
  driver: Driver;
  action?: "view" | "assign" | "none";
  assignable?: boolean;
  onAssign?: () => void;
  compactName?: boolean;
}) {
  const name = compactName ? shortName(driver) : fullName(driver);
  return (
    <Card className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-elevated text-sm font-semibold text-gold">
          {driver.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-base font-semibold text-white">{name}</p>
            <DriverStatusDot status={driver.status} />
          </div>
          <p className="mt-0.5 text-xs text-[#a5a5a5]">{driver.locationLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <Info label="Vehicle" value={driver.vehicle} />
        <Info label="Category" value={driver.category} />
        <Info label="Location" value={driver.locationLabel} />
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#6f6f6f]">Permit</p>
          <div className="mt-1">
            <PermitBadge eligible={driver.permitEligible} />
          </div>
        </div>
      </div>

      <p className="text-xs text-[#6f6f6f]">
        Current Assignment: <span className="text-white">{driver.assignmentId ? `#${driver.assignmentId}` : "None"}</span>
      </p>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gold">{driver.distanceMi.toFixed(1)} mi away</p>
        {action === "assign" && (
          <Button
            className="min-w-24"
            disabled={!assignable}
            onClick={onAssign}
          >
            Assign
          </Button>
        )}
        {action === "view" && (
          <LinkButton variant="secondary" className="min-w-24" to="/drivers/$id" params={{ id: driver.id }}>
            View
          </LinkButton>
        )}
      </div>
    </Card>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-[#6f6f6f]">{label}</p>
      <p className="mt-1 text-[13px] text-white">{value}</p>
    </div>
  );
}

export function ZoneCard({
  zone,
  available,
  cta = "View Drivers",
}: {
  zone: Zone;
  available: number;
  cta?: string;
}) {
  return (
    <Link to="/zones/$id" params={{ id: zone.id }} className="block">
      <Card className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
          <MapPin size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-white">{zone.name}</p>
            <Badge tone={zone.active ? "green" : "muted"}>{zone.active ? "Active" : "Inactive"}</Badge>
          </div>
          <p className={cn("mt-1 text-sm", available > 0 ? "text-[#8fcaa3]" : "text-danger")}>
            {available} {available === 1 ? "Driver" : "Drivers"} Available
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {zone.permitAllowed ? <Badge tone="gold">Permit Eligible</Badge> : <Badge tone="muted">Permit Restricted</Badge>}
            {available === 0 && <Badge tone="red">No Drivers</Badge>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs font-semibold text-gold">{cta}</span>
          <ChevronRight size={16} className="text-[#6f6f6f]" />
        </div>
      </Card>
    </Link>
  );
}

export function KPICard({
  value,
  label,
  icon,
  accent = "gold",
}: {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  accent?: "gold" | "green" | "muted";
}) {
  const ring = accent === "gold" ? "border-gold/30 text-gold" : accent === "green" ? "border-[#4f8a62]/30 text-[#8fcaa3]" : "border-border text-[#a5a5a5]";
  const number = accent === "gold" ? "text-gold" : accent === "green" ? "text-[#8fcaa3]" : "text-white";
  return (
    <Card className="min-h-[108px]">
      <div className="flex items-start justify-between">
        <p className={cn("text-[28px] font-semibold leading-none tracking-tight", number)}>{value}</p>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl border", ring)}>{icon}</span>
      </div>
      <p className="mt-3 text-xs leading-snug text-[#a5a5a5]">{label}</p>
      {accent === "gold" && (
        <span className="mt-3 flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-gold">
          <Clock3 size={10} /> Attention
        </span>
      )}
    </Card>
  );
}

export function QuickAction({
  to,
  title,
  text,
  icon,
  gold,
}: {
  to: string;
  title: string;
  text: string;
  icon: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <Link
      to={to as "/"}
      className={cn(
        "flex min-h-16 items-center gap-3 rounded-2xl border px-4 py-3 transition-colors",
        gold ? "border-gold/40 bg-gold text-black" : "border-border bg-card hover:border-gold/30",
      )}
    >
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", gold ? "bg-black/10" : "bg-elevated text-gold")}>
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-semibold">{title}</span>
        <span className={cn("block text-xs", gold ? "text-black/70" : "text-[#a5a5a5]")}>{text}</span>
      </span>
      <ChevronRight size={16} className={gold ? "text-black/60" : "text-[#6f6f6f]"} />
    </Link>
  );
}
