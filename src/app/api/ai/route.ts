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
const picture = (ex: string, lead: string) =>
  /^(think|imagine|picture)\b/i.test(ex) ? ex : `${lead} ${ex.charAt(0).toLowerCase()}${ex.slice(1)}`;

function cannedHint(step: LessonStep | undefined, onQuiz: boolean, missed: boolean): string {
  if (!step) {
    return "Great question! Try reading the step once more, slowly. The answer is usually hiding in one of the short paragraphs. And remember: everything here is practice money on devnet, so there's nothing to lose by trying.";
  }
  if (missed && step.quiz) {
    return `No worries, this one trips lots of people up. ${step.quiz.explanation}${step.example ? `\n\n${picture(step.example, "Picture it like this:")}` : ""}`;
  }
  const parts = [`Here's a little nudge about "${step.title}": ${step.body.map(firstSentence).join(" ")}`];
  if (step.example) parts.push(picture(step.example, "Think of it this way:"));
  if (onQuiz) parts.push("Read the question again with that picture in mind. I believe you've got this!");
  return parts.join("\n\n");
}

function lessonContext(lesson: Lesson | undefined, step: LessonStep | undefined, b: Body): string {
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
        `The right answer, already shown to them: ${rightAnswerText(step.quiz)}`,
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
    return Response.json({ error: "Please send your question as JSON." }, { status: 400 });
  }

  const question = str(body.question, MAX_QUESTION);
  if (!question) return Response.json({ error: "Type a question first, then I can help." }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) {
    return Response.json(
      { error: "Whoa, lots of questions! Let's take a short breath. Try again in a minute." },
      { status: 429 },
    );
  }

  const lesson = lessons.find((l) => l.id === str(body.lessonId, 80));
  const step = lesson?.steps.find((s) => s.id === str(body.stepId, 80));
  const onQuiz = body.phase === "quiz";
  const missed = onQuiz && !!str(body.learnerAnswer) && body.wasCorrect === false;

  const fallback = (note: string) => Response.json({ answer: cannedHint(step, onQuiz, missed), source: "fallback", note });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return fallback("The AI guide isn't connected yet, so this hint comes from the lesson notes.");

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const turns = history(body.history);
  const contents = [
    ...turns.map((t) => ({ role: t.from === "me" ? "user" : "model", parts: [{ text: t.text }] })),
    {
      role: "user",
      parts: [{ text: `[Where the learner is right now]\n${lessonContext(lesson, step, body)}\n\n[Learner's question]\n${question}` }],
    },
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
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
    return fallback("The AI guide is resting right now, so this hint comes from the lesson notes.");
  }
}
