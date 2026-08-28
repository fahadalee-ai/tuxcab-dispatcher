import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { DriverCard } from "@/components/cards";
import { FilterSheet, applyDriverFilters } from "@/components/FilterSheet";
import { Empty, Header, IconButton, Input } from "@/components/kit";
import { DEFAULT_DRIVER_FILTERS, useApp, type DriverFilters } from "@/lib/store";

export const Route = createFileRoute("/_app/drivers/")({
  head: () => ({ meta: [{ title: "Available Drivers · TuxCab Dispatch" }] }),
  component: DriversScreen,
});

function DriversScreen() {
  const { drivers, zones } = useApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<DriverFilters>({ ...DEFAULT_DRIVER_FILTERS, status: "available" });
  const [applied, setApplied] = useState<DriverFilters>({ ...DEFAULT_DRIVER_FILTERS, status: "available" });

  const ready = drivers.filter((d) => d.status === "available").length;

  const list = useMemo(() => {
    const text = query.trim().toLowerCase();
    return applyDriverFilters(drivers, applied).filter((d) => {
      if (!text) return true;
      const hay = `${d.firstName} ${d.lastName} ${d.vehicle} ${d.category} ${d.phone}`.toLowerCase();
      return hay.includes(text);
    });
  }, [drivers, applied, query]);

  return (
    <div className="bg-black pb-6">
      <Header
        title="Available Drivers"
        subtitle={`${ready} drivers ready`}
        back={false}
        right={
          <IconButton label="Filter" onClick={() => setOpen(true)}>
            <SlidersHorizontal size={18} />
          </IconButton>
        }
      />
      <div className="px-4">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f6f6f]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search driver or vehicle"
            className="pl-10"
          />
        </div>
        <div className="mt-4 space-y-3">
          {list.length === 0 ? (
            <Empty
              title={query ? "No results found" : "No drivers available"}
              body={
                query
                  ? "No drivers match that search."
                  : "No eligible drivers are currently available in this zone."
              }
            />
          ) : (
            list.map((driver) => <DriverCard key={driver.id} driver={driver} action="view" />)
          )}
        </div>
      </div>

      <FilterSheet
        open={open}
        onClose={() => setOpen(false)}
        zones={zones}
        value={filters}
        onChange={setFilters}
        onApply={() => {
          setApplied(filters);
          setOpen(false);
        }}
      />
    </div>
  );
}
