// POST /api/ai — the lesson's AI guide, powered by Google Gemini.
//
// Security: the key lives ONLY in the server env var GEMINI_API_KEY (Vercel → Settings → Environment
// Variables). This file runs on the server; the browser only ever talks to /api/ai and never sees
// the key. Never rename it to NEXT_PUBLIC_… and never import this file from a client component.
//
// Without a key (local dev, previews) the route still answers with a friendly hint built from the
// lesson's own text, so the UI never breaks.

import "server-only";
import { lessons } from "@/content/lessons";
import { localizeLesson } from "@/content/i18n";
import { DEFAULT_LOCALE, LOCALE_ENGLISH_NAMES, isLocale, type Locale } from "@/i18n/locales";
import type { Lesson, LessonStep } from "@/content/types";
import { rightAnswerText } from "@/components/quiz/logic";

const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const MAX_QUESTION = 500;
const MAX_TURNS = 6; // earlier chat turns sent back to Gemini for context

const SYSTEM = `You are the friendly AI guide inside Crypto Voyage, a learning app where complete beginners learn crypto, blockchain and Solana by sailing a route of short lessons. You travel with the learner as their little boat companion on this voyage.

Who you're talking to:
- A complete beginner and not a developer. Never assume they already understand crypto.
- Talk like a kind friend: warm, encouraging, slightly playful, never childish, never condescending.

How to explain:
- Plain everyday words. If a crypto term is unavoidable, explain it in the same sentence.
- Use one short real-life analogy when it helps (a shared notebook, a post office, house keys, a loyalty card).
- Keep it short: 2 to 5 sentences unless the learner asks for more detail. No headings, no tables, no code.
- Stay close to the current lesson and step. If a question is off-topic, answer briefly and kindly steer back.

Quizzes:
- If the learner has NOT answered the quiz yet, never reveal the answer or say which option is correct. Give a hint or a guiding question instead.
- If the learner already answered and got it wrong, the app has already shown the right answer. Explain supportively why their pick doesn't fit and why the right one does, using the lesson's idea. Mistakes are part of learning.

Safety (always):
- No financial or investment advice, no price predictions, never tell anyone what to buy, sell or hold. Your goal is education.
- Never ask for, accept or repeat private keys, seed phrases or recovery phrases. If someone shares one, tell them kindly to treat that wallet as unsafe and never share it again.
- Everything in the app runs on Solana devnet with free test coins that have no real value. Never suggest using real money or mainnet.`;

type Turn = { from: "me" | "ai"; text: string };
type Body = {
  lessonId?: unknown;
  stepId?: unknown;
  question?: unknown;
  phase?: unknown; // "read" | "quiz"
  learnerAnswer?: unknown; // only after the quiz was checked
  wasCorrect?: unknown;
  history?: unknown;
  locale?: unknown; // "en" | "uk" | "cs" | "ru": the guide answers in this language
};

