import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { BookingCard } from "@/components/cards";
import { FilterSheet } from "@/components/FilterSheet";
import { BottomSheet, Button, Empty, Header, IconButton, Input } from "@/components/kit";
import { type BookingStatus } from "@/lib/mock-data";
import { DEFAULT_DRIVER_FILTERS, useApp, type DriverFilters } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS: { id: "all" | BookingStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "assigned", label: "Assigned" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

type BookingsSearch = {
  tab: "all" | BookingStatus;
  q?: string;
};

export const Route = createFileRoute("/_app/bookings/")({
  validateSearch: (s: Record<string, unknown>): BookingsSearch => ({
    tab: TABS.some((t) => t.id === s.tab) ? (s.tab as BookingsSearch["tab"]) : "all",
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  head: () => ({ meta: [{ title: "Bookings · TuxCab Dispatch" }] }),
  component: BookingsScreen,
});

function BookingsScreen() {
  const { tab = "all", q = "" } = Route.useSearch();
  const navigate = useNavigate();
  const { bookings, drivers, zones } = useApp();
  const [query, setQuery] = useState(q);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [date, setDate] = useState("");
  const [filters, setFilters] = useState<DriverFilters>(DEFAULT_DRIVER_FILTERS);
  const [applied, setApplied] = useState<DriverFilters>(DEFAULT_DRIVER_FILTERS);

  const list = useMemo(() => {
    const text = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (tab !== "all" && b.status !== tab) return false;
      const driver = drivers.find((d) => d.id === b.driverId);
      const hay = [
        b.id,
        b.riderName,
        b.riderPhone,
        b.pickup,
        b.dropoff ?? "",
        b.category,
        driver ? `${driver.firstName} ${driver.lastName}` : "",
      ]
        .join(" ")
        .toLowerCase();
      if (text && !hay.includes(text)) return false;
      if (date && b.pickupAt.slice(0, 10) !== date) return false;
      if (applied.category !== "all" && b.category !== applied.category) return false;
      if (applied.zoneId !== "all") {
        const zone = zones.find((z) => z.id === applied.zoneId);
        if (zone && !`${b.pickup} ${b.dropoff ?? ""}`.toLowerCase().includes(zone.shortLabel.toLowerCase()) && !`${b.pickup} ${b.dropoff ?? ""}`.toLowerCase().includes(zone.name.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [bookings, drivers, query, tab, applied, zones, date]);

  return (
    <div className="bg-black">
      <Header
        title="Bookings"
        back={false}
        right={
          <div className="flex gap-2">
            <Link to="/search" search={{ q: "" }}>
              <IconButton label="Search">
                <Search size={18} />
              </IconButton>
            </Link>
            <IconButton label="Calendar" onClick={() => setDateOpen(true)}>
              <CalendarDays size={18} />
            </IconButton>
            <IconButton label="Filter" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={18} />
            </IconButton>
          </div>
        }
      />

      <div className="px-4">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f6f6f]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search booking, rider, address…"
            className="pl-10"
          />
        </div>

        <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate({ to: "/bookings", search: { tab: t.id, q: query } })}
              className={cn(
                "min-h-10 shrink-0 rounded-xl border px-3 text-xs font-semibold",
                tab === t.id ? "border-gold bg-gold/15 text-gold" : "border-border bg-card text-[#a5a5a5]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3 pb-6">
          {list.length === 0 ? (
            <Empty
              icon={<Search size={20} />}
              title={tab === "pending" && !query ? "All caught up" : "No results found"}
              body={
                tab === "pending" && !query
                  ? "There are no bookings awaiting assignment."
                  : "Try a different search or filter."
              }
            />
          ) : (
            list.map((booking) => <BookingCard key={booking.id} booking={booking} compact />)
          )}
        </div>
      </div>

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        zones={zones}
        value={filters}
        onChange={setFilters}
        onApply={() => {
          setApplied(filters);
          setFiltersOpen(false);
        }}
      />

      <BottomSheet open={dateOpen} onClose={() => setDateOpen(false)} title="Filter by date">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => { setDate(""); setDateOpen(false); }}>
            Reset
          </Button>
          <Button className="flex-1" onClick={() => setDateOpen(false)}>
            Apply
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

