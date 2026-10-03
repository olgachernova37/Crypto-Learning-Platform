// App chrome shared by every page. Agent C owns the internals; keep this API stable.
//
// variant "immersive": dark full-bleed screens (globe, boat route) — thin top bar overlaid
//   on the scene, OceanX style (logo centre, "Lessons" pill right).
// variant "light": regular pages (partners, progress) — top bar + bottom nav on mobile.
// variant "bare": no chrome at all (the full-screen lesson page draws its own header).

import type { ReactNode } from "react";

export type AppShellProps = {
  variant?: "immersive" | "light" | "bare";
  children: ReactNode;
};

export function AppShell({ variant = "light", children }: AppShellProps) {
  if (variant === "bare") return <>{children}</>;
  return (
    <div className={variant === "immersive" ? "min-h-dvh bg-sea-night text-white" : "min-h-dvh"}>
      {children}
    </div>
  );
}
