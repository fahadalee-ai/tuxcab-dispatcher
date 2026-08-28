import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BookingCard, DriverCard } from "@/components/cards";
import { Empty, Header, Input, SectionTitle } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/search")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : "",
  }),
  head: () => ({ meta: [{ title: "Search · TuxCab Dispatch" }] }),
  component: SearchScreen,
});

function SearchScreen() {
  const { q: initial } = Route.useSearch();
  const { bookings, drivers } = useApp();
  const [query, setQuery] = useState(initial);

  const text = query.trim().toLowerCase();

  const matchedBookings = useMemo(() => {
    if (!text) return [];
    return bookings.filter((b) =>
      [b.id, b.riderName, b.riderPhone, b.pickup, b.dropoff ?? "", b.category].join(" ").toLowerCase().includes(text),
    );
  }, [bookings, text]);

  const matchedDrivers = useMemo(() => {
    if (!text) return [];
    return drivers.filter((d) =>
      `${d.firstName} ${d.lastName} ${d.phone} ${d.vehicle} ${d.category}`.toLowerCase().includes(text),
    );
  }, [drivers, text]);

  const empty = text.length > 0 && matchedBookings.length === 0 && matchedDrivers.length === 0;

  return (
    <div className="bg-black pb-8">
      <Header title="Search" />
      <div className="px-4">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f6f6f]" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Booking, rider, driver, phone, address…"
            className="pl-10"
          />
        </div>

        {!text && (
          <p className="mt-6 text-center text-sm text-[#6f6f6f]">
            Search by booking ID, passenger, driver, phone, pickup, drop-off, or vehicle.
          </p>
        )}

        {empty && (
          <div className="mt-6">
            <Empty icon={<Search size={20} />} title="No results found" body="Nothing matches that search." />
          </div>
        )}

        {matchedBookings.length > 0 && (
          <>
            <SectionTitle>{matchedBookings.length} bookings</SectionTitle>
            <div className="space-y-3">
              {matchedBookings.map((b) => (
                <BookingCard key={b.id} booking={b} compact />
              ))}
            </div>
          </>
        )}

        {matchedDrivers.length > 0 && (
          <>
            <SectionTitle>{matchedDrivers.length} drivers</SectionTitle>
            <div className="space-y-3">
              {matchedDrivers.map((d) => (
                <DriverCard key={d.id} driver={d} action="view" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
