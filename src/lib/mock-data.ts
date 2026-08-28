export type VehicleCategory = "Executive Sedan" | "SUV (6 Pax)" | "Sprinter Van";

export type RideType = "One Way" | "Round Trip";

export type BookingStatus = "pending" | "assigned" | "active" | "completed" | "cancelled";

export type DriverStatus = "available" | "assigned" | "on_trip" | "offline" | "unavailable";

export type PaymentMethod = "cash";

export type Dispatcher = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  region: string;
  initials: string;
};

export type Zone = {
  id: string;
  name: string;
  active: boolean;
  permitAllowed: boolean;
  shortLabel: string;
};

export type Driver = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseId: string;
  status: DriverStatus;
  zoneId: string;
  vehicle: string;
  category: VehicleCategory;
  permitEligible: boolean;
  inhouse: boolean;
  vehicleActive: boolean;
  vehicleStatus: "Active" | "Inactive";
  distanceMi: number;
  locationLabel: string;
  assignmentId?: string;
  initials: string;
};

export type Booking = {
  id: string;
  riderName: string;
  riderPhone: string;
  riderEmail?: string;
  pickup: string;
  pickupShort: string;
  dropoff?: string;
  dropoffShort?: string;
  pickupAt: string;
  pickupLabel: string;
  pickupTime: string;
  category: VehicleCategory;
  rideType: RideType;
  permit: boolean;
  payment: PaymentMethod;
  status: BookingStatus;
  driverId?: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href: string;
  kind: "booking" | "driver" | "assignment";
};

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  "Executive Sedan",
  "SUV (6 Pax)",
  "Sprinter Van",
];

export const seedDispatcher: Dispatcher = {
  id: "disp-1",
  name: "Dispatcher",
  email: "dispatcher@tuxcab.com",
  password: "Dispatch1",
  role: "Dispatch Operations",
  region: "Greater Sacramento Area",
  initials: "DI",
};

export const seedZones: Zone[] = [
  { id: "z-downtown", name: "Downtown Sacramento", active: true, permitAllowed: true, shortLabel: "Downtown" },
  { id: "z-westsac", name: "West Sacramento", active: true, permitAllowed: true, shortLabel: "West Sac" },
  { id: "z-airport", name: "Airport", active: true, permitAllowed: true, shortLabel: "Airport" },
  { id: "z-roseville", name: "Roseville", active: true, permitAllowed: true, shortLabel: "Roseville" },
  { id: "z-elkgrove", name: "Elk Grove", active: true, permitAllowed: true, shortLabel: "Elk Grove" },
];

