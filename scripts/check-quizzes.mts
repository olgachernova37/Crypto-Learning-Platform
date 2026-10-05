// Checks every quiz and boss round, in every language, for things a learner would trip over:
//   - the correct answer exists (and is really accepted by the quiz logic), and a wrong answer exists too
//   - every question has an explanation (shown right away after a wrong answer, so it must be real)
//   - "multiple" quizzes have 2+ right AND 1+ wrong options (UI: square checkboxes + "Select all that apply")
//   - no duplicate options, fill-in has "___" and its answer isn't given away, match pairs are distinct
//   - translations aren't left in English
// Run: npx tsx scripts/check-quizzes.mts      (exit code 1 if something is wrong)
import { lessons } from "../src/content/lessons";
import { localizeLesson } from "../src/content/i18n";
import { LOCALES, type Locale } from "../src/i18n/locales";
import { dictFor } from "../src/i18n/dict";
import { correctAnswer, isCorrect, normalize, type QuizAnswer } from "../src/components/quiz/logic";
import type { Quiz } from "../src/content/types";

type Issue = { level: "error" | "warn"; where: string; msg: string };
const issues: Issue[] = [];
const err = (where: string, msg: string) => issues.push({ level: "error", where, msg });
const warn = (where: string, msg: string) => issues.push({ level: "warn", where, msg });

const dupes = (xs: string[]) => xs.filter((x, i) => xs.indexOf(x) !== i);
const blank = (s: unknown) => typeof s !== "string" || !s.trim();

/** A deliberately wrong answer, to prove the quiz can be failed (and so shows the correct one + explanation). */
function wrongAnswer(q: Quiz): QuizAnswer | null {
  switch (q.kind) {
    case "single": {
      const o = q.options.find((x) => x.id !== q.correct);
      return o ? { kind: "single", value: o.id } : null;
    }
    case "multiple": {
      const o = q.options.find((x) => !q.correct.includes(x.id));
      return o ? { kind: "multiple", value: [o.id] } : null;
    }
    case "fill":
      return { kind: "fill", value: "zzz-not-an-answer" };
    case "truefalse":
      return { kind: "truefalse", value: !q.correct };
    case "match":
      return q.pairs.length > 1 ? { kind: "match", value: Object.fromEntries(q.pairs.map((_, i) => [i, (i + 1) % q.pairs.length])) } : null;
  }
}

function checkQuiz(q: Quiz, en: Quiz, where: string, locale: Locale, boss: boolean) {
  if (boss && !["single", "multiple", "truefalse"].includes(q.kind)) err(where, `boss rounds must be single / multiple / truefalse, got "${q.kind}"`);
  if (blank(q.question)) err(where, "no question text");
  if (blank(q.explanation)) err(where, "no explanation (it is shown right after a wrong answer)");
  else {
    if (q.explanation.trim().length < 25) warn(where, `explanation is very short: "${q.explanation}"`);
    if (normalize(q.explanation) === normalize(q.question)) err(where, "explanation just repeats the question");
  }

  if (q.kind === "single" || q.kind === "multiple") {
    const ids = q.options.map((o) => o.id);
    if (q.options.length < 2) err(where, "needs at least 2 options");
    if (dupes(ids).length) err(where, `duplicate option ids: ${dupes(ids).join(", ")}`);
    q.options.forEach((o) => blank(o.text) && err(where, `option "${o.id}" has no text`));
    const texts = q.options.map((o) => normalize(o.text));
    if (dupes(texts).length) err(where, `two options say the same thing: "${dupes(texts)[0]}"`);
    if (q.kind === "single") {
      if (!ids.includes(q.correct)) err(where, `correct answer "${q.correct}" is not one of the options (${ids.join(", ")})`);
      if (/select all|all that apply|(choose|pick) (two|three|2|3)/i.test(q.question))
        err(where, `question asks for several answers but the quiz is "single": "${q.question}"`);
    } else {
      if (!Array.isArray(q.correct) || q.correct.length === 0) err(where, "no correct answers listed");
      else {
        q.correct.filter((c) => !ids.includes(c)).forEach((c) => err(where, `correct answer "${c}" is not one of the options`));
        if (dupes(q.correct).length) err(where, "a correct answer is listed twice");
        if (q.correct.length === 1) warn(where, `"multiple" quiz with only one right answer: make it "single"?`);
        if (q.correct.length === q.options.length) err(where, `every option is correct, so "Select all that apply" can't be failed`);
      }
    }
  }

  if (q.kind === "fill") {
    const blanks = q.question.split("___").length - 1;
    if (blanks !== 1) err(where, `fill-in question needs exactly one "___", found ${blanks}`);
    if (!q.answers.length || q.answers.some(blank)) err(where, "fill-in has an empty accepted answer");
    const given = q.answers.find((a) => normalize(q.question).split(" ").includes(normalize(a)) && normalize(a).length > 2);
    if (given) warn(where, `the answer "${given}" already appears in the question`);
    if (locale !== "en" && en.kind === "fill" && q.answers.length <= en.answers.length)
      warn(where, "no answers in this language (only the English ones are accepted)");
  }

  if (q.kind === "truefalse" && typeof q.correct !== "boolean") err(where, "true/false answer must be true or false");

  if (q.kind === "match") {
    if (q.pairs.length < 2) err(where, "match needs at least 2 pairs");
    const l = q.pairs.map((p) => normalize(p.left));
    const r = q.pairs.map((p) => normalize(p.right));
    if (dupes(l).length) err(where, `two words are the same: "${dupes(l)[0]}"`);
    if (dupes(r).length) err(where, `two meanings are the same: "${dupes(r)[0]}"`);
    q.pairs.forEach((p, i) => (blank(p.left) || blank(p.right)) && err(where, `pair ${i + 1} is empty`));
  }

  // the logic the UI uses must accept the right answer and reject a wrong one
  if (!isCorrect(q, correctAnswer(q))) err(where, "the quiz logic does not accept its own correct answer");
  const wrong = wrongAnswer(q);
  if (!wrong) err(where, "there is no way to answer this wrong (no wrong option)");
  else if (isCorrect(q, wrong)) err(where, "a wrong answer is accepted as correct");

  // translations left in English
  if (locale !== "en") {
    const same = (a: string, b: string) => a.trim().length > 14 && a.trim() === b.trim();
    if (same(q.question, en.question)) warn(where, "question is still in English");
    if (same(q.explanation, en.explanation)) warn(where, "explanation is still in English");
    if ((q.kind === "single" || q.kind === "multiple") && (en.kind === "single" || en.kind === "multiple"))
      q.options.forEach((o, i) => same(o.text, en.options[i].text) && warn(where, `option "${o.id}" is still in English`));
  }
}

