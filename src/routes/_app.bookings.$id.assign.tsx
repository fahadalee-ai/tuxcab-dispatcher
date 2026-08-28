import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ConfirmAssignModal } from "@/components/ConfirmAssign";
import { Badge, Button, Empty, Header, LinkButton } from "@/components/kit";
import { DriverStatusDot } from "@/components/StatusBadge";
import { shortName, type Driver } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/bookings/$id/assign")({
  head: () => ({ meta: [{ title: "Assign Driver · TuxCab Dispatch" }] }),
  component: AssignDriverScreen,
});

function AssignDriverScreen() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { bookings, eligibleDrivers, assignDriver, pushToast } = useApp();
  const booking = bookings.find((b) => b.id === id);
  const [selected, setSelected] = useState<Driver | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!booking) {
    return (
      <div className="bg-black">
        <Header title="Assign Driver" />
        <div className="px-4">
          <Empty title="Booking not found" body="Unable to load this assignment." />
        </div>
      </div>
    );
  }

  const eligible = eligibleDrivers(booking);

  const confirm = () => {
    if (!selected || busy) return;
    setBusy(true);
    const result = assignDriver(booking.id, selected.id);
    if (!result.ok) {
      setBusy(false);
      setConfirming(false);
      pushToast("Assignment blocked", result.reason);
      return;
    }
    navigate({
      to: "/assignment/success",
      search: { bookingId: booking.id, driverId: selected.id },
    });
  };

  return (
    <div className="bg-black pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <Header title="Assign Driver" subtitle="Nearest first" />

      <div className="space-y-4 px-4">
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="font-mono text-xs text-gold">#{booking.id}</p>
          <p className="mt-1 font-semibold text-white">{booking.riderName}</p>
          <p className="mt-1 truncate text-sm text-[#a5a5a5]">{booking.pickupShort}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone="dark">{booking.category}</Badge>
            {booking.permit ? <Badge tone="gold">Permit</Badge> : <Badge tone="muted">Standard</Badge>}
          </div>
        </div>

        <p className="text-sm text-[#a5a5a5]">
          {eligible.length} eligible inhouse driver{eligible.length === 1 ? "" : "s"}
        </p>

        {eligible.length === 0 ? (
          <Empty
            title="No eligible inhouse drivers"
            body="This permit ride needs an available inhouse driver with a matching active vehicle."
            action={
              <LinkButton variant="outline" to="/drivers">
                View All Drivers
              </LinkButton>
            }
          />
        ) : (
          <div className="space-y-2">
            {eligible.map((driver) => {
              const active = selected?.id === driver.id;
              return (
                <button
                  key={driver.id}
                  type="button"
                  onClick={() => setSelected(driver)}
                  className={cn(
                    "flex w-full min-h-[72px] items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors",
                    active ? "border-gold bg-gold/10" : "border-border bg-card",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                      active ? "border-gold text-gold" : "border-border text-[#a5a5a5]",
                    )}
                  >
                    {driver.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{shortName(driver)}</p>
                    <p className="mt-0.5 truncate text-xs text-[#a5a5a5]">
                      {driver.vehicle} · {driver.locationLabel.replace("Inside ", "")}
                    </p>
                    <div className="mt-1">
                      <DriverStatusDot status={driver.status} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gold">{driver.distanceMi.toFixed(1)} mi</p>
                    {driver.permitEligible && <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[#8fcaa3]">Permit</p>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-black/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button full disabled={!selected} onClick={() => selected && setConfirming(true)}>
          Assign Inhouse Driver
        </Button>
      </div>

      {selected && (
        <ConfirmAssignModal
          open={confirming}
          booking={booking}
          driver={selected}
          onCancel={() => setConfirming(false)}
          onConfirm={confirm}
        />
      )}
    </div>
  );
}
