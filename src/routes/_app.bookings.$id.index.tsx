import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDown, MapPin, Phone } from "lucide-react";
import { Badge, Button, Card, Empty, Header, LinkButton } from "@/components/kit";
import { BookingStatusBadge, CashBadge } from "@/components/StatusBadge";
import { formatPickupLong, fullName } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/bookings/$id/")({
  head: () => ({ meta: [{ title: "Booking Details · TuxCab Dispatch" }] }),
  component: BookingDetailScreen,
});

function BookingDetailScreen() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { bookings, drivers } = useApp();
  const booking = bookings.find((b) => b.id === id);
  const driver = booking?.driverId ? drivers.find((d) => d.id === booking.driverId) : undefined;

  if (!booking) {
    return (
      <div className="bg-black">
        <Header title="Booking Details" />
        <div className="px-4">
          <Empty
            title="Booking not found"
            body="This booking ID is invalid or is no longer available in dispatch."
            action={<LinkButton to="/bookings">Back to Bookings</LinkButton>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <Header title="Booking Details" />

      <div className="space-y-3 px-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-sm font-medium text-gold">#{booking.id}</p>
          <BookingStatusBadge status={booking.status} awaiting />
        </div>

        <Card className="space-y-4">
          <div>
            <p className="text-lg font-semibold text-white">{booking.riderName}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#a5a5a5]">
              <Phone size={13} />
              {booking.riderPhone}
            </p>
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            <div className="flex gap-2 text-sm text-white">
              <MapPin size={15} className="mt-0.5 shrink-0 text-gold" />
              <span>{booking.pickup}</span>
            </div>
            {booking.dropoff && (
              <>
                <ArrowDown size={14} className="ml-0.5 text-gold" />
                <div className="flex gap-2 text-sm text-[#a5a5a5]">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-[#6f6f6f]" />
                  <span>{booking.dropoff}</span>
                </div>
              </>
            )}
          </div>

          <p className="text-sm text-[#a5a5a5]">{formatPickupLong(booking.pickupAt)}</p>

          <div className="flex flex-wrap gap-1.5">
            <Badge tone="dark">{booking.category}</Badge>
            <Badge tone="dark">{booking.rideType}</Badge>
            {booking.permit ? <Badge tone="gold">Permit</Badge> : <Badge tone="muted">Standard</Badge>}
            <CashBadge />
          </div>
        </Card>

        <Card>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#6f6f6f]">Assignment</p>
          <p className="mt-2 text-base font-semibold text-white">{driver ? fullName(driver) : "Not assigned"}</p>
          <p className="mt-0.5 text-sm text-[#a5a5a5]">{driver?.vehicle ?? "No vehicle yet"}</p>
        </Card>
      </div>

      {booking.status === "pending" && (
        <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-black/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            full
            onClick={() => navigate({ to: "/bookings/$id/assign", params: { id: booking.id } })}
          >
            Assign Inhouse Driver
          </Button>
        </div>
      )}
    </div>
  );
}
