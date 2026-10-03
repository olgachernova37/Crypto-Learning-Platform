// "Ask AI" helper for lessons. Uses the Anthropic Messages API when ANTHROPIC_API_KEY is set
// (server-side only — the key never reaches the browser), otherwise returns a friendly hint
// built from the lesson's own text.

import { lessons } from "@/content/lessons";
import type { LessonStep } from "@/content/types";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_QUESTION = 500;

const SYSTEM = `You are a warm, patient crypto tutor inside a beginner learning app called Crypto Voyage.
The learner is a complete beginner, not a developer. Talk like a kind friend over coffee.

Rules:
- Use plain, everyday words. If you must use a crypto term, explain it in the same sentence.
- Use a short real-life analogy when it helps (post office, loyalty card, house keys...).
- Keep answers short: 2 to 5 sentences, no headings, no markdown tables, no code.
- Never give financial or investment advice, price predictions, or tell anyone what to buy.
- Never ask for, accept, or repeat private keys, seed phrases or recovery phrases. If the learner shares one, tell them kindly to treat that wallet as unsafe and never share it again.
- Everything in the app happens on Solana devnet with free test coins that have no real value. Never suggest using mainnet or real money.
- If the learner is on a quiz question, do NOT reveal the answer or say which option is correct. Give a gentle nudge or hint that helps them think it through instead.
- If a question is off-topic, answer briefly and kindly steer back to the lesson.`;

type Body = { lessonTitle?: unknown; stepTitle?: unknown; question?: unknown; quizQuestion?: unknown };

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function findStep(lessonTitle: string, stepTitle: string): LessonStep | undefined {
  const lesson = lessons.find((l) => l.title === lessonTitle);
  return lesson?.steps.find((s) => s.title === stepTitle);
}

const firstSentence = (p: string) => p.match(/^.+?[.!?](\s|$)/)?.[0].trim() ?? p;

function cannedHint(step: LessonStep | undefined, onQuiz: boolean): string {
  if (!step) {
    return "Great question! Try reading the step once more, slowly. The answer is usually hiding in one of the short paragraphs. And remember: everything here is practice money on devnet, so there's nothing to lose by trying.";
  }
  const parts = [`Here's a little nudge about "${step.title}": ${step.body.map(firstSentence).join(" ")}`];
  if (step.example) parts.push(`Think of it this way: ${step.example.charAt(0).toLowerCase()}${step.example.slice(1)}`);
  if (onQuiz) parts.push("Read the question again with that picture in mind. I believe you've got this!");
  return parts.join("\n\n");
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Please send your question as JSON." }, { status: 400 });
  }

  const question = str(body.question, MAX_QUESTION);
  const lessonTitle = str(body.lessonTitle, 120);
  const stepTitle = str(body.stepTitle, 160);
  const quizQuestion = str(body.quizQuestion, 400);
  if (!question) return Response.json({ error: "Type a question first, then I can help." }, { status: 400 });

  const step = findStep(lessonTitle, stepTitle);
  const fallback = (note = "AI helper isn't connected yet, so this hint comes from the lesson notes.") =>
    Response.json({ answer: cannedHint(step, Boolean(quizQuestion)), source: "fallback", note });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return fallback();

  const context = [
    lessonTitle && `Lesson: ${lessonTitle}`,
    stepTitle && `Step: ${stepTitle}`,
    step && `What the step says: ${step.body.join(" ")}`,
    quizQuestion && `The learner is answering this quiz question (do not reveal the answer): ${quizQuestion}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: SYSTEM,
        messages: [{ role: "user", content: `${context}\n\nLearner's question: ${question}` }],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const answer = data.content
      ?.filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("")
      .trim();
    if (!answer) throw new Error("empty answer");
    return Response.json({ answer, source: "ai" });
  } catch (err) {
    console.error("[api/ask]", err instanceof Error ? err.message : err);
    return fallback("The AI helper is resting right now, so this hint comes from the lesson notes.");
  }
}
