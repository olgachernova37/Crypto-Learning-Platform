"use client";

// Client chrome for AppShell: the immersive overlay bar and the light top bar + bottom nav.
// Both own the lessons drawer state; the page content is passed through as children.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useT } from "@/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LessonsDrawer } from "./LessonsDrawer";
import { StatChips } from "./StatChips";
import { BoatIcon, BookIcon, MenuIcon, PartnersIcon, ProgressIcon, WaveLogo } from "./icons";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal";

function Logo({ tone }: { tone: "light" | "dark" }) {
  // Light bar on md–lg: the desktop nav + switcher + chips need the room, so only the wave mark shows.
  const wordmark = tone === "light" ? "max-[479px]:hidden md:max-lg:hidden" : "max-[479px]:hidden";
  const t = useT();
  return (
    <Link
      href="/"
      className={`flex min-h-11 min-w-11 items-center gap-2 rounded-full pr-2 ${focusRing} ${
        tone === "dark" ? "text-white focus-visible:outline-white" : "text-deep-ocean"
      }`}
      aria-label={t.shell.homeAria}
    >
      <WaveLogo
        size={28}
        className={tone === "dark" ? "text-light-sky" : "text-ocean-teal"}
        data-shell-logo=""
      />
      {/* Phones under 480px: only the wave mark, so logo + switcher + controls fit at 360px. */}
      <span className={`text-[1.05rem] font-extrabold tracking-tight ${wordmark}`}>{t.common.appName}</span>
    </Link>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Immersive: thin transparent bar over the scene (OceanX style).                             */
/* ------------------------------------------------------------------------------------------ */

export function ImmersiveChrome({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const t = useT();

  return (
    <div className="relative min-h-dvh bg-sea-night text-white">
      {children}

      {/* The bar itself ignores the pointer so the sea stays draggable; only its controls react. */}
      {/* data-shell-header: the home intro hides this bar during its preloader, then reveals it. */}
      <header data-shell-header="" className="pointer-events-none fixed inset-x-0 top-0 z-40">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-sea-night/55 to-transparent"
        />
        <div className="relative flex items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
          <div className="pointer-events-auto">
            <Logo tone="dark" />
          </div>
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <StatChips tone="dark" />
            </div>
            <LanguageSwitcher tone="dark" />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              className="flex h-11 items-center gap-3 rounded-full bg-white pl-5 pr-1.5 text-deep-ocean shadow-[0_6px_24px_-8px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="label-mono font-semibold">{t.shell.lessonsButton}</span>
              <span className="grid size-8 place-items-center rounded-full bg-deep-ocean text-white">
                <MenuIcon size={16} />
              </span>
            </button>
          </div>
        </div>
        <div
          aria-hidden
          className="relative mx-4 mt-3 border-t border-dashed border-white/15 sm:mx-6"
        />
      </header>

      <LessonsDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Light: top bar (links on desktop) + rounded bottom nav on mobile.                          */
/* ------------------------------------------------------------------------------------------ */

type NavItem = {
  key: "journey" | "lessons" | "progress" | "partners";
  href?: string;
  Icon: (p: { size?: number; className?: string }) => ReactNode;
};

const NAV: NavItem[] = [
  { key: "journey", href: "/journey", Icon: BoatIcon },
  { key: "lessons", Icon: BookIcon }, // opens the drawer
  { key: "progress", href: "/progress", Icon: ProgressIcon },
  { key: "partners", href: "/partners", Icon: PartnersIcon },
];

function activeKey(pathname: string): NavItem["key"] | null {
  if (pathname === "/journey" || pathname === "/") return "journey";
  if (pathname.startsWith("/lesson")) return "lessons";
  if (pathname.startsWith("/progress")) return "progress";
  if (pathname.startsWith("/partners")) return "partners";
  return null;
}

export function LightChrome({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = activeKey(pathname);
  const t = useT();

  return (
    <div className="flex min-h-dvh flex-col bg-foam text-ink">
      <header className="sticky top-0 z-30 bg-foam/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo tone="light" />

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher tone="light" />

            <nav aria-label={t.shell.mainNav} className="hidden md:block">
              <ul className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-deep-ocean/6">
                {NAV.map(({ key, href }) => {
                  const label = t.shell.nav[key];
                  const isActive = key === "lessons" ? open : !open && current === key;
                  const cls = `flex h-10 items-center rounded-full px-4 text-[0.95rem] font-bold transition-colors ${focusRing} ${
                    isActive ? "bg-ocean-teal text-white" : "text-ink-soft hover:bg-foam hover:text-ink"
                  }`;
                  return (
                    <li key={key}>
                      {href ? (
                        <Link href={href} className={cls} aria-current={current === key ? "page" : undefined}>
                          {label}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className={cls}
                          onClick={() => setOpen(true)}
                          aria-haspopup="dialog"
                          aria-expanded={open}
                        >
                          {label}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <StatChips tone="light" />
          </div>
        </div>
      </header>

      {/* Space for the floating bottom nav on mobile. */}
      <div className="flex flex-1 flex-col pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</div>

      <nav
        aria-label={t.shell.mainNav}
        className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4 rounded-[1.75rem] bg-white p-1.5 shadow-[0_10px_40px_-12px_rgba(13,43,69,0.28)] ring-1 ring-deep-ocean/6">
          {NAV.map(({ key, href, Icon }) => {
            const label = t.shell.nav[key];
            const isActive = key === "lessons" ? open || current === key : !open && current === key;
            const cls = `flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-[1.35rem] text-[0.72rem] font-bold transition-colors ${focusRing} ${
              isActive ? "bg-light-sky/35 text-ocean-teal" : "text-ink-soft hover:text-ink"
            }`;
            const inner = (
              <>
                <Icon size={23} />
                {label}
              </>
            );
            return (
              <li key={key}>
                {href ? (
                  <Link href={href} className={cls} aria-current={current === key ? "page" : undefined}>
                    {inner}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={cls}
                    onClick={() => setOpen(true)}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <LessonsDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
