import type { Quiz } from "@/content/types";

/** What the learner has picked so far, per quiz kind. */
export type QuizAnswer =
  | { kind: "single"; value: string | null }
  | { kind: "multiple"; value: string[] }
  | { kind: "fill"; value: string }
  | { kind: "truefalse"; value: boolean | null }
  | { kind: "match"; value: Record<number, number> }; // left index -> pair index chosen on the right

export function emptyAnswer(quiz: Quiz): QuizAnswer {
  switch (quiz.kind) {
    case "single":
      return { kind: "single", value: null };
    case "multiple":
      return { kind: "multiple", value: [] };
    case "fill":
      return { kind: "fill", value: "" };
    case "truefalse":
      return { kind: "truefalse", value: null };
    case "match":
      return { kind: "match", value: {} };
  }
}

/** Is there enough of an answer to press "Check"? */
export function isReady(quiz: Quiz, a: QuizAnswer): boolean {
  switch (a.kind) {
    case "single":
      return a.value !== null;
    case "multiple":
      return a.value.length > 0;
    case "fill":
      return a.value.trim().length > 0;
    case "truefalse":
      return a.value !== null;
    case "match":
      return quiz.kind === "match" && Object.keys(a.value).length === quiz.pairs.length;
  }
}

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

export function isCorrect(quiz: Quiz, a: QuizAnswer): boolean {
  if (quiz.kind === "single" && a.kind === "single") return a.value === quiz.correct;
  if (quiz.kind === "multiple" && a.kind === "multiple") {
    const want = [...quiz.correct].sort().join("|");
    return [...a.value].sort().join("|") === want;
  }
  if (quiz.kind === "fill" && a.kind === "fill") {
    const got = normalize(a.value);
    return quiz.answers.some((ans) => normalize(ans) === got);
  }
  if (quiz.kind === "truefalse" && a.kind === "truefalse") return a.value === quiz.correct;
  if (quiz.kind === "match" && a.kind === "match")
    return quiz.pairs.every((_, i) => a.value[i] === i);
  return false;
}

/** Deterministic shuffle (same on server and client) that never returns the original order. */
export function stableShuffle(n: number, seed: string): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (n > 1 && order.every((v, i) => v === i)) order.push(order.shift()!);
  return order;
}

export const letter = (i: number) => String.fromCharCode(65 + i);

/** Pick a cheer for a correct answer (stable per question). `cheers` comes from the dictionary (t.quiz.feedback.cheers). */
export const cheerFor = (seed: string, cheers: readonly string[]) => cheers[seed.length % cheers.length] ?? "";

/** How "True"/"False" are written out (pass t.quiz in the UI; the server uses English). */
export type TrueFalseLabels = { true: string; false: string };
const EN_TF: TrueFalseLabels = { true: "True", false: "False" };

/** The right answer in plain words (used by the feedback card and the AI tutor). */
export function rightAnswerText(q: Quiz, tf: TrueFalseLabels = EN_TF): string {
  switch (q.kind) {
    case "single":
      return q.options.find((o) => o.id === q.correct)?.text ?? "";
    case "multiple":
      return q.options
        .filter((o) => q.correct.includes(o.id))
        .map((o) => o.text)
        .join(" · ");
    case "fill":
      return q.answers[0];
    case "truefalse":
      return q.correct ? tf.true : tf.false;
    case "match":
      return q.pairs.map((p) => `${p.left}: ${p.right}`).join(" · ");
  }
}

/** What the learner picked, in plain words. */
export function answerText(q: Quiz, a: QuizAnswer, tf: TrueFalseLabels = EN_TF): string {
  if (q.kind === "single" && a.kind === "single") return q.options.find((o) => o.id === a.value)?.text ?? "";
  if (q.kind === "multiple" && a.kind === "multiple")
    return q.options
      .filter((o) => a.value.includes(o.id))
      .map((o) => o.text)
      .join(" · ");
  if (q.kind === "fill" && a.kind === "fill") return a.value.trim();
  if (q.kind === "truefalse" && a.kind === "truefalse") return a.value === null ? "" : a.value ? tf.true : tf.false;
  if (q.kind === "match" && a.kind === "match")
    return q.pairs.map((p, i) => `${p.left}: ${q.pairs[a.value[i]]?.right ?? "?"}`).join(" · ");
  return "";
}

/** The correct answer as if the learner picked it (used by the admin "Demo: next" shortcut). */
export function correctAnswer(q: Quiz): QuizAnswer {
  switch (q.kind) {
    case "single":
      return { kind: "single", value: q.correct };
    case "multiple":
      return { kind: "multiple", value: [...q.correct] };
    case "fill":
      return { kind: "fill", value: q.answers[0] };
    case "truefalse":
      return { kind: "truefalse", value: q.correct };
    case "match":
      return { kind: "match", value: Object.fromEntries(q.pairs.map((_, i) => [i, i])) };
  }
}
