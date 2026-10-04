"use client";

// The AI guide: our little boat, sailing along with the learner. A compact night-sea panel
// (tablet/desktop: floats bottom-right above the action bar; phones: a short bottom sheet).
// It only talks to our own /api/ai route — the Gemini key never reaches the browser.

import { useEffect, useId, useRef, useState } from "react";
import { Boat } from "@/components/ocean/Boat";
import { IconClose, IconSend } from "./icons";
import { useLocale, useT } from "@/i18n";
import m from "./motion.module.css";

type Msg = { from: "me" | "ai"; text: string; note?: string };

export type AskContext = {
  lessonId: string;
  stepId: string;
  stepTitle: string;
  phase: "read" | "quiz";
  /** set once the quiz was checked */
  learnerAnswer?: string;
  wasCorrect?: boolean;
};

/** Open the guide from anywhere. `detail.ask` (optional) is sent as the first question. */
export const ASK_AI_OPEN_EVENT = "crypto-voyage:ask-ai";

/** The companion's face: our boat in a soft glowing porthole. */
export function GuideAvatar({ size = 40 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="relative grid shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#2a7690,#0d2b45_70%)] ring-2 ring-light-sky/40 shadow-[0_0_18px_-2px_rgba(126,224,240,0.55)]"
      style={{ width: size, height: size }}
    >
      <Boat className="w-[92%] -rotate-[28deg]" />
    </span>
  );
}

