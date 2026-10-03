"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Lesson } from "@/content/types";
import { lessonLabel } from "@/content/lessons";
import { Confetti } from "./Confetti";
import { IconArrowRight, IconSparkle, IconStar, IconWave } from "./icons";
import m from "./motion.module.css";

export type NextStop = { href: string; label: string; title?: string } | null;

export function LessonComplete({
  lesson,
  earned,
  streak,
  totalXp,
  next,
}: {
  lesson: Lesson;
  earned: number;
  streak: number;
  totalXp: number;
  next: NextStop;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus({ preventScroll: true }), []);

  return (
    <main className="relative isolate flex min-h-dvh flex-col items-center overflow-hidden bg-foam px-5 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] text-center sm:justify-center sm:py-16">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[55%] bg-gradient-to-b from-light-sky/70 via-light-sky/25 to-transparent" />
      <Confetti />

      <div className={`relative mt-4 ${m.pop}`}>
        <Badge />
      </div>

      <p className={`label-mono mt-8 text-ocean-teal ${m.fadeUp} ${m.delay1}`}>{lessonLabel(lesson.number)} · complete</p>
      <h1
        ref={heading}
        tabIndex={-1}
        className={`mt-3 text-[2.4rem] leading-tight font-extrabold tracking-tight text-ink outline-none sm:text-5xl ${m.fadeUp} ${m.delay1}`}
      >
        Beautifully done!
      </h1>
      <p className={`mt-3 max-w-md text-[17px] leading-relaxed text-ink-soft sm:text-lg ${m.fadeUp} ${m.delay2}`}>
        You finished <strong className="font-extrabold text-ink">{lesson.title}</strong>. One more stop on your
        route, sailed.
      </p>

      <dl className={`mt-8 grid w-full max-w-md grid-cols-3 gap-3 ${m.fadeUp} ${m.delay3}`}>
        <Stat label="XP earned" value={`+${earned}`} icon={<IconSparkle width={18} height={18} />} tone="bg-seafoam/20 text-[#2f6b64]" />
        <Stat
          label="Day streak"
          value={String(Math.max(1, streak))}
          icon={<IconWave width={18} height={18} />}
          tone="bg-light-sky/50 text-ocean-teal"
        />
        <Stat label="Total XP" value={String(totalXp)} icon={<IconStar width={18} height={18} />} tone="bg-sandy-beige/45 text-deep-ocean" />
      </dl>

      <div className={`mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row-reverse ${m.fadeUp} ${m.delay4}`}>
        {next && (
          <Link
            href={next.href}
            className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-ocean-teal px-6 text-[17px] font-extrabold text-white shadow-[0_14px_30px_-14px_rgba(30,90,110,0.9)] transition hover:-translate-y-0.5 hover:bg-deep-ocean focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50"
          >
            {next.label}
            <IconArrowRight width={20} height={20} />
          </Link>
        )}
        <Link
          href="/journey"
          className={`inline-flex min-h-14 flex-1 items-center justify-center rounded-full px-6 text-[17px] font-extrabold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50 ${
            next
              ? "bg-white text-ocean-teal ring-1 ring-ocean-teal/25 hover:bg-light-sky/30"
              : "bg-ocean-teal text-white shadow-[0_14px_30px_-14px_rgba(30,90,110,0.9)] hover:bg-deep-ocean"
          }`}
        >
          Back to the route
        </Link>
      </div>
      {next?.title && <p className="mt-4 text-sm text-ink-soft">Up next: {next.title}</p>}
    </main>
  );
}

function Stat({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-[1.5rem] bg-white px-2 py-4 shadow-[0_10px_30px_-22px_rgba(13,43,69,0.5)] ring-1 ring-ink/6">
      <span aria-hidden className={`grid size-9 place-items-center rounded-full ${tone}`}>
        {icon}
      </span>
      <dt className="order-last text-xs font-bold text-ink-soft">{label}</dt>
      <dd className="text-2xl font-extrabold text-ink">{value}</dd>
    </div>
  );
}

/** Round badge with a little starfish and sparkles. */
function Badge() {
  return (
    <svg width="168" height="168" viewBox="0 0 168 168" aria-hidden className={m.float}>
      <circle cx="84" cy="84" r="80" fill="#b7d4e6" opacity="0.45" />
      <circle cx="84" cy="84" r="64" fill="#0d2b45" />
      <circle cx="84" cy="84" r="64" fill="none" stroke="#dcc8aa" strokeWidth="5" strokeDasharray="2 10" strokeLinecap="round" />
      <circle cx="84" cy="84" r="50" fill="#1e5a6e" />
      <path
        d="M84 52c4 10 7 18 9 24 7 1 15 1 25 3-8 6-15 10-19 14 2 7 4 15 5 25-8-5-15-10-20-13-5 3-12 8-20 13 1-10 3-18 5-25-4-4-11-8-19-14 10-2 18-2 25-3 2-6 5-14 9-24z"
        fill="#dcc8aa"
        stroke="#f6fafc"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="78" cy="84" r="2.6" fill="#0d2b45" />
      <circle cx="90" cy="84" r="2.6" fill="#0d2b45" />
      <path d="M80 92q4 4 8 0" stroke="#0d2b45" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <g fill="#6ba7a0" className={m.twinkle}>
        <path d="M22 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
        <path d="M146 120l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      </g>
      <g fill="#dcc8aa" className={m.twinkle} style={{ animationDelay: "1.2s" }}>
        <path d="M144 26l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" />
        <path d="M26 132l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      </g>
    </svg>
  );
}
