import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearStorage, readStorage, writeStorage } from "./storage";
import {
  formatPickupParts,
  generateBookingId,
  seedBookings,
  seedDispatcher,
  seedDrivers,
  seedNotifications,
  seedZones,
  type AppNotification,
  type Booking,
  type Dispatcher,
  type Driver,
  type RideType,
  type VehicleCategory,
} from "./mock-data";

export type Toast = { id: number; title: string; body?: string };

export type DriverFilters = {
  zoneId: string | "all";
  category: VehicleCategory | "all";
  status: Driver["status"] | "all";
  permit: "all" | "eligible" | "not_eligible";
};

export const DEFAULT_DRIVER_FILTERS: DriverFilters = {
  zoneId: "all",
  category: "all",
  status: "all",
  permit: "all",
};

export type NewJobInput = {
  riderName: string;
  riderPhone: string;
  riderEmail?: string;
  pickup: string;
  dropoff?: string;
  category: VehicleCategory;
  rideType: RideType;
  date: string;
  time: string;
  permit: boolean;
};

type Store = {
  ready: boolean;
  user: Dispatcher | null;
  login: (email: string, password: string, remember: boolean) => { ok: true };
  logout: () => void;
  bookings: Booking[];
  drivers: Driver[];
  zones: typeof seedZones;
  notifications: AppNotification[];
  markAllRead: () => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  createJob: (input: NewJobInput) => Booking;
  assignDriver: (bookingId: string, driverId: string) => { ok: true } | { ok: false; reason: string };
  eligibleDrivers: (booking: Booking) => Driver[];
  isEligible: (booking: Booking, driver: Driver) => boolean;
  toasts: Toast[];
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
};

const Ctx = createContext<Store | null>(null);

function loadSession(): Dispatcher | null {
  const id = readStorage("session");
  if (!id || id !== seedDispatcher.id) return null;
  return seedDispatcher;
}

export function isEligibleDriver(booking: Booking, driver: Driver) {
  if (driver.status !== "available") return false;
  if (!driver.vehicleActive) return false;
  if (driver.category !== booking.category) return false;
  if (booking.permit) {
    if (!driver.inhouse || !driver.permitEligible) return false;
  }
  return true;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<Dispatcher | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [drivers, setDrivers] = useState<Driver[]>(seedDrivers);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setUser(loadSession());
    setReady(true);
  }, []);

  const value = useMemo<Store>(() => {
    const pushToast = (title: string, body?: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, title, body }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
    };

    const isEligible = (booking: Booking, driver: Driver) => isEligibleDriver(booking, driver);

    return {
      ready,
      user,
      login: (_email, _password, remember) => {
        setUser(seedDispatcher);
        writeStorage("session", seedDispatcher.id, remember);
        return { ok: true };
      },
      logout: () => {
        setUser(null);
        clearStorage("session");
      },
      bookings,
      drivers,
      zones: seedZones,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      markAllRead: () => setNotifications((list) => list.map((n) => ({ ...n, read: true }))),
      markNotificationRead: (id) =>
        setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n))),
      createJob: (input) => {
        const times = formatPickupParts(input.date, input.time);
        const next: Booking = {
          id: generateBookingId(),
          riderName: input.riderName.trim(),
          riderPhone: input.riderPhone.trim(),
          riderEmail: input.riderEmail?.trim() || undefined,
          pickup: input.pickup.trim(),
          pickupShort: input.pickup.trim(),
          dropoff: input.dropoff?.trim() || undefined,
          dropoffShort: input.dropoff?.trim() || undefined,
          pickupAt: times.pickupAt,
          pickupLabel: times.pickupLabel,
          pickupTime: times.pickupTime,
          category: input.category,
          rideType: input.rideType,
          permit: input.permit,
          payment: "cash",
          status: "pending",
        };
        setBookings((list) => [next, ...list]);
        setNotifications((list) => [
          {
            id: `n-${Date.now()}`,
            title: "New booking awaiting assignment",
            body: `#${next.id}`,
            time: "Just now",
            read: false,
            href: `/bookings/${next.id}`,
            kind: "booking",
          },
          ...list,
        ]);
        pushToast("Job created", `#${next.id}`);
        return next;
      },
      assignDriver: (bookingId, driverId) => {
        const booking = bookings.find((b) => b.id === bookingId);
        const driver = drivers.find((d) => d.id === driverId);
        if (!booking || !driver) return { ok: false, reason: "Booking or driver not found." };
        if (booking.status !== "pending") return { ok: false, reason: "This booking is no longer awaiting assignment." };
        if (!isEligible(booking, driver)) {
          return {
            ok: false,
            reason: booking.permit
              ? "This permit ride can only be assigned to an eligible inhouse driver with an active matching vehicle."
              : "This driver is not eligible for the selected vehicle category.",
          };
        }

        setBookings((list) =>
          list.map((b) => (b.id === bookingId ? { ...b, status: "assigned", driverId } : b)),
        );
        setDrivers((list) =>
          list.map((d) => (d.id === driverId ? { ...d, status: "assigned", assignmentId: bookingId } : d)),
        );
        setNotifications((list) => [
          {
            id: `n-${Date.now()}`,
            title: "Assignment completed",
            body: `#${bookingId} assigned successfully.`,
            time: "Just now",
            read: false,
            href: `/bookings/${bookingId}`,
            kind: "assignment",
          },
          ...list,
        ]);
        return { ok: true };
      },
      eligibleDrivers: (booking) =>
        drivers
          .filter((d) => isEligible(booking, d))
          .sort((a, b) => a.distanceMi - b.distanceMi),
      isEligible,
      toasts,
      pushToast,
      dismissToast: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    };
  }, [ready, user, bookings, drivers, notifications, toasts]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
