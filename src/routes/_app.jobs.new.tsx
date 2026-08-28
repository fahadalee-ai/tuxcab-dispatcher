import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Field, Header, Input, Select } from "@/components/kit";
import { VEHICLE_CATEGORIES, type RideType, type VehicleCategory } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/jobs/new")({
  head: () => ({ meta: [{ title: "Create New Job · TuxCab Dispatch" }] }),
  component: CreateJobScreen,
});

function PermitToggle({ on, onChange }: { on: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Permit ride"
      onClick={() => onChange(!on)}
      className={cn(
        "relative inline-flex h-8 w-[52px] shrink-0 items-center rounded-full p-0.5 transition-colors",
        on ? "bg-gold" : "bg-[#2e2e2e]",
      )}
    >
      <span
        className={cn(
          "block h-7 w-7 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
          on ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

function CreateJobScreen() {
  const navigate = useNavigate();
  const { createJob } = useApp();
  const [riderName, setRiderName] = useState("");
  const [riderPhone, setRiderPhone] = useState("");
  const [riderEmail, setRiderEmail] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [category, setCategory] = useState<VehicleCategory>("Executive Sedan");
  const [rideType, setRideType] = useState<RideType>("One Way");
  const [date, setDate] = useState("2026-08-27");
  const [time, setTime] = useState("14:00");
  const [permit, setPermit] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!riderName.trim()) next.riderName = "Passenger name is required.";
    if (!riderPhone.trim()) next.riderPhone = "Contact number is required.";
    if (!pickup.trim()) next.pickup = "Pickup address is required.";
    if (!date) next.date = "Pickup date is required.";
    if (!time) next.time = "Pickup time is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = (assign: boolean) => {
    if (!validate()) return;
    const booking = createJob({
      riderName,
      riderPhone,
      riderEmail,
      pickup,
      dropoff,
      category,
      rideType,
      date,
      time,
      permit,
    });
    navigate(
      assign
        ? { to: "/bookings/$id/assign", params: { id: booking.id } }
        : { to: "/bookings/$id", params: { id: booking.id } },
    );
  };

  return (
    <div className="bg-black pb-[calc(8.75rem+env(safe-area-inset-bottom))]">
      <Header title="Create New Job" subtitle="Passenger and trip details" />

      <div className="space-y-5 px-4">
        <section>
          <SectionLabel>Passenger</SectionLabel>
          <Field label="Passenger Name" error={errors.riderName}>
            <Input
              placeholder="Enter passenger name"
              value={riderName}
              error={Boolean(errors.riderName)}
              onChange={(e) => setRiderName(e.target.value)}
            />
          </Field>
          <Field label="Contact Number" error={errors.riderPhone}>
            <Input
              type="tel"
              placeholder="(916) 555-0000"
              value={riderPhone}
              error={Boolean(errors.riderPhone)}
              onChange={(e) => setRiderPhone(e.target.value)}
            />
          </Field>
          <Field label="Email" optional>
            <Input type="email" placeholder="name@email.com" value={riderEmail} onChange={(e) => setRiderEmail(e.target.value)} />
          </Field>
        </section>

        <section>
          <SectionLabel>Trip</SectionLabel>
          <Field label="Pickup Address" error={errors.pickup}>
            <div className="relative">
              <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
              <Input
                placeholder="Enter pickup address"
                value={pickup}
                error={Boolean(errors.pickup)}
                className="pl-10"
                onChange={(e) => setPickup(e.target.value)}
              />
            </div>
          </Field>
          <Field label="Drop-off Address" optional>
            <div className="relative">
              <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f6f6f]" />
              <Input
                placeholder="Enter drop-off address"
                value={dropoff}
                className="pl-10"
                onChange={(e) => setDropoff(e.target.value)}
              />
            </div>
          </Field>
        </section>

        <section>
          <SectionLabel>Ride</SectionLabel>
          <Field label="Vehicle Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value as VehicleCategory)}>
              {VEHICLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Ride Type">
            <div className="grid grid-cols-2 gap-2">
              {(["One Way", "Round Trip"] as RideType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRideType(type)}
                  className={cn(
                    "min-h-11 rounded-2xl border text-sm font-semibold",
                    rideType === type ? "border-gold bg-gold text-black" : "border-border bg-elevated text-[#a5a5a5]",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" error={errors.date}>
              <Input type="date" value={date} error={Boolean(errors.date)} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Time" error={errors.time}>
              <Input type="time" value={time} error={Boolean(errors.time)} onChange={(e) => setTime(e.target.value)} />
            </Field>
          </div>
        </section>

        <div className="flex items-center justify-between rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">Payment</p>
            <p className="mt-0.5 text-xs text-[#a5a5a5]">Collected from the passenger</p>
          </div>
          <Badge tone="gold">Cash Only</Badge>
        </div>

        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <div className="flex min-h-11 items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Permit Ride</p>
              <p className="mt-0.5 text-xs text-[#6f6f6f]">{permit ? "On — inhouse drivers only" : "Off"}</p>
            </div>
            <PermitToggle on={permit} onChange={setPermit} />
          </div>
          {permit && (
            <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-[#a5a5a5]">
              Only eligible inhouse drivers with an active vehicle in this category can be assigned.
            </p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-black/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button full onClick={() => save(true)}>
          Create & Assign Driver
        </Button>
        <Button full variant="secondary" className="mt-2" onClick={() => save(false)}>
          Save Without Assignment
        </Button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f6f6f]">{children}</h2>;
}
