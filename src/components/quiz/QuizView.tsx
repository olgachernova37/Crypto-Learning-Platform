"use client";

import { useId, useMemo, useState } from "react";
import type { Quiz } from "@/content/types";
import { IconCheck, IconClose } from "@/components/lesson/icons";
import { useT } from "@/i18n";
import { letter, normalize, stableShuffle, type QuizAnswer } from "./logic";

type Props = {
  quiz: Quiz;
  answer: QuizAnswer;
  onChange: (a: QuizAnswer) => void;
  revealed: boolean;
  /** Pressing Enter in the fill-in input. */
  onSubmit?: () => void;
};

export function QuizView({ quiz, answer, onChange, revealed, onSubmit }: Props) {
  const qid = useId();
  return (
    <section aria-labelledby={qid}>
      <KindHint quiz={quiz} />
      {quiz.kind !== "fill" && (
        <h2
          id={qid}
          className="mt-3 text-[1.55rem] leading-snug font-extrabold tracking-tight text-ink sm:text-[1.85rem]"
        >
          {quiz.question}
        </h2>
      )}
      <div className="mt-6">
        {(quiz.kind === "single" || quiz.kind === "multiple") && (
          <ChoiceList quiz={quiz} answer={answer} onChange={onChange} revealed={revealed} labelId={qid} />
        )}
        {quiz.kind === "truefalse" && answer.kind === "truefalse" && (
          <TrueFalse quiz={quiz} value={answer.value} onChange={onChange} revealed={revealed} labelId={qid} />
        )}
        {quiz.kind === "fill" && answer.kind === "fill" && (
          <Fill quiz={quiz} value={answer.value} onChange={onChange} revealed={revealed} onSubmit={onSubmit} labelId={qid} />
        )}
        {quiz.kind === "match" && answer.kind === "match" && (
          <Match quiz={quiz} value={answer.value} onChange={onChange} revealed={revealed} />
        )}
      </div>
    </section>
  );
}

/* ---------- small "how to answer" hint ---------- */

function KindHint({ quiz }: { quiz: Quiz }) {
  const t = useT();
  const text = t.quiz.kind[quiz.kind];
  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-light-sky/45 px-3.5 py-1.5 text-sm font-bold text-ocean-teal">
      {quiz.kind === "multiple" ? (
        <span aria-hidden className="grid size-4 place-items-center rounded-[5px] border-2 border-ocean-teal">
          <IconCheck width={10} height={10} />
        </span>
      ) : (
        <span aria-hidden className="size-2 rounded-full bg-ocean-teal" />
      )}
      {text}
    </p>
  );
}

/* ---------- single / multiple ---------- */

