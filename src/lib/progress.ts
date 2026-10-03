"use client";

// Learner progress, kept in localStorage for the MVP (no accounts yet).
// XP + streak + finished lessons + finished steps. No hearts, no leaderboard.

import { useCallback, useEffect, useState } from "react";

export type Progress = {
  xp: number;
  streak: number; // days in a row
  lastActiveDay: string | null; // "YYYY-MM-DD" local
  completedLessons: string[]; // lesson ids
  completedSteps: Record<string, string[]>; // lessonId -> step ids
  nftClaimed: boolean;
};

const KEY = "crypto-voyage-progress-v1";
const EVENT = "crypto-voyage-progress";

export const emptyProgress: Progress = {
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  completedLessons: [],
  completedSteps: {},
  nftClaimed: false,
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const dayDiff = (a: string, b: string) =>
  Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

export function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...emptyProgress, ...JSON.parse(raw) } : emptyProgress;
  } catch {
    return emptyProgress;
  }
}

function write(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode etc. — progress just won't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Count today as an active day and update the streak. */
function touch(p: Progress): Progress {
  const t = today();
  if (p.lastActiveDay === t) return p;
  const streak = p.lastActiveDay && dayDiff(p.lastActiveDay, t) === 1 ? p.streak + 1 : 1;
  return { ...p, streak, lastActiveDay: t };
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setProgress(readProgress());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    write(fn(touch(readProgress())));
  }, []);

  const addXp = useCallback((n: number) => update((p) => ({ ...p, xp: p.xp + n })), [update]);

  const completeStep = useCallback(
    (lessonId: string, stepId: string, xp = 10) =>
      update((p) => {
        const done = p.completedSteps[lessonId] ?? [];
        if (done.includes(stepId)) return p;
        return {
          ...p,
          xp: p.xp + xp,
          completedSteps: { ...p.completedSteps, [lessonId]: [...done, stepId] },
        };
      }),
    [update],
  );

  const completeLesson = useCallback(
    (lessonId: string, xp: number) =>
      update((p) =>
        p.completedLessons.includes(lessonId)
          ? p
          : { ...p, xp: p.xp + xp, completedLessons: [...p.completedLessons, lessonId] },
      ),
    [update],
  );

  const claimNft = useCallback(() => update((p) => ({ ...p, nftClaimed: true })), [update]);

  const reset = useCallback(() => write(emptyProgress), []);

  return { progress, ready, addXp, completeStep, completeLesson, claimNft, reset };
}