export function AskAi({ context, raised = true }: { context: AskContext; raised?: boolean }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const pill = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const t = useT();
  const [locale] = useLocale();

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    const history = msgs.map(({ from, text }) => ({ from, text }));
    setMsgs((m) => [...m, { from: "me", text: question }]);
    setQ("");
    setBusy(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...context, question, history, locale }),
      });
      const data = (await res.json()) as { answer?: string; note?: string; error?: string };
      setMsgs((m) => [
        ...m,
        { from: "ai", text: data.answer ?? data.error ?? t.ai.noAnswer, note: data.note },
      ]);
    } catch {
      setMsgs((m) => [...m, { from: "ai", text: t.ai.offline }]);
    } finally {
      setBusy(false);
    }
  }

  // keep the newest `send` for the window event listener below
  const sendRef = useRef(send);
  useEffect(() => {
    sendRef.current = send;
  });

  useEffect(() => {
    if (!open) return;
    input.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        pill.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // opened from the lesson header (phones) or from a quiz's "Ask the AI guide why"
  useEffect(() => {
    const openSheet = (e: Event) => {
      setOpen(true);
      const ask = (e as CustomEvent<{ ask?: string } | undefined>).detail?.ask;
      if (ask) sendRef.current(ask);
    };
    window.addEventListener(ASK_AI_OPEN_EVENT, openSheet);
    return () => window.removeEventListener(ASK_AI_OPEN_EVENT, openSheet);
  }, []);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const missed = context.phase === "quiz" && context.wasCorrect === false;
  const suggestions = missed
    ? [t.ai.suggestions.whyWrong, t.ai.suggestions.anotherExample]
    : context.phase === "quiz"
      ? [t.ai.suggestions.hint, t.ai.suggestions.simpler]
      : [t.ai.suggestions.simpler, t.ai.suggestions.realLife];
  const greeting = missed ? t.ai.greeting.missed : context.phase === "quiz" ? t.ai.greeting.quiz : t.ai.greeting.read;

  const close = () => {
    setOpen(false);
    pill.current?.focus();
  };

  return (
    <>
      <button
        ref={pill}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`fixed right-4 z-40 hidden min-h-12 items-center gap-2.5 rounded-full bg-sea-night py-1.5 pr-5 pl-1.5 text-[15px] font-extrabold text-white shadow-[0_14px_34px_-12px_rgba(8,28,46,0.8),0_0_24px_-6px_rgba(126,224,240,0.5)] ring-1 ring-light-sky/25 transition hover:-translate-y-0.5 hover:bg-deep-ocean focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/60 sm:inline-flex sm:right-8 ${
          raised ? "bottom-[calc(6.5rem+env(safe-area-inset-bottom))] sm:bottom-[7.5rem]" : "bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-8"
        } ${open ? "pointer-events-none opacity-0" : ""}`}
      >
        <GuideAvatar size={36} />
        {t.ai.open}
      </button>

      {open && (
        <>
          <div aria-hidden className="fixed inset-0 z-40 bg-sea-night/40 backdrop-blur-[2px] sm:hidden" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[72dvh] flex-col overflow-hidden rounded-t-[1.75rem] bg-[linear-gradient(180deg,#0f3350_0%,#081c2e_100%)] text-white shadow-[0_-20px_60px_-20px_rgba(8,28,46,0.7)] ring-1 ring-light-sky/15 sm:inset-x-auto sm:right-8 sm:w-[22rem] sm:rounded-[1.75rem] sm:shadow-[0_30px_80px_-24px_rgba(8,28,46,0.85),0_0_50px_-18px_rgba(126,224,240,0.55)] ${
              raised ? "sm:bottom-[7.5rem] sm:max-h-[min(32rem,calc(100dvh-10rem))]" : "sm:bottom-8 sm:max-h-[min(32rem,80dvh)]"
            } ${m.fadeUp}`}
          >
            {/* header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <GuideAvatar size={44} />
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="text-[17px] leading-tight font-extrabold">
                  {t.ai.title}
                </h2>
                <p className="truncate text-[13px] font-semibold text-light-sky/75">{t.ai.sailingWith(context.stepTitle)}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={t.ai.close}
                className="grid size-11 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-light-sky"
              >
                <IconClose width={20} height={20} />
              </button>
            </div>
            <div aria-hidden className="mx-4 border-t border-dashed border-light-sky/20" />

            {/* messages */}
            <div ref={list} className="flex min-h-40 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" aria-live="polite">
              <Bubble from="ai" text={greeting} />
              {msgs.map((msg, i) => (
                <Bubble key={i} {...msg} />
              ))}
              {busy && (
                <div className="flex w-fit items-center gap-1.5 rounded-[1.25rem] rounded-bl-md bg-white/8 px-4 py-3.5 ring-1 ring-light-sky/15" aria-label={t.ai.thinking}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`size-2 rounded-full bg-[#7ee0f0] ${m.twinkle}`} style={{ animationDelay: `${i * 0.25}s`, animationDuration: "1.2s" }} />
                  ))}
                </div>
              )}
              {msgs.length === 0 && !busy && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="min-h-10 rounded-full bg-white/6 px-3.5 text-[14px] font-bold text-light-sky ring-1 ring-light-sky/30 transition hover:bg-light-sky/15 hover:text-white focus-visible:outline-3 focus-visible:outline-light-sky/60"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(q);
              }}
              className="flex items-end gap-2 px-3 pt-1 pb-2"
            >
              <label htmlFor={`${titleId}-q`} className="sr-only">
                {t.ai.questionLabel}
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
                placeholder={t.ai.placeholder}
                className="max-h-28 min-h-12 flex-1 resize-none rounded-[1.25rem] bg-white/8 px-4 py-3 text-[16px] text-white ring-1 ring-light-sky/20 outline-none placeholder:text-light-sky/50 focus:ring-2 focus:ring-[#7ee0f0]/60"
              />
              <button
                type="submit"
                disabled={!q.trim() || busy}
                aria-label={t.ai.send}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#b7d4e6,#7ee0f0_55%,#8ff0c4)] text-deep-ocean shadow-[0_0_20px_-4px_rgba(126,224,240,0.6)] transition hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-light-sky disabled:bg-none disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none"
              >
                <IconSend width={20} height={20} />
              </button>
            </form>
            <p className="px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[12px] text-light-sky/60">
              {t.ai.disclaimer}
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
        className={`rounded-[1.25rem] px-4 py-3 text-[15.5px] leading-relaxed whitespace-pre-line ${
          me ? "rounded-br-md bg-[#2a7690] text-white" : "rounded-bl-md bg-white/8 text-[#e6f0f7] ring-1 ring-light-sky/15"
        }`}
      >
        {text}
      </div>
      {note && <p className="mt-1.5 px-2 text-xs font-semibold text-light-sky/55">{note}</p>}
    </div>
  );
}
