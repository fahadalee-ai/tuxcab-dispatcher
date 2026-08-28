import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, Empty, Header, LinkButton, Meta } from "@/components/kit";
import { DriverStatusDot, PermitBadge } from "@/components/StatusBadge";
import { fullName } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/drivers/$id")({
  head: () => ({ meta: [{ title: "Driver Details · TuxCab Dispatch" }] }),
  component: DriverDetailScreen,
});

function DriverDetailScreen() {
  const { id } = Route.useParams();
  const { drivers, zones, bookings } = useApp();
  const driver = drivers.find((d) => d.id === id);
  const zone = driver ? zones.find((z) => z.id === driver.zoneId) : undefined;
  const assignment = driver?.assignmentId ? bookings.find((b) => b.id === driver.assignmentId) : undefined;

  if (!driver) {
    return (
      <div className="bg-black">
        <Header title="Driver Details" />
        <div className="px-4">
          <Empty title="Driver not found" body="This driver is no longer in the roster." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black pb-8">
      <Header title="Driver Details" />
      <div className="space-y-4 px-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-elevated text-lg font-semibold text-gold">
            {driver.initials}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{fullName(driver)}</h2>
            <div className="mt-1">
              <DriverStatusDot status={driver.status} />
            </div>
          </div>
        </div>

        <Card className="space-y-3">
          <Meta>Driver Information</Meta>
          <Row label="Phone" value={driver.phone} />
          <Row label="License / ID" value={driver.licenseId} />
          <Row label="Zone" value={zone?.name ?? "Unassigned"} />
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#6f6f6f]">Permit status</p>
            <div className="mt-1">
              <PermitBadge eligible={driver.permitEligible} />
            </div>
          </div>
          {driver.inhouse ? <Badge tone="gold">Inhouse Driver</Badge> : <Badge tone="muted">Contractor</Badge>}
        </Card>

        <Card className="space-y-3">
          <Meta>Vehicle</Meta>
          <p className="text-lg font-semibold text-white">{driver.vehicle}</p>
          <Row label="Category" value={driver.category} />
          <Row label="Status" value={driver.vehicleStatus} />
          <Row label="Permit" value={driver.permitEligible ? "Valid / Eligible" : "Not Eligible"} />
        </Card>

        <Card className="space-y-3">
          <Meta>Current Status</Meta>
          <Row label="Zone" value={zone?.name ?? "—"} />
          <Row label="Current Assignment" value={assignment ? `#${assignment.id}` : "None"} />
          <Row label="Availability" value={driver.status === "available" ? "Ready" : driver.status.replace("_", " ")} />
        </Card>

        {assignment && (
          <LinkButton variant="outline" to="/bookings/$id" params={{ id: assignment.id }}>
            View Assignment
          </LinkButton>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-[#6f6f6f]">{label}</p>
      <p className="mt-1 text-sm capitalize text-white">{value}</p>
    </div>
  );
}
