import { Navigate, Outlet, createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, ready } = useApp();
  if (!ready) return <div className="min-h-dvh bg-black" />;
  if (!user) return <Navigate to="/" />;
  return <Outlet />;
}
