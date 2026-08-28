import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, CarFront, LayoutGrid, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/overview", label: "Overview", icon: LayoutGrid },
  { to: "/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/zones", label: "Zones", icon: MapPinned },
  { to: "/drivers", label: "Drivers", icon: CarFront },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-black/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-md">
      <div className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to as "/"}
              className="relative flex min-h-12 flex-col items-center justify-center gap-1 px-1 py-1"
            >
              {active && <span className="absolute top-0 h-0.5 w-6 rounded-full bg-gold" />}
              <Icon size={20} strokeWidth={active ? 2.2 : 1.7} className={active ? "text-gold" : "text-[#6f6f6f]"} />
              <span className={cn("text-[10px] font-medium", active ? "text-gold" : "text-[#6f6f6f]")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export const TAB_PATHS = ["/overview", "/bookings", "/zones", "/drivers"];
