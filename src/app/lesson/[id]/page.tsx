import { notFound } from "next/navigation";
import { getLesson, lessons } from "@/content/lessons";

export function generateStaticParams() {
  return lessons.map((l) => ({ id: l.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();
  return <main className="p-8">Lesson page for {lesson.title} (agent B)</main>;
}