export const seedDrivers: Driver[] = [
  {
    id: "dr-michael",
    firstName: "Michael",
    lastName: "Rodriguez",
    phone: "(916) 555-0144",
    licenseId: "CA-D-4829130",
    status: "available",
    zoneId: "z-downtown",
    vehicle: "Black Mercedes E-Class",
    category: "Executive Sedan",
    permitEligible: true,
    inhouse: true,
    vehicleActive: true,
    vehicleStatus: "Active",
    distanceMi: 1.8,
    locationLabel: "Inside Downtown Sacramento",
    initials: "MR",
  },
  {
    id: "dr-james",
    firstName: "James",
    lastName: "Torres",
    phone: "(916) 555-0188",
    licenseId: "CA-D-7712041",
    status: "available",
    zoneId: "z-westsac",
    vehicle: "Black SUV",
    category: "SUV (6 Pax)",
    permitEligible: true,
    inhouse: true,
    vehicleActive: true,
    vehicleStatus: "Active",
    distanceMi: 3.2,
    locationLabel: "Inside West Sacramento",
    initials: "JT",
  },
  {
    id: "dr-sofia",
    firstName: "Sofia",
    lastName: "Nguyen",
    phone: "(916) 555-0112",
    licenseId: "CA-D-3301988",
    status: "available",
    zoneId: "z-downtown",
    vehicle: "Black BMW 5 Series",
    category: "Executive Sedan",
    permitEligible: true,
    inhouse: false,
    vehicleActive: true,
    vehicleStatus: "Active",
    distanceMi: 2.4,
    locationLabel: "Inside Downtown Sacramento",
    initials: "SN",
  },
  {
    id: "dr-daniel",
    firstName: "Daniel",
    lastName: "Kim",
    phone: "(916) 555-0177",
    licenseId: "CA-D-9012334",
    status: "available",
    zoneId: "z-downtown",
    vehicle: "Black Cadillac XT6",
    category: "SUV (6 Pax)",
    permitEligible: false,
    inhouse: true,
    vehicleActive: true,
    vehicleStatus: "Active",
    distanceMi: 2.1,
    locationLabel: "Inside Downtown Sacramento",
    initials: "DK",
  },
  {
    id: "dr-elena",
    firstName: "Elena",
    lastName: "Park",
    phone: "(916) 555-0160",
    licenseId: "CA-D-5521099",
    status: "assigned",
    zoneId: "z-roseville",
    vehicle: "Black Lincoln Navigator",
    category: "SUV (6 Pax)",
    permitEligible: true,
    inhouse: true,
    vehicleActive: true,
    vehicleStatus: "Active",
    distanceMi: 14.6,
    locationLabel: "Inside Roseville",
    assignmentId: "BK-260812-QH4NWP",
    initials: "EP",
  },
  {
    id: "dr-marcus",
    firstName: "Marcus",
    lastName: "Bell",
    phone: "(916) 555-0133",
    licenseId: "CA-D-1188442",
    status: "available",
    zoneId: "z-roseville",
    vehicle: "Black Mercedes S-Class",
    category: "Executive Sedan",
    permitEligible: true,
    inhouse: true,
    vehicleActive: true,
    vehicleStatus: "Active",
    distanceMi: 16.2,
    locationLabel: "Inside Roseville",
    initials: "MB",
  },
  {
    id: "dr-priya",
    firstName: "Priya",
    lastName: "Shah",
    phone: "(916) 555-0194",
    licenseId: "CA-D-6644001",
    status: "offline",
    zoneId: "z-elkgrove",
    vehicle: "Black Chevrolet Suburban",
    category: "SUV (6 Pax)",
    permitEligible: true,
    inhouse: true,
    vehicleActive: true,
    vehicleStatus: "Active",
    distanceMi: 18.4,
    locationLabel: "Elk Grove",
    initials: "PS",
  },
  {
    id: "dr-owen",
    firstName: "Owen",
    lastName: "Hale",
    phone: "(916) 555-0108",
    licenseId: "CA-D-2291007",
    status: "unavailable",
    zoneId: "z-airport",
    vehicle: "Black Mercedes V-Class",
    category: "Sprinter Van",
    permitEligible: false,
    inhouse: false,
    vehicleActive: false,
    vehicleStatus: "Inactive",
    distanceMi: 11.0,
    locationLabel: "SMF Airport",
    initials: "OH",
  },
];

