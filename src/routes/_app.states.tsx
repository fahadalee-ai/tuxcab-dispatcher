import { createFileRoute } from "@tanstack/react-router";
import { CarFront, ClipboardCheck, Search, TriangleAlert } from "lucide-react";
import { Button, Card, Empty, Header, LinkButton, SectionTitle } from "@/components/kit";

export const Route = createFileRoute("/_app/states")({
  head: () => ({ meta: [{ title: "States · TuxCab Dispatch" }] }),
  component: StatesScreen,
});

function StatesScreen() {
  return (
    <div className="bg-black pb-10">
      <Header title="Empty & Error States" subtitle="Operational fallbacks" />
      <div className="space-y-6 px-4">
        <section>
          <SectionTitle>No Pending Bookings</SectionTitle>
          <Empty
            icon={<ClipboardCheck size={20} />}
            title="All caught up"
            body="There are no bookings awaiting assignment."
          />
        </section>

        <section>
          <SectionTitle>No Available Drivers</SectionTitle>
          <Empty
            icon={<CarFront size={20} />}
            title="No drivers available"
            body="No eligible drivers are currently available in this zone."
          />
        </section>

        <section>
          <SectionTitle>No Eligible Driver for Permit Ride</SectionTitle>
          <Empty
            icon={<CarFront size={20} />}
            title="No eligible inhouse drivers"
            body="This permit ride requires an inhouse driver with an active vehicle in the selected category."
            action={
              <LinkButton variant="outline" to="/drivers">
                View All Drivers
              </LinkButton>
            }
          />
        </section>

        <section>
          <SectionTitle>Search</SectionTitle>
          <Empty icon={<Search size={20} />} title="No results found" body="Nothing matches that search." />
        </section>

        <section>
          <SectionTitle>Error</SectionTitle>
          <Card className="border-danger/30 bg-danger/5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/15 text-danger">
              <TriangleAlert size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Unable to complete assignment</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#a5a5a5]">
              This permit ride can only be assigned to an eligible inhouse driver with an active matching vehicle.
            </p>
            <Button variant="secondary" className="mt-4">
              Return to booking
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
}
