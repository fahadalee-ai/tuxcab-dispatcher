import { createFileRoute } from "@tanstack/react-router";
import { ZoneCard } from "@/components/cards";
import { Card, Header } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/zones/")({
  head: () => ({ meta: [{ title: "Zones · TuxCab Dispatch" }] }),
  component: ZonesScreen,
});

function ZonesScreen() {
  const { zones, drivers } = useApp();

  return (
    <div className="bg-black pb-6">
      <Header title="Zones" subtitle="Admin-managed service zones" back={false} />
      <div className="space-y-3 px-4">
        <Card className="border-gold/25 bg-gold/5">
          <p className="text-sm leading-relaxed text-[#a5a5a5]">
            Zones are created and managed by Admin. Dispatchers can view zones and available drivers only.
          </p>
        </Card>
        {zones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            available={drivers.filter((d) => d.zoneId === zone.id && d.status === "available").length}
          />
        ))}
      </div>
    </div>
  );
}
