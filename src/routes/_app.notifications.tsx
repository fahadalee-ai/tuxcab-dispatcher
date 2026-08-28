import { Link, createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Button, Card, Empty, Header } from "@/components/kit";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications · TuxCab Dispatch" }] }),
  component: NotificationsScreen,
});

function NotificationsScreen() {
  const { notifications, markAllRead, markNotificationRead } = useApp();

  return (
    <div className="bg-black pb-8">
      <Header
        title="Notifications"
        right={
          notifications.some((n) => !n.read) ? (
            <Button variant="ghost" className="h-11 px-2 text-xs" onClick={markAllRead}>
              Mark all read
            </Button>
          ) : undefined
        }
      />
      <div className="space-y-2 px-4">
        {notifications.length === 0 ? (
          <Empty icon={<Bell size={20} />} title="You're all caught up" body="No dispatch notifications right now." />
        ) : (
          notifications.map((n) => (
            <Link key={n.id} to={n.href as "/"} onClick={() => markNotificationRead(n.id)}>
              <Card
                className={cn("transition-colors", !n.read && "border-gold/35 bg-gold/5")}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{n.title}</p>
                  {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />}
                </div>
                <p className="mt-1 text-sm text-[#a5a5a5]">{n.body}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[#6f6f6f]">{n.time}</p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
