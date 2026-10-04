"use client";

// Progress: XP, an honest streak, lessons as rounded numbered cards, the NFT animal, reset.
// Everything comes from localStorage, so nothing personal is rendered until `ready`.

import Link from "next/link";
import { useState } from "react";
import { lessonNum } from "@/content/lessons";
import { useLessons } from "@/i18n/lessons";
import { useLocale, useT } from "@/i18n";
import { useProfile } from "@/lib/profile";
import type { Dict } from "@/i18n/ui/en";
import type { Lesson } from "@/content/types";
import { useProgress, type Progress } from "@/lib/progress";
import { clearVisitedPartners } from "@/components/partners/visited";
import { resetTrainingWallet } from "@/lib/training-wallet";
import { ArrowRightIcon, CheckIcon, FlameIcon, XpIcon } from "@/components/shell/icons";
import { SailboatArt, TurtleArt } from "./art";

/* ---------------------------------- helpers ---------------------------------- */

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const addDays = (d: Date, n: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

type StreakInfo = {
  current: number;
  activeToday: boolean;
  week: { key: string; letter: string; isToday: boolean; active: boolean }[];
};

/** The stored streak only counts if the last active day was today or yesterday. */
function streakInfo(p: Progress, locale: string): StreakInfo {
  const now = new Date();
  const today = dayKey(now);
  const yesterday = dayKey(addDays(now, -1));
  const alive = p.lastActiveDay === today || p.lastActiveDay === yesterday;
  const current = alive ? p.streak : 0;

  const active = new Set<string>();
  if (alive && p.lastActiveDay) {
    const [y, m, d] = p.lastActiveDay.split("-").map(Number);
    const last = new Date(y, m - 1, d);
    for (let i = 0; i < Math.min(current, 7); i++) active.add(dayKey(addDays(last, -i)));
  }

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(now, i - 6);
    const key = dayKey(d);
    return {
      key,
      letter: d.toLocaleDateString(locale, { weekday: "narrow" }),
      isToday: key === today,
      active: active.has(key),
    };
  });

  return { current, activeToday: p.lastActiveDay === today, week };
}

function lessonState(lesson: Lesson, p: Progress, t: Dict["progress"]["lessons"]) {
  const done = p.completedLessons.includes(lesson.id);
  const total = lesson.steps.length;
  const stepsDone = Math.min(p.completedSteps[lesson.id]?.length ?? 0, total);
  const pct = done ? 100 : total > 0 ? Math.round((stepsDone / total) * 100) : 0;
  const label = done
    ? t.stateDone
    : total === 0
      ? t.stateNotStarted
      : stepsDone === 0
        ? t.stateSteps(total)
        : t.stateStepsDone(stepsDone, total);
  return { done, pct, label, started: done || stepsDone > 0 };
}

const TINTS = [
  { card: "bg-light-sky/40 shadow-[inset_0_-4px_0_rgba(30,90,110,0.14)]", dot: "bg-ocean-teal", bar: "bg-ocean-teal" },
  { card: "bg-sandy-beige/40 shadow-[inset_0_-4px_0_rgba(150,120,80,0.16)]", dot: "bg-deep-ocean", bar: "bg-deep-ocean" },
  { card: "bg-seafoam/22 shadow-[inset_0_-4px_0_rgba(107,167,160,0.28)]", dot: "bg-seafoam", bar: "bg-seafoam" },
];

/* ---------------------------------- view ---------------------------------- */

