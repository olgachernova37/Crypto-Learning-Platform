"use client";

// Compact language picker for the top bar: a pill ("UA ▾") that opens a small rounded menu.
// tone="dark" sits on the night-sea screens, tone="light" on the white pages.

import { useEffect, useId, useRef, useState } from "react";
import { LOCALES, LOCALE_NAMES, LOCALE_SHORT, useLocale, useT } from "@/i18n";

export function LanguageSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [locale, setLocale] = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dark = tone === "dark";
  return (
    <div ref={box} className="pointer-events-auto relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t.common.language}: ${LOCALE_NAMES[locale]}`}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-extrabold transition focus-visible:outline-3 focus-visible:outline-offset-2 ${
          dark
            ? "bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md hover:bg-white/20 focus-visible:outline-light-sky"
            : "bg-white text-deep-ocean ring-1 ring-ink/10 hover:bg-light-sky/30 focus-visible:outline-ocean-teal/50"
        }`}
      >
        <svg aria-hidden viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
        {LOCALE_SHORT[locale]}
      </button>
      {open && (
        <ul
          id={menuId}
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-[1.25rem] bg-white p-1.5 text-deep-ocean shadow-[0_24px_60px_-20px_rgba(8,28,46,0.6)] ring-1 ring-ink/10"
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                lang={l}
                aria-current={l === locale ? "true" : undefined}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-[0.9rem] px-3.5 text-left text-[15px] font-bold transition hover:bg-light-sky/35 focus-visible:outline-3 focus-visible:outline-ocean-teal/50 ${
                  l === locale ? "bg-light-sky/40" : ""
                }`}
              >
                {LOCALE_NAMES[l]}
                <span className="text-xs font-extrabold text-ink-soft">{LOCALE_SHORT[l]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
