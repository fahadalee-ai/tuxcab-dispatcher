import { createFileRoute } from "@tanstack/react-router";
import { CarFront } from "lucide-react";
import { useMemo, useState } from "react";
import { DarkMap } from "@/components/DarkMap";
import { DriverCard } from "@/components/cards";
import { Empty, Header, LinkButton } from "@/components/kit";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const CHIPS = ["All", "Permit Eligible", "Executive Sedan", "SUV"] as const;

export const Route = createFileRoute("/_app/zones/$id")({
  head: () => ({ meta: [{ title: "Zone · TuxCab Dispatch" }] }),
  component: ZoneDetailScreen,
});

function ZoneDetailScreen() {
  const { id } = Route.useParams();
  const { zones, drivers } = useApp();
  const zone = zones.find((z) => z.id === id);
  const [chip, setChip] = useState<(typeof CHIPS)[number]>("All");

  const inZone = drivers.filter((d) => d.zoneId === id);
  const available = inZone.filter((d) => d.status === "available");

  const list = useMemo(() => {
    return available.filter((d) => {
      if (chip === "Permit Eligible") return d.permitEligible;
      if (chip === "Executive Sedan") return d.category === "Executive Sedan";
      if (chip === "SUV") return d.category === "SUV (6 Pax)";
      return true;
    });
  }, [available, chip]);

  if (!zone) {
    return (
      <div className="bg-black">
        <Header title="Zone" />
        <div className="px-4">
          <Empty title="Zone not found" body="This zone is no longer available." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black pb-8">
      <Header title={zone.name} subtitle="Admin-managed zone · view only" />
      <div className="space-y-4 px-4">
        <DarkMap zoneName={zone.shortLabel} driverCount={available.length} className="h-44" />
        <p className="text-lg font-semibold text-white">
          {available.length} Available Driver{available.length === 1 ? "" : "s"}
        </p>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChip(c)}
              className={cn(
                "min-h-10 shrink-0 rounded-xl border px-3 text-xs font-semibold",
                chip === c ? "border-gold bg-gold/15 text-gold" : "border-border bg-card text-[#a5a5a5]",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <Empty
            icon={<CarFront size={20} />}
            title="No drivers available"
            body="No eligible drivers are currently available in this zone."
            action={
              <LinkButton variant="outline" to="/drivers">
                View All Drivers
              </LinkButton>
            }
          />
        ) : (
          <div className="space-y-3">
            {list.map((driver) => (
              <DriverCard key={driver.id} driver={driver} action="view" compactName />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
