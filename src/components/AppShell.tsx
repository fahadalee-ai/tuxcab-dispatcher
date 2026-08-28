import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BottomNav, TAB_PATHS } from "@/components/BottomNav";
import { useApp } from "@/lib/store";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { toasts, dismissToast } = useApp();
  const showNav = TAB_PATHS.includes(pathname);

  return (
    <div className="min-h-dvh bg-black">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col border-x border-border bg-black">
        <main className={showNav ? "flex-1 pb-[calc(4.75rem+env(safe-area-inset-bottom))]" : "flex-1"}>
          {children}
        </main>
        {showNav && <BottomNav />}

        <div className="pointer-events-none fixed left-1/2 top-[max(1rem,env(safe-area-inset-top))] z-[60] w-full max-w-[480px] -translate-x-1/2 space-y-2 px-4">
          {toasts.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => dismissToast(t.id)}
              className="pointer-events-auto w-full rounded-2xl border border-gold/30 bg-[#151515] px-4 py-3 text-left shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
            >
              <p className="text-sm font-semibold text-white">{t.title}</p>
              {t.body && <p className="mt-0.5 text-xs text-[#a5a5a5]">{t.body}</p>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