function ChoiceList({
  quiz,
  answer,
  onChange,
  revealed,
  labelId,
}: {
  quiz: Extract<Quiz, { kind: "single" | "multiple" }>;
  answer: QuizAnswer;
  onChange: (a: QuizAnswer) => void;
  revealed: boolean;
  labelId: string;
}) {
  const t = useT();
  const multi = quiz.kind === "multiple";
  const name = useId();
  const picked = (id: string) =>
    answer.kind === "multiple" ? answer.value.includes(id) : answer.kind === "single" && answer.value === id;
  const isRight = (id: string) => (quiz.kind === "multiple" ? quiz.correct.includes(id) : quiz.correct === id);

  const toggle = (id: string) => {
    if (revealed) return;
    if (answer.kind === "multiple") {
      const v = answer.value.includes(id) ? answer.value.filter((x) => x !== id) : [...answer.value, id];
      onChange({ kind: "multiple", value: v });
    } else onChange({ kind: "single", value: id });
  };

  return (
    <div role={multi ? "group" : "radiogroup"} aria-labelledby={labelId} className="flex flex-col gap-3">
      {quiz.options.map((o, i) => {
        const sel = picked(o.id);
        const right = isRight(o.id);
        let tone =
          "bg-white ring-1 ring-ink/10 hover:ring-2 hover:ring-ocean-teal/35 shadow-[0_2px_0_rgba(13,43,69,0.05)]";
        let badge = "bg-light-sky/55 text-ocean-teal";
        if (!revealed && sel) {
          tone = "bg-ocean-teal text-white ring-2 ring-ocean-teal shadow-[0_8px_24px_-10px_rgba(30,90,110,0.7)]";
          badge = "bg-white text-ocean-teal";
        }
        if (revealed && right) {
          tone = "bg-seafoam/15 ring-2 ring-seafoam text-ink";
          badge = "bg-seafoam text-white";
        } else if (revealed && sel) {
          tone = "bg-sandy-beige/35 ring-2 ring-sandy-beige text-ink";
          badge = "bg-sandy-beige text-deep-ocean";
        } else if (revealed) {
          tone = "bg-white/60 ring-1 ring-ink/5 text-ink/55";
        }
        return (
          <label
            key={o.id}
            className={`group relative flex min-h-[3.75rem] items-center gap-4 rounded-[1.25rem] px-4 py-3.5 text-[17px] font-semibold transition-all duration-200 has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ocean-teal/50 sm:text-lg ${
              revealed ? "cursor-default" : "cursor-pointer active:scale-[0.99]"
            } ${tone}`}
          >
            <input
              type={multi ? "checkbox" : "radio"}
              name={name}
              data-option={o.id}
              className="sr-only"
              checked={sel}
              disabled={revealed}
              onChange={() => toggle(o.id)}
              aria-describedby={revealed ? `${name}-${o.id}-note` : undefined}
            />
            <span
              aria-hidden
              className={`grid size-9 shrink-0 place-items-center text-[15px] font-extrabold transition-colors ${
                multi ? "rounded-[0.6rem]" : "rounded-full"
              } ${badge}`}
            >
              {revealed && right ? <IconCheck width={18} height={18} /> : revealed && sel ? <IconClose width={16} height={16} /> : letter(i)}
            </span>
            <span className="flex flex-1 flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="leading-snug">{o.text}</span>
              {revealed && (right || sel) && (
                <span
                  id={`${name}-${o.id}-note`}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                    right ? "bg-seafoam/25 text-[#2f6b64]" : "bg-sandy-beige/70 text-deep-ocean"
                  }`}
                >
                  {right ? (sel ? t.quiz.yourPickCorrect : t.quiz.correctAnswer) : t.quiz.yourPick}
                </span>
              )}
            </span>
            {!revealed && <Indicator multi={multi} on={sel} />}
          </label>
        );
      })}
    </div>
  );
}

function Indicator({ multi, on }: { multi: boolean; on: boolean }) {
  if (multi)
    return (
      <span
        aria-hidden
        className={`grid size-6 shrink-0 place-items-center rounded-[0.45rem] border-2 transition-colors ${
          on ? "border-white bg-white text-ocean-teal" : "border-ink/25 bg-white text-transparent"
        }`}
      >
        <IconCheck width={14} height={14} />
      </span>
    );
  return (
    <span
      aria-hidden
      className={`grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
        on ? "border-white" : "border-ink/25 bg-white"
      }`}
    >
      <span className={`size-2.5 rounded-full ${on ? "bg-white" : "bg-transparent"}`} />
    </span>
  );
}

/* ---------- true / false ---------- */

function TrueFalse({
  quiz,
  value,
  onChange,
  revealed,
  labelId,
}: {
  quiz: Extract<Quiz, { kind: "truefalse" }>;
  value: boolean | null;
  onChange: (a: QuizAnswer) => void;
  revealed: boolean;
  labelId: string;
}) {
  const t = useT();
  const name = useId();
  return (
    <div role="radiogroup" aria-labelledby={labelId} className="grid grid-cols-2 gap-3 sm:gap-4">
      {[true, false].map((v) => {
        const sel = value === v;
        const right = quiz.correct === v;
        let tone = "bg-white ring-1 ring-ink/10 hover:ring-2 hover:ring-ocean-teal/35 text-ink";
        let dot = v ? "bg-seafoam/20 text-[#2f6b64]" : "bg-sandy-beige/45 text-deep-ocean";
        if (!revealed && sel) {
          tone = "bg-ocean-teal ring-2 ring-ocean-teal text-white shadow-[0_10px_28px_-12px_rgba(30,90,110,0.8)]";
          dot = "bg-white text-ocean-teal";
        }
        if (revealed && right) {
          tone = "bg-seafoam/15 ring-2 ring-seafoam text-ink";
          dot = "bg-seafoam text-white";
        } else if (revealed && sel) {
          tone = "bg-sandy-beige/35 ring-2 ring-sandy-beige text-ink";
          dot = "bg-sandy-beige text-deep-ocean";
        } else if (revealed) tone = "bg-white/60 ring-1 ring-ink/5 text-ink/50";
        return (
          <label
            key={String(v)}
            className={`flex min-h-32 flex-col items-center justify-center gap-3 rounded-[1.5rem] p-5 text-xl font-extrabold transition-all duration-200 has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ocean-teal/50 sm:min-h-40 ${
              revealed ? "cursor-default" : "cursor-pointer active:scale-[0.98]"
            } ${tone}`}
          >
            <input
              type="radio"
              name={name}
              data-tf={String(v)}
              className="sr-only"
              checked={sel}
              disabled={revealed}
              onChange={() => onChange({ kind: "truefalse", value: v })}
            />
            <span aria-hidden className={`grid size-12 place-items-center rounded-full ${dot}`}>
              {v ? <IconCheck width={24} height={24} /> : <IconClose width={22} height={22} />}
            </span>
            {v ? t.quiz.true : t.quiz.false}
            {revealed && right && <span className="text-xs font-bold text-[#2f6b64]">{t.quiz.correctAnswer}</span>}
            {revealed && sel && !right && <span className="text-xs font-bold text-deep-ocean/70">{t.quiz.yourPick}</span>}
          </label>
        );
      })}
    </div>
  );
}

/* ---------- fill in the blank ---------- */

function Fill({
  quiz,
  value,
  onChange,
  revealed,
  onSubmit,
  labelId,
}: {
  quiz: Extract<Quiz, { kind: "fill" }>;
  value: string;
  onChange: (a: QuizAnswer) => void;
  revealed: boolean;
  onSubmit?: () => void;
  labelId: string;
}) {
  const t = useT();
  const [before, ...rest] = quiz.question.split("___");
  const after = rest.join("___");
  const ok = quiz.answers.some((a) => normalize(a) === normalize(value));
  const tone = !revealed
    ? "bg-white ring-2 ring-ocean-teal/30 focus:ring-ocean-teal text-ocean-teal"
    : ok
      ? "bg-seafoam/15 ring-2 ring-seafoam text-[#2f6b64]"
      : "bg-sandy-beige/35 ring-2 ring-sandy-beige text-deep-ocean line-through decoration-2";
  const width = Math.max(10, Math.min(18, value.length + 3));
  return (
    <div>
      <p
        id={labelId}
        className="text-[1.55rem] leading-[2.15] font-extrabold tracking-tight text-ink sm:text-[1.85rem]"
      >
        {before}
        <input
          type="text"
          value={value}
          readOnly={revealed}
          aria-label={t.quiz.fillAria}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="done"
          placeholder={t.quiz.fillPlaceholder}
          onChange={(e) => onChange({ kind: "fill", value: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit?.();
            }
          }}
          style={{ width: `${width}ch` }}
          className={`mx-1.5 inline-block h-12 max-w-full rounded-full px-4 text-center align-middle text-[1.2rem] font-extrabold outline-none transition-all placeholder:font-semibold placeholder:text-ink/30 sm:text-[1.35rem] ${tone}`}
        />
        {after}
      </p>
      {revealed && !ok && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-seafoam/15 px-4 py-2 text-[17px] font-bold text-[#2f6b64] ring-2 ring-seafoam">
          <IconCheck width={18} height={18} /> {t.quiz.correctAnswerIs(quiz.answers[0])}
        </p>
      )}
    </div>
  );
}

/* ---------- match pairs ---------- */

const PAIR_TONES = [
  "bg-light-sky text-deep-ocean ring-light-sky",
  "bg-sandy-beige text-deep-ocean ring-sandy-beige",
  "bg-seafoam/45 text-deep-ocean ring-seafoam/60",
  "bg-ocean-teal/20 text-deep-ocean ring-ocean-teal/40",
  "bg-deep-ocean/15 text-deep-ocean ring-deep-ocean/30",
];

type Sel = { side: "left" | "right"; index: number } | null;

function Match({
  quiz,
  value,
  onChange,
  revealed,
}: {
  quiz: Extract<Quiz, { kind: "match" }>;
  value: Record<number, number>;
  onChange: (a: QuizAnswer) => void;
  revealed: boolean;
}) {
  const t = useT();
  const tm = t.quiz.match;
  const order = useMemo(() => stableShuffle(quiz.pairs.length, quiz.question), [quiz]);
  const [sel, setSel] = useState<Sel>(null);
  const leftOf = (pairIdx: number) => {
    const k = Object.keys(value).find((l) => value[Number(l)] === pairIdx);
    return k === undefined ? undefined : Number(k);
  };
  // pair number shown on both sides = position of the left item in the matched order
  const pairNo = (left: number) => {
    const matched = Object.keys(value)
      .map(Number)
      .sort((a, b) => a - b);
    return matched.indexOf(left);
  };

  const link = (left: number, right: number) => {
    const next: Record<number, number> = {};
    for (const [l, r] of Object.entries(value)) if (Number(l) !== left && r !== right) next[Number(l)] = r;
    next[left] = right;
    onChange({ kind: "match", value: next });
    setSel(null);
  };
  const unlinkLeft = (left: number) => {
    const next = { ...value };
    delete next[left];
    onChange({ kind: "match", value: next });
  };

  const tapLeft = (i: number) => {
    if (revealed) return;
    if (sel?.side === "right") return link(i, sel.index);
    if (value[i] !== undefined) unlinkLeft(i);
    setSel(sel?.side === "left" && sel.index === i ? null : { side: "left", index: i });
  };
  const tapRight = (p: number) => {
    if (revealed) return;
    if (sel?.side === "left") return link(sel.index, p);
    const l = leftOf(p);
    if (l !== undefined) unlinkLeft(l);
    setSel(sel?.side === "right" && sel.index === p ? null : { side: "right", index: p });
  };

  if (revealed) {
    return (
      <ul className="flex flex-col gap-3" aria-label={tm.correctPairs}>
        {quiz.pairs.map((p, i) => {
          const ok = value[i] === i;
          return (
            <li
              key={p.left}
              className={`flex items-center gap-3 rounded-[1.25rem] px-4 py-3.5 ring-2 ${
                ok ? "bg-seafoam/15 ring-seafoam" : "bg-sandy-beige/30 ring-sandy-beige"
              }`}
            >
              <span
                aria-hidden
                className={`grid size-8 shrink-0 place-items-center rounded-full ${
                  ok ? "bg-seafoam text-white" : "bg-sandy-beige text-deep-ocean"
                }`}
              >
                {ok ? <IconCheck width={16} height={16} /> : <IconClose width={14} height={14} />}
              </span>
              <span className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                <span className="text-[17px] font-extrabold text-ink">{p.left}</span>
                <span aria-hidden className="hidden text-ink/30 sm:inline">
                  —
                </span>
                <span className="text-[16px] font-semibold text-ink/80">{p.right}</span>
              </span>
              <span className="sr-only">{ok ? tm.matchedOk : tm.matchedDiff}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  const chip = "transition-all duration-200 outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50";
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-4">
      <div>
        <p className="label-mono mb-2.5 text-ink-soft">{tm.words}</p>
        <div className="flex flex-wrap gap-2.5 sm:flex-col">
          {quiz.pairs.map((p, i) => {
            const matched = value[i] !== undefined;
            const active = sel?.side === "left" && sel.index === i;
            const tone = active
              ? "bg-ocean-teal text-white ring-2 ring-ocean-teal shadow-[0_8px_22px_-10px_rgba(30,90,110,0.8)]"
              : matched
                ? `${PAIR_TONES[pairNo(i) % PAIR_TONES.length]} ring-2`
                : "bg-white text-ink ring-1 ring-ink/10 hover:ring-2 hover:ring-ocean-teal/35";
            return (
              <button
                key={p.left}
                type="button"
                onClick={() => tapLeft(i)}
                data-left={i}
                aria-pressed={active}
                aria-label={matched ? tm.matchedWith(p.left, quiz.pairs[value[i]].right) : p.left}
                className={`flex min-h-12 items-center gap-2.5 rounded-full px-4 py-2.5 text-left text-[17px] font-extrabold sm:rounded-[1.25rem] sm:min-h-[3.75rem] ${chip} ${tone}`}
              >
                {matched && !active && (
                  <span aria-hidden className="grid size-6 place-items-center rounded-full bg-white/80 text-xs font-extrabold text-deep-ocean">
                    {pairNo(i) + 1}
                  </span>
                )}
                {p.left}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="label-mono mb-2.5 text-ink-soft">{tm.meanings}</p>
        <div className="flex flex-col gap-2.5">
          {order.map((p) => {
            const l = leftOf(p);
            const matched = l !== undefined;
            const active = sel?.side === "right" && sel.index === p;
            const tone = active
              ? "bg-ocean-teal text-white ring-2 ring-ocean-teal"
              : matched
                ? `${PAIR_TONES[pairNo(l) % PAIR_TONES.length]} ring-2`
                : sel?.side === "left"
                  ? "bg-white text-ink ring-2 ring-ocean-teal/30 hover:ring-ocean-teal"
                  : "bg-white text-ink ring-1 ring-ink/10 hover:ring-2 hover:ring-ocean-teal/35";
            return (
              <button
                key={p}
                type="button"
                onClick={() => tapRight(p)}
                data-right={p}
                aria-pressed={active}
                aria-label={matched ? tm.matchedWith(quiz.pairs[p].right, quiz.pairs[l].left) : quiz.pairs[p].right}
                className={`flex min-h-[3.25rem] items-center gap-3 rounded-[1.25rem] px-4 py-3 text-left text-[16px] font-semibold sm:min-h-[3.75rem] sm:text-[17px] ${chip} ${tone}`}
              >
                <span
                  aria-hidden
                  className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
                    matched ? "bg-white/80 text-deep-ocean" : active ? "bg-white/25" : "bg-foam ring-1 ring-ink/10"
                  }`}
                >
                  {matched ? pairNo(l) + 1 : ""}
                </span>
                {quiz.pairs[p].right}
              </button>
            );
          })}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {sel?.side === "left"
          ? tm.pickedWord(quiz.pairs[sel.index].left)
          : sel?.side === "right"
            ? tm.pickedMeaning(quiz.pairs[sel.index].right)
            : tm.pairsMatched(Object.keys(value).length, quiz.pairs.length)}
      </p>
    </div>
  );
}
