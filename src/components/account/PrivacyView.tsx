"use client";

// /privacy: what we store, in plain words, plus "Delete my data".
import { useState } from "react";
import { useT } from "@/i18n";
import { deleteMyData } from "@/lib/profile";

const GITHUB_ISSUES = "https://github.com/olgachernova37/Crypto-Learning-Platform/issues";

export function PrivacyView() {
  const t = useT().privacy;
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-12 sm:px-6 sm:pt-10">
      <header>
        <p className="label-mono text-ocean-teal">{t.eyebrow}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-balance text-deep-ocean sm:text-5xl">{t.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t.intro}</p>
      </header>

      <div className="mt-8 grid gap-3">
        {t.sections.map((s) => (
          <section key={s.title} className="rounded-[1.5rem] bg-white p-5 ring-1 ring-deep-ocean/8 sm:p-6">
            <h2 className="text-xl font-extrabold text-deep-ocean">{s.title}</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{s.body}</p>
          </section>
        ))}
        <section className="rounded-[1.5rem] bg-light-sky/35 p-5 sm:p-6">
          <h2 className="text-xl font-extrabold text-deep-ocean">{t.contactTitle}</h2>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{t.contactBody}</p>
          <a
            href={GITHUB_ISSUES}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center font-bold text-ocean-teal underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ocean-teal"
          >
            {t.contactLink}
          </a>
        </section>
      </div>

      <DeleteData />
      <p className="mt-8 text-center text-sm text-ink-soft">{t.updated}</p>
    </main>
  );
}

function DeleteData() {
  const t = useT().privacy.delete;
  const [state, setState] = useState<"idle" | "asking" | "busy" | "done" | "failed">("idle");
  const run = async () => {
    setState("busy");
    setState((await deleteMyData()) ? "done" : "failed");
  };
  const btn =
    "min-h-11 rounded-full px-5 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal";
  return (
    <section aria-labelledby="delete-title" className="mt-6 rounded-[1.5rem] bg-deep-ocean p-5 text-white sm:p-6">
      <h2 id="delete-title" className="text-xl font-extrabold">
        {t.title}
      </h2>
      <p className="mt-2 text-[16px] leading-relaxed text-white/80">{t.body}</p>
      <div className="mt-4 flex min-h-11 flex-wrap items-center gap-3" aria-live="polite">
        {state === "idle" && (
          <button type="button" onClick={() => setState("asking")} className={`${btn} bg-white text-deep-ocean`}>
            {t.button}
          </button>
        )}
        {state === "asking" && (
          <>
            <span className="font-semibold">{t.confirm}</span>
            <button type="button" onClick={run} className={`${btn} bg-[#F3B6A8] text-deep-ocean`}>
              {t.yes}
            </button>
            <button type="button" onClick={() => setState("idle")} className={`${btn} bg-white/10 ring-1 ring-white/25`} autoFocus>
              {t.no}
            </button>
          </>
        )}
        {state === "busy" && <span className="font-semibold">{t.busy}</span>}
        {(state === "done" || state === "failed") && (
          <>
            <span className="font-semibold">{state === "done" ? t.done : t.failed}</span>
            {/* a full page load on purpose, so nothing from before stays in memory */}
            {/* eslint-disable-next-line @next/next/no-location-assign-relative-destination */}
            <button type="button" onClick={() => window.location.assign("/")} className={`${btn} bg-white text-deep-ocean`}>
              Crypto Voyage →
            </button>
          </>
        )}
      </div>
    </section>
  );
}
