"use client";

import Link from "next/link";
import { ASK_AI_OPEN_EVENT } from "./AskAi";
import { IconClose, IconSparkle } from "./icons";
import m from "./motion.module.css";

/** Minimal full-screen lesson header: close, thin progress bar, step count. */
export function LessonHeader({ value, step, total, label }: { value: number; step: number; total: number; label: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <header className="sticky top-0 z-30 bg-foam/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-3 sm:h-20 sm:gap-5 sm:px-6">
        <Link
          href="/journey"
          aria-label="Close the lesson and go back to the route"
          className="grid size-11 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-light-sky/40 hover:text-ink focus-visible:outline-3 focus-visible:outline-ocean-teal/50"
        >
          <IconClose width={22} height={22} />
        </Link>
        <div
          role="progressbar"
          aria-label={`${label} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-valuetext={`Step ${step} of ${total}`}
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-light-sky/45"
        >
          <div
            className={`h-full rounded-full bg-gradient-to-r from-seafoam to-ocean-teal ${m.progress}`}
            style={{ width: `${Math.max(pct, 4)}%` }}
          />
        </div>
        <span className="label-mono w-9 shrink-0 text-right text-ink-soft sm:w-12">
          {step}/{total}
        </span>
        {/* phones: Ask AI sits up here instead of floating over the lesson */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(ASK_AI_OPEN_EVENT))}
          aria-haspopup="dialog"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-deep-ocean py-1.5 pr-3.5 pl-1.5 text-[14px] font-extrabold text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/60 sm:hidden"
        >
          <span aria-hidden className="grid size-7 place-items-center rounded-full bg-light-sky text-deep-ocean">
            <IconSparkle width={14} height={14} />
          </span>
          Ask AI
        </button>
      </div>
    </header>
  );
}