// The few lines this route writes itself (offline hints, notes, errors), per language.
const COPY: Record<Locale, {
  generic: string; missed: string; nudge: (title: string) => string; thinkLead: string; pictureLead: string; onQuiz: string;
  notConnected: string; resting: string; noJson: string; empty: string; tooMany: string; t: string; f: string;
}> = {
  en: {
    generic: "Great question! Try reading the step once more, slowly. The answer is usually hiding in one of the short paragraphs. And remember: everything here is practice money on devnet, so there's nothing to lose by trying.",
    missed: "No worries, this one trips lots of people up.",
    nudge: (t) => `Here's a little nudge about "${t}":`,
    thinkLead: "Think of it this way:",
    pictureLead: "Picture it like this:",
    onQuiz: "Read the question again with that picture in mind. I believe you've got this!",
    notConnected: "The AI guide isn't connected yet, so this hint comes from the lesson notes.",
    resting: "The AI guide is resting right now, so this hint comes from the lesson notes.",
    noJson: "Please send your question as JSON.",
    empty: "Type a question first, then I can help.",
    tooMany: "Whoa, lots of questions! Let's take a short breath. Try again in a minute.",
    t: "True", f: "False",
  },
  uk: {
    generic: "Чудове питання! Спробуй ще раз повільно перечитати цей крок. Відповідь зазвичай ховається в одному з коротких абзаців. І пам'ятай: тут усе на тренувальних монетах у devnet, тож пробувати зовсім не страшно.",
    missed: "Не хвилюйся, на цьому питанні спотикаються дуже багато людей.",
    nudge: (t) => `Ось маленька підказка до кроку «${t}»:`,
    thinkLead: "", pictureLead: "",
    onQuiz: "Перечитай питання ще раз, тримаючи цей образ у голові. Я вірю, що в тебе вийде!",
    notConnected: "AI-помічник ще не підключений, тому ця підказка з нотаток уроку.",
    resting: "AI-помічник зараз відпочиває, тому ця підказка з нотаток уроку.",
    noJson: "Надішли питання у форматі JSON.",
    empty: "Спершу напиши питання, і я допоможу.",
    tooMany: "Ого, скільки питань! Давай трохи перепочинемо. Спробуй ще раз за хвилину.",
    t: "Правда", f: "Неправда",
  },
  cs: {
    generic: "Skvělá otázka! Zkus si ten krok přečíst ještě jednou, pomalu. Odpověď se obvykle skrývá v jednom z krátkých odstavců. A pamatuj: všechno tady jsou cvičné mince na devnetu, takže zkoušením nic neztratíš.",
    missed: "Nic se neděje, na téhle otázce zakopne spousta lidí.",
    nudge: (t) => `Tady je malá nápověda ke kroku „${t}“:`,
    thinkLead: "", pictureLead: "",
    onQuiz: "Přečti si otázku znovu a mysli přitom na tenhle obrázek. Věřím, že to zvládneš!",
    notConnected: "AI průvodce ještě není připojený, takže tahle nápověda je z poznámek k lekci.",
    resting: "AI průvodce teď odpočívá, takže tahle nápověda je z poznámek k lekci.",
    noJson: "Pošli prosím otázku ve formátu JSON.",
    empty: "Nejdřív napiš otázku, pak ti pomůžu.",
    tooMany: "Páni, to je otázek! Dáme si krátkou pauzu. Zkus to znovu za minutu.",
    t: "Pravda", f: "Nepravda",
  },
  ru: {
    generic: "Отличный вопрос! Попробуй ещё раз медленно перечитать этот шаг. Ответ обычно прячется в одном из коротких абзацев. И помни: здесь всё на тренировочных монетах в devnet, так что пробовать совсем не страшно.",
    missed: "Не переживай, на этом вопросе спотыкаются очень многие.",
    nudge: (t) => `Вот маленькая подсказка к шагу «${t}»:`,
    thinkLead: "", pictureLead: "",
    onQuiz: "Перечитай вопрос ещё раз, держа этот образ в голове. Я верю, у тебя получится!",
    notConnected: "AI-помощник ещё не подключён, поэтому эта подсказка из заметок к уроку.",
    resting: "AI-помощник сейчас отдыхает, поэтому эта подсказка из заметок к уроку.",
    noJson: "Отправь вопрос в формате JSON.",
    empty: "Сначала напиши вопрос, и я помогу.",
    tooMany: "Ого, сколько вопросов! Давай немного передохнём. Попробуй ещё раз через минуту.",
    t: "Правда", f: "Неправда",
  },
};

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// ---- tiny best-effort rate limit (per server instance) so nobody burns the key's quota ----
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 12; // 12 questions a minute is plenty for a learner
}

const firstSentence = (p: string) => p.match(/^.+?[.!?](\s|$)/)?.[0].trim() ?? p;
// "Think of how a photo travels…" reads fine on its own; anything else gets a gentle lead-in
// (translated examples already read as a picture, so other languages get no lead-in)
const picture = (ex: string, lead: string) =>
  !lead || /^(think|imagine|picture)\b/i.test(ex) ? ex : `${lead} ${ex.charAt(0).toLowerCase()}${ex.slice(1)}`;

