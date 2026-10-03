"use client";

// The "Lessons ☰" panel, OceanX "Chapters" style: a soft white panel from the right with the
// list of lessons + links to Progress and Partners. Built on <dialog> so we get a real modal:
// focus moves inside, the page behind is inert, Escape closes, focus returns to the opener.

import Link from "next/link";
import { useEffect, useRef } from "react";
import { lessons, lessonLabel, lessonNum } from "@/content/lessons";
import { useProgress } from "@/lib/progress";
import { ArrowRightIcon, CheckIcon, CloseIcon, PartnersIcon, ProgressIcon } from "./icons";

type Props = { open: boolean; onClose: () => void };

export function LessonsDrawer({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { progress, ready } = useProgress();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    // Keep the page behind still while the panel is open.
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const doneCount = ready ? lessons.filter((l) => progress.completedLessons.includes(l.id)).length : 0;

  return (
    <dialog
      ref={ref}
      aria-labelledby="lessons-drawer-title"
      onClose={onClose}
      onClick={(e) => {
        // A click on the dialog itself (not the panel) = a click on the backdrop.
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-none bg-transparent p-2.5 text-ink outline-none
        transition-[translate,opacity] duration-300 ease-out
        starting:open:translate-x-6 starting:open:opacity-0
        backdrop:bg-deep-ocean/35 backdrop:backdrop-blur-[2px]
        sm:w-[420px] sm:p-3"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_60px_-20px_rgba(8,28,46,0.45)]">
        <div className="flex items-center justify-between gap-4 px-6 pb-2 pt-5">
          <div>
            <p className="label-mono text-ocean-teal/80">Your voyage</p>
            <h2 id="lessons-drawer-title" className="text-2xl font-extrabold tracking-tight">
              Lessons
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full bg-foam text-ink transition-colors hover:bg-light-sky/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal"
            aria-label="Close lessons"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <p className="px-6 text-sm text-ink-soft" aria-live="polite">
          {ready ? `${doneCount} of ${lessons.length} finished` : " "}
        </p>

        <nav aria-label="Lessons" className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-4">
          <ol className="flex flex-col gap-1.5">
            {lessons.map((lesson) => {
              const done = ready && progress.completedLessons.includes(lesson.id);
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/lesson/${lesson.id}`}
                    onClick={onClose}
                    className="group flex min-h-16 items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-foam focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ocean-teal"
                  >
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-full text-base font-extrabold ${
                        done ? "bg-seafoam text-white" : "bg-light-sky/45 text-ocean-teal"
                      }`}
                      aria-hidden
                    >
                      {done ? <CheckIcon size={18} /> : lessonNum(lesson.number)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="label-mono block text-ink-soft">{lessonLabel(lesson.number)}</span>
                      <span className="block truncate text-[1.02rem] font-bold leading-snug">{lesson.title}</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-ink-soft">
                      {done ? <span className="text-seafoam">Done</span> : `${lesson.minutes} min`}
                    </span>
                    {done && <span className="sr-only">(finished)</span>}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="grid grid-cols-2 gap-2 border-t border-deep-ocean/8 p-3">
          <Link
            href="/progress"
            onClick={onClose}
            className="flex min-h-12 items-center gap-2 rounded-2xl bg-foam px-4 font-bold text-ink transition-colors hover:bg-light-sky/40 focus-visible:outline-2 focus-visible:outline-ocean-teal"
          >
            <ProgressIcon size={20} className="text-ocean-teal" /> Progress
          </Link>
          <Link
            href="/partners"
            onClick={onClose}
            className="flex min-h-12 items-center gap-2 rounded-2xl bg-foam px-4 font-bold text-ink transition-colors hover:bg-light-sky/40 focus-visible:outline-2 focus-visible:outline-ocean-teal"
          >
            <PartnersIcon size={20} className="text-ocean-teal" /> Partners
          </Link>
          <Link
            href="/journey"
            onClick={onClose}
            className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-full bg-ocean-teal px-5 font-bold text-white transition-colors hover:bg-deep-ocean focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal"
          >
            Back to the route <ArrowRightIcon size={18} />
          </Link>
        </div>
      </div>
    </dialog>
  );
}
