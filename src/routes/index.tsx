import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BrandMark } from "@/components/Logo";
import { Button, Field, Input } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In · TuxCab Dispatch" },
      { name: "description", content: "TuxCab Dispatch internal operations portal." },
    ],
  }),
  component: LoginScreen,
});

function LoginScreen() {
  const { user, ready, login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  if (!ready) return <div className="min-h-dvh bg-black" />;
  if (user) return <Navigate to="/overview" />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, remember);
    navigate({ to: "/overview" });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-black px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
      <div className="flex flex-1 flex-col justify-center">
        <BrandMark />
        <p className="mt-4 text-center text-xs uppercase tracking-[0.18em] text-[#6f6f6f]">
          Internal Operations Portal
        </p>

        <form onSubmit={submit} className="mt-10">
          <Field label="Email / Dispatcher ID">
            <Input
              autoComplete="username"
              placeholder="dispatcher@tuxcab.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <label className="mb-6 flex min-h-11 items-center gap-3 text-sm text-[#a5a5a5]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-5 w-5 rounded border-border bg-elevated accent-gold"
            />
            Remember me
          </label>

          <Button type="submit" full>
            Sign In
          </Button>
          <p className="mt-4 text-center text-xs text-[#6f6f6f]">Authorized personnel only</p>
        </form>
      </div>

      <p className="pt-8 text-center text-[11px] tracking-wide text-[#6f6f6f]">
        TuxCab Dispatch · Internal Use
      </p>
    </div>
  );
}
