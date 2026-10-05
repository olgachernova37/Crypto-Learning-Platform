"use client";

// Boss battle: a few quick rounds in a night-sea arena. No lives for the learner (house rule):
// every answer lands a hit, right answers hit harder, wrong ones show the right answer + why.
// The boss always ends up beaten; the score counts perfect hits.

import { useState } from "react";
import type { Boss } from "@/content/types";
import { useT } from "@/i18n";
import { useProgress } from "@/lib/progress";
import { ALLIES, allyJoined } from "@/content/voyage";
import { QuizView } from "@/components/quiz/QuizView";
import { QuizFeedback } from "@/components/quiz/QuizFeedback";
import { emptyAnswer, isCorrect, isReady, type QuizAnswer } from "@/components/quiz/logic";
import m from "./motion.module.css";
import s from "./boss.module.css";

export const ROUND_XP = 10;

type Round = { answer: QuizAnswer; correct: boolean };

export function BossBattle({ boss, won, onWin, onXp }: { boss: Boss; won: boolean; onWin: (hits: number) => void; onXp: (xp: number) => void }) {
  const t = useT();
  const tb = t.voyage.battle;
  const name = t.voyage.bosses[boss.id].name;
  const { progress } = useProgress();
  const phantom = ALLIES.find((a) => a.id === "phantom")!;
  const hasShield = boss.id === "siren-island" && allyJoined(phantom, progress);

  const [i, setI] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [draft, setDraft] = useState<QuizAnswer | null>(null);
  const [shield, setShield] = useState(false);
  const [hitKey, setHitKey] = useState(0);

  const total = boss.rounds.length;
  const round = boss.rounds[i];
  const done = rounds[i];
  const answer = done?.answer ?? draft ?? emptyAnswer(round);
  const hits = rounds.filter((r) => r.correct).length;
  // right answer = a full hit, wrong answer = a smaller one; after the last round the boss is down either way
  const dealt = rounds.reduce((d, r) => d + (r.correct ? 1 : 0.6), 0);
  const shownPower = won || rounds.length === total ? 0 : Math.max(0, 1 - dealt / total);

  const strike = () => {
    if (done || !isReady(round, answer)) return;
    const correct = isCorrect(round, answer);
    setRounds((r) => {
      const next = [...r];
      next[i] = { answer, correct };
      return next;
    });
    setHitKey((k) => k + 1);
    onXp(correct ? ROUND_XP : Math.round(ROUND_XP / 2));
  };

  const next = () => {
    setDraft(null);
    setShield(false);
    if (i + 1 < total) setI(i + 1);
    else onWin(hits);
  };

  return (
    <section aria-label={tb.boss(name)} data-testid="boss" data-won={won} className={`mt-6 overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#0f3350_0%,#081c2e_100%)] text-white shadow-[0_30px_70px_-30px_rgba(8,28,46,0.9)] ${m.fadeUp}`}>
      {/* arena */}
      <div className="relative px-5 pt-5 sm:px-7">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[15px] font-extrabold text-light-sky">{tb.boss(name)}</p>
          {!won && <p className="text-[13px] font-bold text-light-sky/70">{tb.round(Math.min(i + 1, total), total)}</p>}
        </div>
        <div className="mt-3" aria-label={`${tb.power}: ${Math.round(shownPower * 100)}%`} role="img">
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#b9a2ff,#ff8fb1)] transition-[width] duration-700 ease-out"
              style={{ width: `${shownPower * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-[12px] font-bold text-light-sky/60">{tb.power}</p>
        </div>
        <div key={hitKey} className={`relative mx-auto my-2 h-40 w-full max-w-xs sm:h-48 ${hitKey ? s.hit : ""} ${won ? s.gone : ""}`}>
          <BossArt id={boss.id} />
        </div>
      </div>

      {/* rounds */}
      <div className="m-3 rounded-[1.5rem] bg-white p-5 text-ink sm:m-4 sm:p-6">
        {won ? (
          <div className={`text-center ${m.pop}`}>
            <p className="text-4xl" aria-hidden>
              🏆
            </p>
            <p className="mt-2 text-2xl font-extrabold">{tb.victoryTitle(name)}</p>
            <p className="mt-2 text-[17px] leading-relaxed text-ink-soft">{t.voyage.bosses[boss.id].victory}</p>
            {rounds.length > 0 && <p className="mt-3 text-[15px] font-bold text-ocean-teal">{tb.perfectHits(hits, total)}</p>}
          </div>
        ) : (
          <div key={i}>
            <QuizView quiz={round} answer={answer} onChange={setDraft} revealed={!!done} onSubmit={strike} />
            {hasShield && round.hint && !done && (
              <div className="mt-4">
                {shield ? (
                  <p className={`rounded-[1.1rem] bg-light-sky/35 px-4 py-3 text-[16px] leading-relaxed ${m.fadeUp}`}>
                    <span className="font-extrabold text-ocean-teal">🛡️ {tb.shieldHint}: </span>
                    {round.hint}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShield(true)}
                    data-testid="boss-shield"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-light-sky/40 px-4 text-[15px] font-extrabold text-deep-ocean transition hover:bg-light-sky/60 focus-visible:outline-3 focus-visible:outline-ocean-teal/50"
                  >
                    🛡️ {tb.shield}
                  </button>
                )}
              </div>
            )}
            {done && <QuizFeedback quiz={round} correct={done.correct} xp={done.correct ? ROUND_XP : Math.round(ROUND_XP / 2)} />}
            <button
              type="button"
              onClick={done ? next : strike}
              data-testid="boss-action"
              disabled={!done && !isReady(round, answer)}
              className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-deep-ocean px-6 text-[17px] font-extrabold text-white transition hover:bg-ocean-teal focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50 disabled:bg-ink/12 disabled:text-ink/40"
            >
              {done ? (i + 1 < total ? tb.nextRound : tb.finish) : `⚔️ ${tb.strike}`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/** Our own drawings: a spinning whirlpool, or a rocky island with a singing siren. */
function BossArt({ id }: { id: Boss["id"] }) {
  if (id === "hype-whirlpool")
    return (
      <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="wp-g" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#2b1666" />
            <stop offset="0.55" stopColor="#5b6ee8" stopOpacity="0.7" />
            <stop offset="1" stopColor="#7ee0f0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="120" cy="88" rx="112" ry="56" fill="url(#wp-g)" />
        <g className={s.spin} style={{ transformOrigin: "120px 88px" }} fill="none" strokeLinecap="round">
          {[100, 80, 60, 42, 26].map((r, k) => (
            <path
              key={r}
              d={`M${120 - r} 88 a ${r} ${r * 0.48} 0 1 1 ${r * 1.7} ${r * 0.2}`}
              stroke={k % 2 ? "#b9a2ff" : "#7ee0f0"}
              strokeOpacity={0.35 + k * 0.12}
              strokeWidth={4 - k * 0.4}
            />
          ))}
        </g>
        {/* rockets and coins being sucked in */}
        <g className={s.orbit} style={{ transformOrigin: "120px 88px" }}>
          <text x="196" y="66" fontSize="20">🚀</text>
          <text x="30" y="120" fontSize="18">🪙</text>
          <text x="150" y="140" fontSize="16">📈</text>
        </g>
        <circle cx="104" cy="82" r="5" fill="#fff" />
        <circle cx="136" cy="82" r="5" fill="#fff" />
        <circle cx="105" cy="83" r="2.4" fill="#0d2b45" />
        <circle cx="137" cy="83" r="2.4" fill="#0d2b45" />
        <path d="M108 98 q12 8 24 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <ellipse cx="120" cy="140" rx="110" ry="14" fill="#7ee0f0" opacity="0.18" />
      <path d="M40 140 C 52 102, 86 92, 104 98 C 118 70, 150 66, 170 92 C 190 96, 206 118, 208 140 Z" fill="#3b4a5e" />
      <path d="M70 140 C 80 116, 104 108, 120 114 C 134 96, 160 98, 172 118 C 182 122, 190 130, 192 140 Z" fill="#53647a" />
      <g className={s.sway} style={{ transformOrigin: "128px 96px" }}>
        <text x="94" y="108" fontSize="60">🧜‍♀️</text>
      </g>
      <g className={s.notes}>
        <text x="60" y="60" fontSize="18" fill="#ff8fb1">♪</text>
        <text x="176" y="48" fontSize="22" fill="#b9a2ff">♫</text>
        <text x="40" y="96" fontSize="16" fill="#7ee0f0">♪</text>
        <text x="194" y="86" fontSize="16" fill="#ff8fb1">♪</text>
      </g>
    </svg>
  );
}
