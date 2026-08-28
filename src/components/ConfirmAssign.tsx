import { Button } from "@/components/kit";
import { fullName, type Booking, type Driver } from "@/lib/mock-data";

export function ConfirmAssignModal({
  open,
  booking,
  driver,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  booking: Booking;
  driver: Driver;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 px-4">
      <div className="mb-[max(1rem,env(safe-area-inset-bottom))] w-full max-w-[440px] rounded-t-3xl border border-border bg-card p-5">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <h3 className="text-xl font-semibold tracking-tight text-white">Assign Driver?</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#a5a5a5]">
          Assign {fullName(driver)} to #{booking.id}?
        </p>
        <p className="mt-3 text-sm text-white">
          {booking.riderName}
          <span className="text-[#6f6f6f]"> · </span>
          {driver.vehicle}
        </p>

        <div className="mt-5 space-y-2">
          <Button full onClick={onConfirm}>
            Confirm Assignment
          </Button>
          <Button full variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
