"use client";

import { useMemo } from "react";
import { localizeLesson, localizedLessons } from "@/content/i18n";
import type { Lesson } from "@/content/types";
import { useLocale } from "./store";

/** All lessons in the learner's language. */
export function useLessons(): Lesson[] {
  const [locale] = useLocale();
  return useMemo(() => localizedLessons(locale), [locale]);
}

/** One lesson (passed in from the server in English) in the learner's language. */
export function useLocalizedLesson(lesson: Lesson): Lesson {
  const [locale] = useLocale();
  return useMemo(() => localizeLesson(lesson, locale), [lesson, locale]);
}
