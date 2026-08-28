import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/bookings/$id")({
  component: BookingIdLayout,
});

function BookingIdLayout() {
  return <Outlet />;
}
