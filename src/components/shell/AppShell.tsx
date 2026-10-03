// App chrome shared by every page. Agent C owns the internals; keep this API stable.
//
// variant "immersive": dark full-bleed screens (globe, boat route) — thin transparent top bar
//   overlaid on the scene, OceanX style (logo left, "Lessons ☰" pill right). The bar only
//   catches the pointer on its own controls, so the scene underneath stays interactive.
// variant "light": regular pages (partners, progress) — top bar (links on desktop) + a rounded
//   bottom nav on mobile.
// variant "bare": no chrome at all (the full-screen lesson page draws its own header).

import type { ReactNode } from "react";
import { ImmersiveChrome, LightChrome } from "./ShellChrome";

export type AppShellProps = {
  variant?: "immersive" | "light" | "bare";
  children: ReactNode;
};

export function AppShell({ variant = "light", children }: AppShellProps) {
  if (variant === "bare") return <>{children}</>;
  if (variant === "immersive") return <ImmersiveChrome>{children}</ImmersiveChrome>;
  return <LightChrome>{children}</LightChrome>;
}
