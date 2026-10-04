"use client";

import type { LessonStep } from "@/content/types";
import { IconBulb, IconExternal, IconHand } from "./icons";
import { useT } from "@/i18n";
import m from "./motion.module.css";

/** The reading part of a step: short paragraphs, a real-life example, an optional "go do it" card. */
export function StepContent({ step }: { step: LessonStep }) {
  const t = useT();
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex flex-col gap-4 ${m.fadeUp} ${m.delay1}`}>
        {step.body.map((p, i) => (
          <p key={i} className="text-[17px] leading-[1.7] text-ink/85 sm:text-[1.15rem]">
            {p}
          </p>
        ))}
      </div>

      {step.example && (
        <aside
          aria-label={t.lesson.step.example}
          className={`relative overflow-hidden rounded-[1.5rem] bg-sandy-beige/35 p-5 sm:p-6 ${m.fadeUp} ${m.delay2}`}
        >
          <span aria-hidden className="absolute -top-8 -right-8 size-28 rounded-full bg-sandy-beige/40" />
          <p className="relative flex items-center gap-2 text-[15px] font-extrabold text-deep-ocean/80">
            <span className="grid size-8 place-items-center rounded-full bg-white/80 text-ocean-teal">
              <IconBulb width={17} height={17} />
            </span>
            {t.lesson.step.example}
          </p>
          <p className="relative mt-3 text-[17px] leading-[1.65] text-deep-ocean sm:text-lg">{step.example}</p>
        </aside>
      )}

      {step.action && (
        <aside
          aria-label={t.lesson.step.tryIt}
          className={`rounded-[1.5rem] bg-white p-5 shadow-[0_10px_40px_-24px_rgba(13,43,69,0.45)] ring-1 ring-ink/8 sm:p-6 ${m.fadeUp} ${m.delay3}`}
        >
          <div className="flex items-start gap-4">
            <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-2xl bg-light-sky/50 text-ocean-teal">
              <IconHand width={22} height={22} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="label-mono text-seafoam">{t.lesson.step.tryIt}</p>
              <p className="mt-1 text-lg font-extrabold text-ink">{step.action.label}</p>
              {step.action.note && <p className="mt-1.5 text-[16px] leading-relaxed text-ink-soft">{step.action.note}</p>}
            </div>
          </div>
          {step.action.href && (
            <a
              href={step.action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-deep-ocean px-6 text-[16px] font-extrabold text-white transition hover:bg-ocean-teal focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50 sm:w-auto"
            >
              {t.lesson.step.openSite(new URL(step.action.href).hostname.replace(/^www\./, ""))}
              <IconExternal width={17} height={17} />
              <span className="sr-only">{t.lesson.step.newTab}</span>
            </a>
          )}
        </aside>
      )}
    </div>
  );
}
