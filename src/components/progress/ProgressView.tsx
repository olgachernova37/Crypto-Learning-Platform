"use client";

// Progress: XP, an honest streak, lessons as rounded numbered cards, the NFT animal, reset.
// Everything comes from localStorage, so nothing personal is rendered until `ready`.

import Link from "next/link";
import { useState } from "react";
import { lessons, lessonLabel } from "@/content/lessons";
import type { Lesson } from "@/content/types";
import { useProgress, type Progress } from "@/lib/progress";
import { clearVisitedPartners } from "@/components/partners/visited";
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
function streakInfo(p: Progress): StreakInfo {
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
      letter: d.toLocaleDateString("en", { weekday: "narrow" }),
      isToday: key === today,
      active: active.has(key),
    };
  });

  return { current, activeToday: p.lastActiveDay === today, week };
}

function lessonState(lesson: Lesson, p: Progress) {
  const done = p.completedLessons.includes(lesson.id);
  const total = lesson.steps.length;
  const stepsDone = Math.min(p.completedSteps[lesson.id]?.length ?? 0, total);
  const pct = done ? 100 : total > 0 ? Math.round((stepsDone / total) * 100) : 0;
  const label = done
    ? "Done"
    : total === 0
      ? "Not started"
      : stepsDone === 0
        ? `${total} steps`
        : `${stepsDone}/${total}`;
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

  if (!ready) return <ProgressSkeleton />;

  const isEmpty =
    progress.xp === 0 &&
    progress.completedLessons.length === 0 &&
    Object.values(progress.completedSteps).every((s) => s.length === 0) &&
    !progress.nftClaimed;

  if (isEmpty) return <EmptyState />;

  const streak = streakInfo(progress);
  const lessonsDone = lessons.filter((l) => progress.completedLessons.includes(l.id)).length;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
      <header>
        <p className="label-mono text-ocean-teal">Your progress</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-deep-ocean sm:text-5xl">
          Look how far you&apos;ve sailed
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
            Experience
          </h2>
          <p className="relative mt-3 flex items-end gap-3">
            <span className="text-7xl font-black leading-none tracking-tight tabular-nums sm:text-8xl">
              {progress.xp}
            </span>
            <span className="pb-2 text-2xl font-extrabold text-light-sky">XP</span>
          </p>
          <p className="relative mt-4 max-w-xs text-[1.02rem] leading-relaxed text-white/85">
            {lessonsDone === 0
              ? "Every step and quiz adds a little more. Keep going!"
              : `${lessonsDone} of ${lessons.length} lessons finished — lovely work.`}
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
                {streak.current} {streak.current === 1 ? "day" : "days"} in a row
              </h2>
              <p className="text-ink-soft">
                {streak.activeToday
                  ? "You learned today — see you tomorrow."
                  : streak.current > 0
                    ? "A tiny lesson today keeps it going."
                    : "Learn a little today to start a new streak."}
              </p>
            </div>
          </div>

          <ol className="mt-6 grid grid-cols-7 gap-1.5" aria-label="The last 7 days">
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
                    {d.isToday ? "Today" : d.key}: {d.active ? "learned" : "no lesson"}
                  </span>
                </span>
                <span
                  className={`text-xs font-bold ${d.isToday ? "text-ocean-teal" : "text-ink-soft"}`}
                  aria-hidden
                >
                  {d.isToday ? "Today" : d.letter}
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
            Your lessons
          </h2>
          <p className="text-sm font-bold text-ink-soft">
            {lessonsDone} / {lessons.length} done
          </p>
        </div>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {lessons.map((lesson, i) => {
            const s = lessonState(lesson, progress);
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
                    {s.done ? <CheckIcon size={20} /> : lesson.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="label-mono block text-ink-soft">{lessonLabel(lesson.number)}</span>
                    <span className="block text-lg font-extrabold leading-snug text-deep-ocean">
                      {lesson.title}
                    </span>
                    <span
                      className="mt-2 block h-2 overflow-hidden rounded-full bg-white/80"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={s.pct}
                      aria-label={`${lesson.title} progress`}
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
          <p className="label-mono text-ocean-teal">Your NFT animal</p>
          {progress.nftClaimed ? (
            <>
              <h2 id="nft-title" className="mt-1 text-2xl font-extrabold text-deep-ocean">
                Your animal is in your wallet
              </h2>
              <p className="mt-1 text-ink-soft">
                It&apos;s yours, on Solana devnet — proof that you learned something new.
              </p>
            </>
          ) : (
            <>
              <h2 id="nft-title" className="mt-1 text-2xl font-extrabold text-deep-ocean">
                Finish the lessons to earn your animal
              </h2>
              <p className="mt-1 text-ink-soft">
                A little sea friend waits at the end of the route. {lessonsDone} of {lessons.length}{" "}
                lessons done.
              </p>
            </>
          )}
        </div>
        {!progress.nftClaimed && (
          <Link
            href="/journey"
            className="flex min-h-12 items-center gap-2 rounded-full bg-ocean-teal px-6 font-bold text-white transition-colors hover:bg-deep-ocean focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal"
          >
            Continue the journey <ArrowRightIcon size={18} />
          </Link>
        )}
      </section>

      <ResetButton
        onReset={() => {
          reset();
          clearVisitedPartners();
        }}
      />
    </main>
  );
}

/* ---------------------------------- pieces ---------------------------------- */

function ResetButton({ onReset }: { onReset: () => void }) {
  const [asking, setAsking] = useState(false);
  return (
    <div className="mt-10 flex min-h-12 flex-wrap items-center justify-center gap-3 text-sm" aria-live="polite">
      {asking ? (
        <>
          <span className="font-semibold text-ink">Erase all XP, your streak and lessons?</span>
          <button
            type="button"
            onClick={onReset}
            className="min-h-11 rounded-full bg-deep-ocean px-5 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal"
          >
            Yes, start over
          </button>
          <button
            type="button"
            onClick={() => setAsking(false)}
            className="min-h-11 rounded-full bg-white px-5 font-bold text-ink ring-1 ring-deep-ocean/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal"
            autoFocus
          >
            Keep my progress
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setAsking(true)}
          className="min-h-11 rounded-full px-4 font-semibold text-ink-soft underline decoration-ink-soft/40 underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-ocean-teal"
        >
          Reset progress
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
      <p className="label-mono text-ocean-teal">Your progress</p>
      <section className="mt-4 flex flex-1 flex-col items-center justify-center rounded-[2rem] bg-white px-6 py-12 text-center ring-1 ring-deep-ocean/5 sm:py-16">
        <span className="grid size-36 place-items-center rounded-full bg-light-sky/40">
          <SailboatArt size={104} />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-deep-ocean sm:text-4xl">
          Your voyage starts here
        </h1>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-ink-soft">
          Nothing here yet — and that&apos;s perfect. The first lesson takes about five minutes, and
          everything you learn will show up on this page.
        </p>
        <Link
          href="/"
          className="mt-8 flex min-h-12 items-center gap-2 rounded-full bg-ocean-teal px-7 text-lg font-bold text-white transition-colors hover:bg-deep-ocean focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal"
        >
          Start your journey <ArrowRightIcon size={20} />
        </Link>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-ink-soft [&>span]:whitespace-nowrap">
          <span className="inline-flex items-center gap-1">
            <XpIcon size={16} /> Earn XP
          </span>
          <span className="inline-flex items-center gap-1">
            <FlameIcon size={16} /> Build a streak
          </span>
          <span className="inline-flex items-center gap-1">
            <TurtleArt size={18} /> Get an animal
          </span>
        </p>
      </section>
    </main>
  );
}

function ProgressSkeleton() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10" aria-busy="true">
      <p className="label-mono text-ocean-teal">Your progress</p>
      <div className="mt-4 h-12 w-2/3 animate-pulse rounded-2xl bg-deep-ocean/5" />
      <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_1fr]">
        <div className="h-56 animate-pulse rounded-[1.75rem] bg-deep-ocean/5" />
        <div className="h-56 animate-pulse rounded-[1.75rem] bg-deep-ocean/5" />
      </div>
      <span className="sr-only">Loading your progress…</span>
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
