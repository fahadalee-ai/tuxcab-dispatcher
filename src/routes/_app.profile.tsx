import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, CircleHelp, LogOut, Settings, UserRound } from "lucide-react";
import { Badge, Button, Card, Header } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile · TuxCab Dispatch" }] }),
  component: ProfileScreen,
});

function ProfileScreen() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="bg-black pb-8">
      <Header title="Dispatcher" />
      <div className="space-y-4 px-4">
        <div className="flex flex-col items-center pt-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-elevated text-2xl font-semibold text-gold">
            {user?.initials}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-white">{user?.name}</h2>
          <p className="mt-1 text-sm text-[#a5a5a5]">{user?.role}</p>
          <div className="mt-2">
            <Badge tone="gold">{user?.region}</Badge>
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <Row icon={<UserRound size={18} />} label="Account" value={user?.email} />
          <Row icon={<Bell size={18} />} label="Notifications" value="Enabled" />
          <Row icon={<Settings size={18} />} label="App Preferences" value="Default" />
          <Row icon={<CircleHelp size={18} />} label="Help & Support" last />
        </Card>

        <Button
          full
          variant="destructive"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
        >
          <LogOut size={16} />
          Log Out
        </Button>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  last?: boolean;
}) {
  return (
    <div className={`flex min-h-14 items-center gap-3 px-4 ${last ? "" : "border-b border-border"}`}>
      <span className="text-gold">{icon}</span>
      <span className="flex-1 text-sm font-medium text-white">{label}</span>
      {value && <span className="text-xs text-[#6f6f6f]">{value}</span>}
    </div>
  );
}
