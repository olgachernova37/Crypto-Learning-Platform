"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IconChat, IconClose, IconSend, IconSparkle } from "./icons";
import m from "./motion.module.css";

type Msg = { from: "me" | "ai"; text: string; note?: string };

export type AskContext = { lessonTitle: string; stepTitle: string; quizQuestion?: string };

/** Floating "Ask AI" pill + small rounded chat sheet. Talks to /api/ask. */
export function AskAi({ context, raised = true }: { context: AskContext; raised?: boolean }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const pill = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        pill.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setMsgs((m) => [...m, { from: "me", text: question }]);
    setQ("");
    setBusy(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...context, question }),
      });
      const data = (await res.json()) as { answer?: string; note?: string; error?: string };
      setMsgs((m) => [
        ...m,
        { from: "ai", text: data.answer ?? data.error ?? "Hmm, I couldn't think of an answer. Try asking another way?", note: data.note },
      ]);
    } catch {
      setMsgs((m) => [...m, { from: "ai", text: "I couldn't reach the helper just now. Check your connection and try again?" }]);
    } finally {
      setBusy(false);
    }
  }

  const suggestions = context.quizQuestion
    ? ["Can you give me a hint?", "Explain this step more simply"]
    : ["Explain this more simply", "Give me another example"];

  return (
    <>
      <button
        ref={pill}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`fixed right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-deep-ocean py-2 pr-5 pl-2.5 text-[15px] font-extrabold text-white shadow-[0_14px_34px_-12px_rgba(13,43,69,0.75)] ring-4 ring-white/70 transition hover:-translate-y-0.5 hover:bg-ocean-teal focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/60 sm:right-8 ${
          raised ? "bottom-[calc(6.5rem+env(safe-area-inset-bottom))] sm:bottom-[7.5rem]" : "bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-8"
        } ${open ? "pointer-events-none opacity-0" : ""}`}
      >
        <span aria-hidden className="grid size-8 place-items-center rounded-full bg-light-sky text-deep-ocean">
          <IconSparkle width={16} height={16} />
        </span>
        Ask AI
      </button>

      {open && (
        <>
          <div aria-hidden className="fixed inset-0 z-40 bg-deep-ocean/25 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[82dvh] flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_-20px_60px_-20px_rgba(13,43,69,0.45)] sm:inset-x-auto sm:right-8 sm:bottom-8 sm:max-h-[min(36rem,80dvh)] sm:w-[24rem] sm:rounded-[1.75rem] sm:shadow-[0_30px_80px_-24px_rgba(13,43,69,0.55)] sm:ring-1 sm:ring-ink/8 ${m.fadeUp}`}
          >
            <div className="flex items-center gap-3 bg-deep-ocean px-5 py-4 text-white">
              <span aria-hidden className="grid size-10 place-items-center rounded-full bg-light-sky text-deep-ocean">
                <IconChat width={20} height={20} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="text-[17px] font-extrabold">
                  Ask AI
                </h2>
                <p className="truncate text-sm text-white/70">About: {context.stepTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  pill.current?.focus();
                }}
                aria-label="Close the AI helper"
                className="grid size-11 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-light-sky"
              >
                <IconClose width={20} height={20} />
              </button>
            </div>

            <div ref={list} className="flex min-h-48 flex-1 flex-col gap-3 overflow-y-auto bg-foam px-4 py-4" aria-live="polite">
              <Bubble from="ai" text="Hi! Stuck or just curious? Ask me anything about this step. I'll give you a nudge in plain words, not the quiz answer." />
              {msgs.map((msg, i) => (
                <Bubble key={i} {...msg} />
              ))}
              {busy && (
                <div className="flex w-fit items-center gap-1.5 rounded-[1.25rem] rounded-bl-md bg-white px-4 py-3.5 ring-1 ring-ink/8" aria-label="The helper is thinking">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`size-2 rounded-full bg-seafoam ${m.twinkle}`} style={{ animationDelay: `${i * 0.25}s`, animationDuration: "1.2s" }} />
                  ))}
                </div>
              )}
              {msgs.length === 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="min-h-11 rounded-full bg-white px-4 text-sm font-bold text-ocean-teal ring-1 ring-ocean-teal/25 transition hover:bg-light-sky/40 focus-visible:outline-3 focus-visible:outline-ocean-teal/50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(q);
              }}
              className="flex items-end gap-2 border-t border-ink/8 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              <label htmlFor={`${titleId}-q`} className="sr-only">
                Your question
              </label>
              <textarea
                id={`${titleId}-q`}
                ref={input}
                rows={1}
                value={q}
                maxLength={500}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(q);
                  }
                }}
                placeholder="Type your question…"
                className="max-h-32 min-h-12 flex-1 resize-none rounded-[1.25rem] bg-foam px-4 py-3 text-[16px] text-ink ring-1 ring-ink/10 outline-none placeholder:text-ink/40 focus:ring-2 focus:ring-ocean-teal/50"
              />
              <button
                type="submit"
                disabled={!q.trim() || busy}
                aria-label="Send question"
                className="grid size-12 shrink-0 place-items-center rounded-full bg-ocean-teal text-white transition hover:bg-deep-ocean focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50 disabled:bg-ink/15 disabled:text-white"
              >
                <IconSend width={20} height={20} />
              </button>
            </form>
            <p className="bg-white px-5 pb-3 text-center text-xs text-ink-soft">
              Never share your recovery phrase, not even with an AI.
            </p>
          </div>
        </>
      )}
    </>
  );
}

function Bubble({ from, text, note }: Msg) {
  const me = from === "me";
  return (
    <div className={`max-w-[88%] ${me ? "self-end" : "self-start"}`}>
      <div
        className={`rounded-[1.25rem] px-4 py-3 text-[16px] leading-relaxed whitespace-pre-line ${
          me ? "rounded-br-md bg-ocean-teal text-white" : "rounded-bl-md bg-white text-ink ring-1 ring-ink/8"
        }`}
      >
        {text}
      </div>
      {note && <p className="mt-1.5 px-2 text-xs font-semibold text-ink-soft">{note}</p>}
    </div>
  );
}