export function ProgressView() {
  const { progress, ready, reset } = useProgress();
  const t = useT();
  const pt = t.progress;
  const { profile } = useProfile();
  const lessons = useLessons();
  const [locale] = useLocale();

  if (!ready) return <ProgressSkeleton />;

  const isEmpty =
    progress.xp === 0 &&
    progress.completedLessons.length === 0 &&
    Object.values(progress.completedSteps).every((s) => s.length === 0) &&
    !progress.nftClaimed;

  if (isEmpty) return <EmptyState />;

  const streak = streakInfo(progress, locale);
  const lessonsDone = lessons.filter((l) => progress.completedLessons.includes(l.id)).length;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
      <header>
        <p className="label-mono text-ocean-teal">{profile ? t.account.progressOf(profile.name) : pt.eyebrow}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-deep-ocean sm:text-5xl">
          {pt.title}
        </h1>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_1fr]">
        {/* XP */}
        <section
          aria-labelledby="xp-title"
          className="relative overflow-hidden rounded-[1.75rem] bg-ocean-teal p-6 text-white sm:p-8"
        >
          <WaveDecor />
          <h2 id="xp-title" className="label-mono relative text-light-sky">
            {pt.xp.heading}
          </h2>
          <p className="relative mt-3 flex items-end gap-3">
            <span className="text-7xl font-black leading-none tracking-tight tabular-nums sm:text-8xl">
              {progress.xp}
            </span>
            <span className="pb-2 text-2xl font-extrabold text-light-sky">{pt.xp.unit}</span>
          </p>
          <p className="relative mt-4 max-w-xs text-[1.02rem] leading-relaxed text-white/85">
            {lessonsDone === 0
              ? pt.xp.nothingYet
              : pt.xp.lessonsFinished(lessonsDone, lessons.length)}
          </p>
        </section>

        {/* Streak */}
        <section
          aria-labelledby="streak-title"
          className="rounded-[1.75rem] bg-white p-6 ring-1 ring-deep-ocean/5 sm:p-8"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-sandy-beige/35" aria-hidden>
              <FlameIcon size={28} />
            </span>
            <div>
              <h2 id="streak-title" className="text-2xl font-extrabold text-deep-ocean">
                {pt.streak.daysInRow(streak.current)}
              </h2>
              <p className="text-ink-soft">
                {streak.activeToday
                  ? pt.streak.activeToday
                  : streak.current > 0
                    ? pt.streak.keepGoing
                    : pt.streak.start}
              </p>
            </div>
          </div>

          <ol className="mt-6 grid grid-cols-7 gap-1.5" aria-label={pt.streak.weekLabel}>
            {streak.week.map((d) => (
              <li key={d.key} className="flex flex-col items-center gap-2">
                <span
                  className={`grid size-9 place-items-center rounded-full sm:size-10 ${
                    d.active
                      ? "bg-sandy-beige text-deep-ocean"
                      : "bg-foam text-transparent ring-1 ring-deep-ocean/6"
                  } ${d.isToday ? "outline-2 outline-offset-2 outline-ocean-teal" : ""}`}
                >
                  {d.active ? <CheckIcon size={16} /> : null}
                  <span className="sr-only">
                    {(d.active ? pt.streak.dayLearned : pt.streak.dayNoLesson)(d.isToday ? pt.streak.today : d.key)}
                  </span>
                </span>
                <span
                  className={`text-xs font-bold ${d.isToday ? "text-ocean-teal" : "text-ink-soft"}`}
                  aria-hidden
                >
                  {d.isToday ? pt.streak.today : d.letter}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Lessons */}
      <section aria-labelledby="lessons-title" className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 id="lessons-title" className="text-2xl font-extrabold tracking-tight text-deep-ocean">
            {pt.lessons.heading}
          </h2>
          <p className="text-sm font-bold text-ink-soft">
            {pt.lessons.doneCount(lessonsDone, lessons.length)}
          </p>
        </div>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {lessons.map((lesson, i) => {
            const s = lessonState(lesson, progress, pt.lessons);
            const tint = TINTS[i % TINTS.length];
            return (
              <li key={lesson.id}>
                <Link
                  href={`/lesson/${lesson.id}`}
                  className={`flex min-h-24 items-center gap-4 rounded-[1.5rem] px-4 py-4 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal sm:px-5 ${tint.card}`}
                >
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-full text-lg font-black text-white ${
                      s.done ? "bg-seafoam" : tint.dot
                    }`}
                    aria-hidden
                  >
                    {s.done ? <CheckIcon size={20} /> : lessonNum(lesson.number)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="label-mono block text-ink-soft">{t.common.lessonLabel(lessonNum(lesson.number))}</span>
                    <span className="block text-lg font-extrabold leading-snug text-deep-ocean">
                      {lesson.title}
                    </span>
                    <span
                      className="mt-2 block h-2 overflow-hidden rounded-full bg-white/80"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={s.pct}
                      aria-label={pt.lessons.progressLabel(lesson.title)}
                    >
                      <span
                        className={`block h-full rounded-full transition-[width] duration-500 ${s.done ? "bg-seafoam" : tint.bar}`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </span>
                  </span>
                  <span
                    className={`shrink-0 self-start pt-1 text-sm font-extrabold ${s.done ? "text-seafoam" : "text-ink-soft"}`}
                  >
                    {s.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* NFT animal */}
      <section
        aria-labelledby="nft-title"
        className="mt-10 flex flex-col items-start gap-5 rounded-[1.75rem] bg-white p-6 ring-1 ring-deep-ocean/5 sm:flex-row sm:items-center sm:p-8"
      >
        <span
          className={`grid size-24 shrink-0 place-items-center rounded-[1.5rem] ${
            progress.nftClaimed ? "bg-light-sky/50" : "bg-foam"
          }`}
        >
          <TurtleArt size={72} muted={!progress.nftClaimed} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="label-mono text-ocean-teal">{pt.nft.eyebrow}</p>
          {progress.nftClaimed ? (
            <>
              <h2 id="nft-title" className="mt-1 text-2xl font-extrabold text-deep-ocean">
                {pt.nft.claimedTitle}
              </h2>
              <p className="mt-1 text-ink-soft">
                {pt.nft.claimedBody}
              </p>
            </>
          ) : (
            <>
              <h2 id="nft-title" className="mt-1 text-2xl font-extrabold text-deep-ocean">
                {pt.nft.lockedTitle}
              </h2>
              <p className="mt-1 text-ink-soft">
                {pt.nft.lockedBody(lessonsDone, lessons.length)}
              </p>
            </>
          )}
        </div>
        {!progress.nftClaimed && (
          <Link
            href="/journey"
            className="flex min-h-12 items-center gap-2 rounded-full bg-ocean-teal px-6 font-bold text-white transition-colors hover:bg-deep-ocean focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal"
          >
            {pt.nft.continue} <ArrowRightIcon size={18} />
          </Link>
        )}
      </section>

      <ResetButton
        onReset={() => {
          reset();
          clearVisitedPartners();
          resetTrainingWallet();
        }}
      />
    </main>
  );
}

/* ---------------------------------- pieces ---------------------------------- */

function ResetButton({ onReset }: { onReset: () => void }) {
  const [asking, setAsking] = useState(false);
  const t = useT().progress.reset;
  return (
    <div className="mt-10 flex min-h-12 flex-wrap items-center justify-center gap-3 text-sm" aria-live="polite">
      {asking ? (
        <>
          <span className="font-semibold text-ink">{t.confirm}</span>
          <button
            type="button"
            onClick={onReset}
            className="min-h-11 rounded-full bg-deep-ocean px-5 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal"
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => setAsking(false)}
            className="min-h-11 rounded-full bg-white px-5 font-bold text-ink ring-1 ring-deep-ocean/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal"
            autoFocus
          >
            {t.no}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setAsking(true)}
          className="min-h-11 rounded-full px-4 font-semibold text-ink-soft underline decoration-ink-soft/40 underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-ocean-teal"
        >
          {t.button}
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  const t = useT().progress;
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
      <p className="label-mono text-ocean-teal">{t.eyebrow}</p>
      <section className="mt-4 flex flex-1 flex-col items-center justify-center rounded-[2rem] bg-white px-6 py-12 text-center ring-1 ring-deep-ocean/5 sm:py-16">
        <span className="grid size-36 place-items-center rounded-full bg-light-sky/40">
          <SailboatArt size={104} />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-deep-ocean sm:text-4xl">
          {t.empty.title}
        </h1>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-ink-soft">
          {t.empty.body}
        </p>
        <Link
          href="/"
          className="mt-8 flex min-h-12 items-center gap-2 rounded-full bg-ocean-teal px-7 text-lg font-bold text-white transition-colors hover:bg-deep-ocean focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal"
        >
          {t.empty.cta} <ArrowRightIcon size={20} />
        </Link>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-ink-soft [&>span]:whitespace-nowrap">
          <span className="inline-flex items-center gap-1">
            <XpIcon size={16} /> {t.empty.earnXp}
          </span>
          <span className="inline-flex items-center gap-1">
            <FlameIcon size={16} /> {t.empty.buildStreak}
          </span>
          <span className="inline-flex items-center gap-1">
            <TurtleArt size={18} /> {t.empty.getAnimal}
          </span>
        </p>
      </section>
    </main>
  );
}

function ProgressSkeleton() {
  const t = useT().progress;
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10" aria-busy="true">
      <p className="label-mono text-ocean-teal">{t.eyebrow}</p>
      <div className="mt-4 h-12 w-2/3 animate-pulse rounded-2xl bg-deep-ocean/5" />
      <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_1fr]">
        <div className="h-56 animate-pulse rounded-[1.75rem] bg-deep-ocean/5" />
        <div className="h-56 animate-pulse rounded-[1.75rem] bg-deep-ocean/5" />
      </div>
      <span className="sr-only">{t.loading}</span>
    </main>
  );
}

function WaveDecor() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -right-10 bottom-0 h-40 w-[28rem] text-white/[0.07]"
      viewBox="0 0 400 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
    >
      <path d="M10 40c30-24 60-24 90 0s60 24 90 0 60-24 90 0 60 24 90 0" />
      <path d="M10 85c30-24 60-24 90 0s60 24 90 0 60-24 90 0 60 24 90 0" />
      <path d="M10 130c30-24 60-24 90 0s60 24 90 0 60-24 90 0 60 24 90 0" />
    </svg>
  );
}
