"use client";

// "What should we call you?" — the one-field sign-up. Night-sea card with our boat, matching
// the landing page. Used by the landing CTA and by NameGate on every other page.

import { useEffect, useId, useRef, useState } from "react";
import { Boat } from "@/components/ocean/Boat";
import { useLocale, useT } from "@/i18n";
import { saveName, useProfile } from "@/lib/profile";

export function NameDialog({ onDone, onClose }: { onDone: (name: string) => void; onClose?: () => void }) {
  const all = useT();
  const t = all.account.dialog;
  const privacyLink = all.privacy.link;
  const [locale] = useLocale();
  const { profile } = useProfile();
  const [name, setName] = useState(profile?.name ?? "");
  const input = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const ok = name.trim().length > 0;

  useEffect(() => {
    input.current?.focus();
    if (!onClose) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ok) return;
    const p = saveName(name, locale);
    onDone(p.name);
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-end bg-sea-night/60 p-0 backdrop-blur-sm sm:place-items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full overflow-hidden rounded-t-[2rem] bg-[linear-gradient(180deg,#0f3350_0%,#081c2e_100%)] px-6 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-white shadow-[0_30px_80px_-24px_rgba(8,28,46,0.9),0_0_60px_-20px_rgba(126,224,240,0.5)] ring-1 ring-light-sky/15 sm:max-w-md sm:rounded-[2rem] sm:px-8 sm:pb-8"
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-light-sky"
          >
            <svg aria-hidden viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
        <span aria-hidden className="mx-auto grid size-20 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#2a7690,#0d2b45_70%)] shadow-[0_0_30px_-4px_rgba(126,224,240,0.6)] ring-2 ring-light-sky/30">
          <Boat className="w-[80%] -rotate-[28deg]" />
        </span>
        <h2 id={titleId} className="mt-5 text-center text-[1.6rem] leading-tight font-extrabold text-balance">
          {t.title}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-center text-[16px] leading-relaxed text-light-sky/85">{t.sub}</p>
        <form onSubmit={submit} className="mt-6">
          <label htmlFor={`${titleId}-n`} className="text-[15px] font-bold text-light-sky">
            {t.label}
          </label>
          <input
            id={`${titleId}-n`}
            ref={input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoComplete="given-name"
            placeholder={t.placeholder}
            className="mt-2 block min-h-14 w-full rounded-[1.25rem] bg-white/8 px-5 text-[17px] font-bold text-white ring-1 ring-light-sky/25 outline-none placeholder:font-semibold placeholder:text-light-sky/45 focus:ring-2 focus:ring-[#7ee0f0]/70"
          />
          <button
            type="submit"
            disabled={!ok}
            className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#e6f4fb_100%)] px-6 text-[17px] font-extrabold text-deep-ocean shadow-[0_0_0_4px_rgba(126,224,240,0.18),0_18px_40px_-12px_rgba(126,224,240,0.55)] transition hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#7ee0f0] disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
          >
            {t.submit} <span aria-hidden>→</span>
          </button>
          <p className="mt-3 text-center text-[13px] text-light-sky/60">
            {t.privacy}{" "}
            <a href="/privacy" target="_blank" className="font-bold underline underline-offset-2 hover:text-light-sky">
              {privacyLink}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
