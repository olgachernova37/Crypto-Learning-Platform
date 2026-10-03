import type { Lesson } from "./types";

// Lesson list = the stops on the boat route. Steps are filled in src/content/lessons/*.ts.
import { lesson0 } from "./lessons/lesson-0";
import { lesson1 } from "./lessons/lesson-1";
import { lesson2 } from "./lessons/lesson-2";
import { lesson3 } from "./lessons/lesson-3";
import { lessonNft } from "./lessons/lesson-nft";

export const lessons: Lesson[] = [lesson0, lesson1, lesson2, lesson3, lessonNft];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function nextLesson(id: string): Lesson | undefined {
  const i = lessons.findIndex((l) => l.id === id);
  return i >= 0 ? lessons[i + 1] : undefined;
}

/** Lessons are numbered from 0 in data, but shown to people starting at 01. */
export const lessonNum = (n: number) => String(n + 1).padStart(2, "0");
export const lessonLabel = (n: number) => `Lesson ${lessonNum(n)}`;
