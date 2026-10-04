"use client";

import Link from "next/link";
import type { Lesson } from "@/content/types";
import { lessonNum } from "@/content/lessons";
import { useT } from "@/i18n";
import { SeaScene } from "./SeaScene";
import { IconArrowLeft } from "./icons";
import m from "./motion.module.css";

/** OceanX-style "chapter" opening screen. */
export function LessonIntro({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
  const t = useT();
  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-deep-ocean text-white">
      <SeaScene variant="intro" className="-z-10" />

      <header className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6">
        <Link
          href="/journey"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-bold text-white/90 ring-1 ring-white/15 backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-light-sky"
        >
          <IconArrowLeft width={18} height={18} />
          {t.lesson.intro.backToRoute}
        </Link>
        <span className="label-mono hidden text-white/60 sm:block">{t.lesson.intro.mode}</span>
      </header>

      <div className="flex flex-1 items-end px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-10 sm:pb-16 lg:justify-end lg:px-20 lg:pb-20">
        <div className="max-w-xl">
          <p className={`label-mono flex items-center gap-2 text-white/80 ${m.fadeUp}`}>
            <span aria-hidden className="size-2 rounded-[2px] bg-sandy-beige" />
            {t.common.lessonLabel(lessonNum(lesson.number))}
          </p>
          <p
            className={`mt-4 text-base font-extrabold text-light-sky sm:text-lg ${m.fadeUp} ${m.delay1}`}
          >
            {lesson.kicker}
          </p>
          <h1
            className={`mt-2 text-[2.6rem] leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl ${m.fadeUp} ${m.delay2}`}
          >
            {lesson.title}
          </h1>
          <p className={`mt-4 max-w-md text-[17px] leading-relaxed text-white/80 sm:text-lg ${m.fadeUp} ${m.delay3}`}>
            {lesson.summary}
          </p>
          <div className={`mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 ${m.fadeUp} ${m.delay4}`}>
            <button
              type="button"
              onClick={onStart}
              className="inline-flex min-h-14 items-center gap-4 rounded-full bg-white pr-3 pl-7 text-[17px] font-extrabold text-deep-ocean shadow-[0_12px_40px_-12px_rgba(183,212,230,0.6)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_44px_-12px_rgba(183,212,230,0.8)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-light-sky active:translate-y-0"
            >
              {t.lesson.intro.start}
              <span aria-hidden className="grid size-9 place-items-center rounded-full bg-sandy-beige">
                <span className="size-2.5 rounded-full bg-deep-ocean" />
              </span>
            </button>
            <p className="label-mono text-white/70">
              {t.lesson.intro.meta(lesson.minutes, lesson.xp, lesson.steps.length)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
