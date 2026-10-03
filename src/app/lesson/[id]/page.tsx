import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import type { NextStop } from "@/components/lesson/LessonComplete";
import { getLesson, lessonLabel, lessons, nextLesson } from "@/content/lessons";
import type { Lesson } from "@/content/types";

export function generateStaticParams() {
  return lessons.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const lesson = getLesson(id);
  return lesson
    ? { title: `${lessonLabel(lesson.number)}: ${lesson.title} · Crypto Voyage`, description: lesson.summary }
    : {};
}

const LAST_REGULAR_LESSON = 3;

/** Where the "next" button on the lesson-complete screen goes. */
function nextStop(lesson: Lesson): NextStop {
  if (lesson.number === LAST_REGULAR_LESSON) return { href: "/finale", label: "On to the finale" };
  if (lesson.number > LAST_REGULAR_LESSON) return null; // the NFT mini-lesson: back to the route
  const n = nextLesson(lesson.id);
  return n ? { href: `/lesson/${n.id}`, label: "Next lesson", title: n.title } : null;
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();
  return (
    <AppShell variant="bare">
      <LessonPlayer key={lesson.id} lesson={lesson} next={nextStop(lesson)} />
    </AppShell>
  );
}
