import { Button, BottomSheet } from "@/components/kit";
import { VEHICLE_CATEGORIES, type DriverStatus, type VehicleCategory, type Zone } from "@/lib/mock-data";
import { DEFAULT_DRIVER_FILTERS, type DriverFilters } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUSES: { id: DriverStatus | "all"; label: string }[] = [
  { id: "all", label: "Any status" },
  { id: "available", label: "Available" },
  { id: "assigned", label: "Assigned" },
  { id: "on_trip", label: "On Trip" },
  { id: "offline", label: "Offline" },
];

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-xl border px-3 text-xs font-semibold",
        active ? "border-gold bg-gold/15 text-gold" : "border-border bg-elevated text-[#a5a5a5]",
      )}
    >
      {children}
    </button>
  );
}

export function FilterSheet({
  open,
  onClose,
  zones,
  value,
  onChange,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  zones: Zone[];
  value: DriverFilters;
  onChange: (next: DriverFilters) => void;
  onApply: () => void;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Filters">
      <div className="max-h-[60vh] space-y-5 overflow-y-auto no-scrollbar">
        <section>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#6f6f6f]">Filter by Zone</p>
          <div className="flex flex-wrap gap-2">
            <Chip active={value.zoneId === "all"} onClick={() => onChange({ ...value, zoneId: "all" })}>
              All zones
            </Chip>
            {zones.map((z) => (
              <Chip key={z.id} active={value.zoneId === z.id} onClick={() => onChange({ ...value, zoneId: z.id })}>
                {z.name}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#6f6f6f]">Vehicle Category</p>
          <div className="flex flex-wrap gap-2">
            <Chip active={value.category === "all"} onClick={() => onChange({ ...value, category: "all" })}>
              All
            </Chip>
            {VEHICLE_CATEGORIES.map((c) => (
              <Chip
                key={c}
                active={value.category === c}
                onClick={() => onChange({ ...value, category: c as VehicleCategory })}
              >
                {c === "SUV (6 Pax)" ? "SUV" : c}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#6f6f6f]">Driver Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Chip key={s.id} active={value.status === s.id} onClick={() => onChange({ ...value, status: s.id })}>
                {s.label}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#6f6f6f]">Permit</p>
          <div className="flex flex-wrap gap-2">
            <Chip active={value.permit === "all"} onClick={() => onChange({ ...value, permit: "all" })}>
              All
            </Chip>
            <Chip active={value.permit === "eligible"} onClick={() => onChange({ ...value, permit: "eligible" })}>
              Eligible
            </Chip>
            <Chip
              active={value.permit === "not_eligible"}
              onClick={() => onChange({ ...value, permit: "not_eligible" })}
            >
              Not Eligible
            </Chip>
          </div>
        </section>
      </div>

      <div className="mt-5 flex gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => {
            onChange(DEFAULT_DRIVER_FILTERS);
          }}
        >
          Reset
        </Button>
        <Button className="flex-1" onClick={onApply}>
          Apply Filters
        </Button>
      </div>
    </BottomSheet>
  );
}

export function applyDriverFilters<
  T extends { zoneId: string; category: string; status: string; permitEligible: boolean },
>(drivers: T[], filters: DriverFilters): T[] {
  return drivers.filter((d) => {
    if (filters.zoneId !== "all" && d.zoneId !== filters.zoneId) return false;
    if (filters.category !== "all" && d.category !== filters.category) return false;
    if (filters.status !== "all" && d.status !== filters.status) return false;
    if (filters.permit === "eligible" && !d.permitEligible) return false;
    if (filters.permit === "not_eligible" && d.permitEligible) return false;
    return true;
  });
}
