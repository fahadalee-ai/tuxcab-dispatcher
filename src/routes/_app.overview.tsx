import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight, Clock3, Plus, UserRound } from "lucide-react";
import { Badge, Button, Empty, IconButton } from "@/components/kit";
import { greeting, todayLong, type Booking, type Zone } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/overview")({
  head: () => ({ meta: [{ title: "Overview · TuxCab Dispatch" }] }),
  component: OverviewScreen,
});

function OverviewScreen() {
  const navigate = useNavigate();
  const { user, bookings, drivers, zones, unreadCount } = useApp();
  const pending = bookings.filter((b) => b.status === "pending");
  const inProgress = bookings.filter((b) => b.status === "active").length;
  const inhouseReady = drivers.filter((d) => d.inhouse && d.status === "available" && d.vehicleActive).length;
  const availableInZones = drivers.filter((d) => d.status === "available").length;
  const snapshotZones = zones.filter((z) => z.id !== "z-elkgrove");

  return (
    <div className="bg-black px-4 pb-6 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-[22px] font-semibold tracking-tight text-white">
            {greeting()}, {user?.name}
          </h1>
          <p className="mt-0.5 truncate text-xs text-[#a5a5a5]">
            {user?.region} · {todayLong()}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link to="/notifications">
            <IconButton label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold" />}
            </IconButton>
          </Link>
          <Link to="/profile">
            <IconButton label="Profile" className="text-gold">
              <UserRound size={18} />
            </IconButton>
          </Link>
        </div>
      </header>

      <Button full className="mt-5" onClick={() => navigate({ to: "/jobs/new" })}>
        <Plus size={18} />
        New Job
      </Button>

      <div className="mt-4 grid grid-cols-4 overflow-hidden rounded-2xl border border-border bg-card">
        <Stat
          value={pending.length}
          label="Pending"
          gold
          onClick={() => navigate({ to: "/bookings", search: { tab: "pending" } })}
        />
        <Stat value={inhouseReady} label="Ready" onClick={() => navigate({ to: "/drivers" })} />
        <Stat value={inProgress} label="On trip" onClick={() => navigate({ to: "/bookings", search: { tab: "active" } })} />
        <Stat value={availableInZones} label="In zones" onClick={() => navigate({ to: "/zones" })} />
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Needs assignment</h2>
          <p className="mt-0.5 text-xs text-[#a5a5a5]">
            {pending.length} unassigned
          </p>
        </div>
        <Link to="/bookings" search={{ tab: "pending" }} className="text-xs font-semibold text-gold">
          View all
        </Link>
      </div>

      <div className="mt-3 space-y-2">
        {pending.length === 0 ? (
          <Empty icon={<Clock3 size={20} />} title="All caught up" body="No bookings are waiting for a driver." />
        ) : (
          pending.slice(0, 3).map((booking) => <PriorityRow key={booking.id} booking={booking} />)
        )}
      </div>

      <div className="mt-6 flex items-end justify-between">
        <h2 className="text-base font-semibold text-white">Zones</h2>
        <Link to="/zones" className="text-xs font-semibold text-gold">
          View all
        </Link>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
        {snapshotZones.map((zone, i) => (
          <ZoneRow
            key={zone.id}
            zone={zone}
            available={drivers.filter((d) => d.zoneId === zone.id && d.status === "available").length}
            last={i === snapshotZones.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  gold,
  onClick,
}: {
  value: number;
  label: string;
  gold?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="min-h-[76px] px-1 py-3 text-center">
      <p className={cn("text-xl font-semibold leading-none", gold ? "text-gold" : "text-white")}>{value}</p>
      <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">{label}</p>
    </button>
  );
}

function PriorityRow({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{booking.riderName}</p>
          <p className="mt-0.5 truncate text-xs text-[#a5a5a5]">
            {booking.pickupShort}
            {booking.dropoffShort ? ` → ${booking.dropoffShort}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[#a5a5a5]">{booking.pickupTime}</span>
            <Badge tone="dark">{booking.category === "SUV (6 Pax)" ? "SUV · 6 Pax" : booking.category}</Badge>
            {booking.permit && <Badge tone="gold">Permit</Badge>}
          </div>
        </div>
        <Link
          to="/bookings/$id/assign"
          params={{ id: booking.id }}
          className="inline-flex min-h-10 shrink-0 items-center rounded-xl bg-gold px-3 text-xs font-semibold text-black"
        >
          Assign
        </Link>
      </div>
    </div>
  );
}

function ZoneRow({ zone, available, last }: { zone: Zone; available: number; last?: boolean }) {
  return (
    <Link
      to="/zones/$id"
      params={{ id: zone.id }}
      className={cn("flex min-h-14 items-center gap-3 px-4", !last && "border-b border-border")}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{zone.name}</p>
      </div>
      <p className={cn("text-sm font-semibold", available > 0 ? "text-[#8fcaa3]" : "text-[#6f6f6f]")}>
        {available}
      </p>
      <ChevronRight size={16} className="text-[#6f6f6f]" />
    </Link>
  );
}