export const seedBookings: Booking[] = [
  {
    id: "BK-260805-C0AMRL",
    riderName: "Demo Passenger",
    riderPhone: "(916) 555-0001",
    riderEmail: "passenger@tuxcab.demo",
    pickup: "828 I St, Sacramento, CA 95814",
    pickupShort: "828 I St, Sacramento, CA",
    dropoff: "430 Regatta Ln, West Sacramento, CA 95605",
    dropoffShort: "430 Regatta Ln, West Sacramento",
    pickupAt: "2026-08-06T13:59:00-07:00",
    pickupLabel: "Aug 6 · 1:59 PM",
    pickupTime: "1:59 PM",
    category: "Executive Sedan",
    rideType: "One Way",
    permit: true,
    payment: "cash",
    status: "pending",
  },
  {
    id: "BK-260820-MB3QCU",
    riderName: "Demo Passenger",
    riderPhone: "(916) 555-0002",
    riderEmail: "passenger2@tuxcab.demo",
    pickup: "M9X6+R3 Fremont, CA, USA",
    pickupShort: "M9X6+R3 Fremont, CA, USA",
    dropoff: "1600 Amphitheatre Pkwy, Mountain View, CA",
    dropoffShort: "1600 Amphitheatre Pkwy, Mountain View, CA",
    pickupAt: "2026-08-20T10:30:00-07:00",
    pickupLabel: "Aug 20 · 10:30 AM",
    pickupTime: "10:30 AM",
    category: "SUV (6 Pax)",
    rideType: "One Way",
    permit: false,
    payment: "cash",
    status: "pending",
  },
  {
    id: "BK-260812-QH4NWP",
    riderName: "Andrea Cole",
    riderPhone: "(916) 555-0044",
    riderEmail: "andrea.cole@tuxcab.demo",
    pickup: "500 Capitol Mall, Sacramento, CA 95814",
    pickupShort: "500 Capitol Mall, Sacramento",
    dropoff: "Sacramento International Airport, CA",
    dropoffShort: "SMF Airport",
    pickupAt: "2026-08-27T18:45:00-07:00",
    pickupLabel: "Aug 27 · 6:45 PM",
    pickupTime: "6:45 PM",
    category: "SUV (6 Pax)",
    rideType: "One Way",
    permit: true,
    payment: "cash",
    status: "assigned",
    driverId: "dr-elena",
  },
  {
    id: "BK-260801-L9K2VX",
    riderName: "Robert Hale",
    riderPhone: "(916) 555-0071",
    pickup: "1200 K St, Sacramento, CA 95814",
    pickupShort: "1200 K St, Sacramento",
    dropoff: "Roseville Galleria, Roseville, CA",
    dropoffShort: "Roseville Galleria",
    pickupAt: "2026-08-01T09:15:00-07:00",
    pickupLabel: "Aug 1 · 9:15 AM",
    pickupTime: "9:15 AM",
    category: "Executive Sedan",
    rideType: "Round Trip",
    permit: false,
    payment: "cash",
    status: "completed",
    driverId: "dr-michael",
  },
  {
    id: "BK-260818-Z7PTQ2",
    riderName: "Nina Vasquez",
    riderPhone: "(916) 555-0090",
    pickup: "Elk Grove Blvd, Elk Grove, CA",
    pickupShort: "Elk Grove Blvd, Elk Grove",
    dropoff: "Downtown Commons, Sacramento, CA",
    dropoffShort: "Downtown Commons",
    pickupAt: "2026-08-18T16:00:00-07:00",
    pickupLabel: "Aug 18 · 4:00 PM",
    pickupTime: "4:00 PM",
    category: "Sprinter Van",
    rideType: "One Way",
    permit: true,
    payment: "cash",
    status: "cancelled",
  },
];

export const seedNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "New booking awaiting assignment",
    body: "#BK-260805-C0AMRL",
    time: "12 min ago",
    read: false,
    href: "/bookings/BK-260805-C0AMRL",
    kind: "booking",
  },
  {
    id: "n2",
    title: "Driver became available",
    body: "Michael Rodriguez is now available in Downtown Sacramento.",
    time: "28 min ago",
    read: false,
    href: "/drivers/dr-michael",
    kind: "driver",
  },
  {
    id: "n3",
    title: "Assignment completed",
    body: "#BK-260812-QH4NWP assigned successfully.",
    time: "2 hours ago",
    read: true,
    href: "/bookings/BK-260812-QH4NWP",
    kind: "assignment",
  },
];

export function shortName(driver: Driver) {
  return `${driver.firstName} ${driver.lastName[0]}.`;
}

export function fullName(driver: Driver) {
  return `${driver.firstName} ${driver.lastName}`;
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function todayLong() {
  return new Date(2026, 7, 27).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function bookingStatusLabel(status: BookingStatus) {
  switch (status) {
    case "pending":
      return "Pending Assignment";
    case "assigned":
      return "Assigned";
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
  }
}

export function driverStatusLabel(status: DriverStatus) {
  switch (status) {
    case "available":
      return "Available";
    case "assigned":
      return "Assigned";
    case "on_trip":
      return "On Trip";
    case "offline":
      return "Offline";
    case "unavailable":
      return "Unavailable";
  }
}

export function generateBookingId() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BK-${yy}${mm}${dd}-${rand}`;
}

export function formatPickupParts(date: string, time: string) {
  if (!date) return { pickupAt: "", pickupLabel: "", pickupTime: "" };
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time || "12:00").split(":").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 12, mm ?? 0);
  const pickupTime = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const pickupLabel = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " · " + pickupTime;
  return { pickupAt: dt.toISOString(), pickupLabel, pickupTime };
}

export function formatPickupLong(iso: string) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return iso;
  return (
    dt.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " · " +
    dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" })
  );
}