const counts = { quizzes: 0, boss: 0, multiple: 0 };
for (const locale of LOCALES) {
  const t = dictFor(locale);
  if (blank(t.quiz.kind.multiple)) err(`${locale} UI`, `missing "Select all that apply" label`);
  if (blank(t.quiz.feedback ? JSON.stringify(t.quiz.feedback) : "")) err(`${locale} UI`, "missing quiz feedback text");

  for (const source of lessons) {
    const lesson = localizeLesson(source, locale);
    const stepIds = lesson.steps.map((s) => s.id);
    if (dupes(stepIds).length) err(`${locale} ${lesson.id}`, `duplicate step ids: ${dupes(stepIds).join(", ")}`);
    if (!lesson.steps.some((s) => s.quiz || s.boss)) warn(`${locale} ${lesson.id}`, "lesson has no quiz at all");
    lesson.steps.forEach((step, si) => {
      const enStep = source.steps[si];
      if (step.quiz && step.boss) err(`${locale} ${lesson.id}/${step.id}`, "a step has both a quiz and a boss");
      if (step.quiz) {
        if (locale === "en") counts.quizzes++;
        if (locale === "en" && step.quiz.kind === "multiple") counts.multiple++;
        checkQuiz(step.quiz, enStep.quiz!, `${locale} ${lesson.id}/${step.id}`, locale, false);
      }
      step.boss?.rounds.forEach((r, ri) => {
        const where = `${locale} ${lesson.id}/${step.id} round ${ri + 1}`;
        if (locale === "en") counts.boss++;
        if (locale === "en" && r.kind === "multiple") counts.multiple++;
        checkQuiz(r, enStep.boss!.rounds[ri], where, locale, true);
        if (enStep.boss!.rounds[ri].hint && blank(r.hint)) err(where, "Phantom's shield hint is missing");
        if (r.hint && normalize(r.hint).length > 0 && (r.kind === "single" || r.kind === "multiple")) {
          const right = r.kind === "single" ? [r.correct] : r.correct;
          const gives = r.options.filter((o) => right.includes(o.id)).some((o) => normalize(r.hint!).includes(normalize(o.text)));
          if (gives) warn(where, "the shield hint spells out the right answer word for word");
        }
      });
    });
  }
}

const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warn");
for (const i of [...errors, ...warnings]) console.log(`${i.level === "error" ? "✗" : "!"} ${i.where}: ${i.msg}`);
console.log(
  `\nChecked ${counts.quizzes} quizzes + ${counts.boss} boss rounds (${counts.multiple} "select all that apply") × ${LOCALES.length} languages.`,
);
console.log(errors.length ? `${errors.length} error(s), ${warnings.length} warning(s)` : `No errors ✓  (${warnings.length} warning(s))`);
process.exit(errors.length ? 1 : 0);
