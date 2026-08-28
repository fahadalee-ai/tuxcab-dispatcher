import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Card, Empty, Header, LinkButton } from "@/components/kit";
import { fullName } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/assignment/success")({
  validateSearch: (s: Record<string, unknown>) => ({
    bookingId: typeof s.bookingId === "string" ? s.bookingId : "",
    driverId: typeof s.driverId === "string" ? s.driverId : "",
  }),
  head: () => ({ meta: [{ title: "Driver Assigned · TuxCab Dispatch" }] }),
  component: AssignmentSuccessScreen,
});

function AssignmentSuccessScreen() {
  const { bookingId, driverId } = Route.useSearch();
  const { bookings, drivers } = useApp();
  const booking = bookings.find((b) => b.id === bookingId);
  const driver = drivers.find((d) => d.id === driverId);

  if (!booking || !driver) {
    return (
      <div className="bg-black">
        <Header title="Assignment" back={false} />
        <div className="px-4">
          <Empty title="Assignment not found" body="Return to overview to continue dispatching." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-black px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
          <Check size={36} strokeWidth={2.4} />
        </div>
        <h1 className="mt-5 text-[28px] font-semibold tracking-tight text-white">Driver Assigned</h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#a5a5a5]">
          {fullName(driver)} has been assigned to booking #{booking.id}.
        </p>
        <Card className="mt-6 w-full text-left">
          <p className="text-sm font-semibold text-white">{fullName(driver)}</p>
          <p className="mt-1 text-sm text-[#a5a5a5]">{driver.vehicle}</p>
          <p className="mt-1 text-xs text-gold">{booking.category}</p>
        </Card>
      </div>
      <div className="space-y-2">
        <LinkButton full to="/bookings/$id" params={{ id: booking.id }}>
          View Booking
        </LinkButton>
        <LinkButton full variant="secondary" to="/overview">
          Back to Overview
        </LinkButton>
      </div>
    </div>
  );
}
