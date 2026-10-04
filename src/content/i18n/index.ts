// Lesson translations. Each language file holds ONLY the text of the lessons, keyed by lesson id
// and step id (quiz options by option id). Structure, ids and correct answers always come from
// the English source in src/content/lessons/*.ts, so translations can never break a quiz.
// Regenerate the English template with: npx tsx scripts/i18n-lessons.mts

import { lessons } from "../lessons";
import type { BossRound, Lesson, LessonStep, Quiz } from "../types";
import type { Locale } from "@/i18n/locales";
import uk from "./uk.json";
import cs from "./cs.json";
import ru from "./ru.json";

export type QuizText = {
  question: string;
  explanation: string;
  options?: Record<string, string>; // single / multiple: option id -> text
  answers?: string[]; // fill: accepted answers in this language
  pairs?: { left: string; right: string }[]; // match: same order as English
};
export type StepText = {
  title: string;
  body: string[];
  example?: string;
  action?: { label: string; note?: string };
  quiz?: QuizText;
  /** boss battle rounds, same order as English */
  boss?: { rounds: (QuizText & { hint?: string })[] };
};
export type LessonText = { kicker: string; title: string; summary: string; outro?: string; steps: Record<string, StepText> };
export type LessonsText = Record<string, LessonText>;

const TEXT: Partial<Record<Locale, LessonsText>> = {
  uk: uk as LessonsText,
  cs: cs as LessonsText,
  ru: ru as LessonsText,
};

function quizText(q: Quiz): QuizText {
  const qt: QuizText = { question: q.question, explanation: q.explanation };
  if (q.kind === "single" || q.kind === "multiple") qt.options = Object.fromEntries(q.options.map((o) => [o.id, o.text]));
  if (q.kind === "fill") qt.answers = q.answers;
  if (q.kind === "match") qt.pairs = q.pairs;
  return qt;
}

/** English text of every lesson, in the translation-file shape (the template for translators). */
export function lessonsText(list: Lesson[] = lessons): LessonsText {
  const out: LessonsText = {};
  for (const l of list) {
    const steps: Record<string, StepText> = {};
    for (const s of l.steps) {
      const st: StepText = { title: s.title, body: s.body };
      if (s.example) st.example = s.example;
      if (s.action) st.action = { label: s.action.label, ...(s.action.note ? { note: s.action.note } : {}) };
      if (s.quiz) st.quiz = quizText(s.quiz);
      if (s.boss) st.boss = { rounds: s.boss.rounds.map((r) => ({ ...quizText(r), ...(r.hint ? { hint: r.hint } : {}) })) };
      steps[s.id] = st;
    }
    out[l.id] = { kicker: l.kicker, title: l.title, summary: l.summary, ...(l.outro ? { outro: l.outro } : {}), steps };
  }
  return out;
}

function localizeQuiz(q: Quiz, t: QuizText | undefined): Quiz {
  if (!t) return q;
  const base = { question: t.question || q.question, explanation: t.explanation || q.explanation };
  switch (q.kind) {
    case "single":
    case "multiple":
      return { ...q, ...base, options: q.options.map((o) => ({ ...o, text: t.options?.[o.id] || o.text })) } as Quiz;
    case "fill":
      // accept the translated answers AND the English ones
      return { ...q, ...base, answers: [...(t.answers ?? []), ...q.answers] };
    case "match":
      return {
        ...q,
        ...base,
        pairs: q.pairs.map((p, i) => ({ left: t.pairs?.[i]?.left || p.left, right: t.pairs?.[i]?.right || p.right })),
      };
    default:
      return { ...(q as Quiz), ...base };
  }
}

function localizeStep(s: LessonStep, t: StepText | undefined): LessonStep {
  if (!t) return s;
  return {
    ...s,
    title: t.title || s.title,
    body: t.body?.length ? t.body : s.body,
    example: s.example ? t.example || s.example : undefined,
    action: s.action ? { ...s.action, label: t.action?.label || s.action.label, note: s.action.note ? t.action?.note || s.action.note : undefined } : undefined,
    quiz: s.quiz ? localizeQuiz(s.quiz, t.quiz) : undefined,
    boss: s.boss
      ? {
          ...s.boss,
          rounds: s.boss.rounds.map((r, i) => {
            const rt = t.boss?.rounds?.[i];
            return { ...localizeQuiz(r, rt), hint: r.hint ? rt?.hint || r.hint : undefined } as BossRound;
          }),
        }
      : undefined,
  };
}

const cache = new Map<string, Lesson>();
export function localizeLesson(lesson: Lesson, locale: Locale): Lesson {
  if (locale === "en") return lesson;
  const t = TEXT[locale]?.[lesson.id];
  if (!t) return lesson;
  const key = `${locale}:${lesson.id}`;
  let out = cache.get(key);
  if (!out) {
    out = {
      ...lesson,
      kicker: t.kicker || lesson.kicker,
      title: t.title || lesson.title,
      summary: t.summary || lesson.summary,
      outro: lesson.outro ? t.outro || lesson.outro : undefined,
      steps: lesson.steps.map((s) => localizeStep(s, t.steps?.[s.id])),
    };
    cache.set(key, out);
  }
  return out;
}

export const localizedLessons = (locale: Locale) => lessons.map((l) => localizeLesson(l, locale));