function cannedHint(step: LessonStep | undefined, onQuiz: boolean, missed: boolean, c: (typeof COPY)[Locale]): string {
  if (!step) return c.generic;
  if (missed && step.quiz) {
    return `${c.missed} ${step.quiz.explanation}${step.example ? `\n\n${picture(step.example, c.pictureLead)}` : ""}`;
  }
  const parts = [`${c.nudge(step.title)} ${step.body.map(firstSentence).join(" ")}`];
  if (step.example) parts.push(picture(step.example, c.thinkLead));
  if (onQuiz) parts.push(c.onQuiz);
  return parts.join("\n\n");
}

function lessonContext(lesson: Lesson | undefined, step: LessonStep | undefined, b: Body, c: (typeof COPY)[Locale]): string {
  const onQuiz = b.phase === "quiz" && !!step?.quiz;
  const learnerAnswer = str(b.learnerAnswer, 400);
  const answered = onQuiz && !!learnerAnswer;
  const lines = [
    lesson && `Lesson ${lesson.number}: ${lesson.title} — ${lesson.summary}`,
    step && `Current step: ${step.title}`,
    step && `What the step teaches: ${step.body.join(" ")}`,
    step?.example && `The lesson's real-life example: ${step.example}`,
  ];
  if (onQuiz && step?.quiz) {
    lines.push(`The learner is on this quiz question: ${step.quiz.question}`);
    if (answered) {
      lines.push(
        `They answered: ${learnerAnswer} (${b.wasCorrect === true ? "correct" : "not correct"}).`,
        `The right answer, already shown to them: ${rightAnswerText(step.quiz, { true: c.t, false: c.f })}`,
        `The lesson's explanation: ${step.quiz.explanation}`,
      );
    } else {
      lines.push("They have NOT answered yet. Do not reveal or hint which option is correct; guide them to think.");
    }
  }
  return lines.filter(Boolean).join("\n");
}

function history(v: unknown): Turn[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((t): t is Turn => !!t && (t.from === "me" || t.from === "ai") && typeof t.text === "string")
    .slice(-MAX_TURNS)
    .map((t) => ({ from: t.from, text: t.text.slice(0, 1200) }));
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: COPY.en.noJson }, { status: 400 });
  }
  const locale: Locale = isLocale(body.locale) ? body.locale : DEFAULT_LOCALE;
  const c = COPY[locale];

  const question = str(body.question, MAX_QUESTION);
  if (!question) return Response.json({ error: c.empty }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) {
    return Response.json(
      { error: c.tooMany },
      { status: 429 },
    );
  }

  const found = lessons.find((l) => l.id === str(body.lessonId, 80));
  const lesson = found && localizeLesson(found, locale);
  const step = lesson?.steps.find((s) => s.id === str(body.stepId, 80));
  const onQuiz = body.phase === "quiz";
  const missed = onQuiz && !!str(body.learnerAnswer) && body.wasCorrect === false;

  const fallback = (note: string) => Response.json({ answer: cannedHint(step, onQuiz, missed, c), source: "fallback", note });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return fallback(c.notConnected);

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const turns = history(body.history);
  const contents = [
    ...turns.map((t) => ({ role: t.from === "me" ? "user" : "model", parts: [{ text: t.text }] })),
    {
      role: "user",
      parts: [
        {
          text: `[Where the learner is right now]\n${lessonContext(lesson, step, body, c)}\n\n[Learner's question]\n${question}\n\n[Reply in ${LOCALE_ENGLISH_NAMES[locale]}.]`,
        },
      ],
    },
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: `${SYSTEM}\n\nLanguage: the learner reads the app in ${LOCALE_ENGLISH_NAMES[locale]}. Always answer in ${LOCALE_ENGLISH_NAMES[locale]}, in simple everyday words, using the informal "you". Keep brand names (Solana, Phantom, SOL) as they are.` }] },
          contents,
          generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
        }),
        signal: AbortSignal.timeout(20_000),
        cache: "no-store",
      },
    );
    if (!res.ok) throw new Error(`Gemini API ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
    };
    const answer = data.candidates?.[0]?.content?.parts
      ?.filter((p) => !p.thought && p.text)
      .map((p) => p.text)
      .join("")
      .trim();
    if (!answer) throw new Error("empty answer");
    return Response.json({ answer, source: "ai" });
  } catch (err) {
    console.error("[api/ai]", err instanceof Error ? err.message : err);
    return fallback(c.resting);
  }
}
