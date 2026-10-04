"use client";

// Interactive quest: stake 1 practice SOL "with Marinade" in the training wallet, verify, claim a
// practice Starfish NFT. A simulation until real devnet staking is wired up — and it says so.

import Link from "next/link";
import { useEffect, useState } from "react";
import { describeTx, useTrainingWallet, shortAddr } from "@/lib/training-wallet";
import { useProgress } from "@/lib/progress";
import { useVisitedPartners } from "./visited";
import { useT } from "@/i18n";

const QUEST_ID = "marinade-quest";
const QUEST_XP = 50;

export function MarinadeQuest() {
  const { wallet, sol, ensure, stake } = useTrainingWallet();
  const { addXp } = useProgress();
  const { visited, markVisited } = useVisitedPartners();
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState(false);
  const t = useT();
  const q = t.partners.quest;
  const b = (text: string) => (
    <strong key={text} className="text-ink">
      {text}
    </strong>
  );

  useEffect(() => {
    ensure();
  }, [ensure]);

  const stakeTx = wallet?.txs.find((t) => t.kind === "stake") ?? null;
  const claimed = visited.includes(QUEST_ID);

  const doStake = async () => {
    setBusy(true);
    await stake(1);
    setBusy(false);
  };

  const claim = () => {
    if (markVisited(QUEST_ID)) addXp(QUEST_XP);
  };

  const step = (n: number, title: string, done: boolean, body: React.ReactNode) => (
    <li className="rounded-[1.5rem] bg-white p-5 ring-1 ring-deep-ocean/5 sm:p-6">
      <div className="flex items-center gap-3">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full font-extrabold ${
            done ? "bg-seafoam text-white" : "bg-light-sky/60 text-deep-ocean"
          }`}
        >
          {done ? "✓" : n}
        </span>
        <h3 className="text-lg font-extrabold text-deep-ocean">{title}</h3>
      </div>
      <div className="mt-4">{body}</div>
    </li>
  );

  const btn =
    "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-[16px] font-extrabold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50 sm:w-auto disabled:opacity-50";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-10 sm:px-6 sm:pt-10">
      <Link href="/partners" className="text-sm font-bold text-ocean-teal hover:underline">
        {q.back}
      </Link>
      <p className="label-mono mt-6 text-ocean-teal">{q.kicker}</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-deep-ocean sm:text-5xl">{q.title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-soft">{q.welcome}</p>

      <section className="mt-6 rounded-[1.5rem] bg-sandy-beige/35 p-5 sm:p-6">
        <p className="font-extrabold text-deep-ocean">{q.conceptTitle}</p>
        <p className="mt-2 leading-relaxed text-ink">{q.concept((text) => <strong key={text}>{text}</strong>)}</p>
      </section>

      <ol className="mt-6 flex flex-col gap-4">
        {step(
          1,
          q.step1.title,
          !!stakeTx,
          stakeTx ? (
            <p className="text-ink-soft">{q.step1.done(b, wallet ? shortAddr(wallet.address) : null)}</p>
          ) : (
            <>
              <p className="mb-4 text-ink-soft">
                {q.step1.balance(sol === null ? "…" : String(Math.round(sol * 1000) / 1000))}
              </p>
              <button type="button" onClick={doStake} disabled={busy} className={`${btn} bg-ocean-teal text-white hover:bg-deep-ocean`}>
                {busy ? q.step1.staking : q.step1.stake}
              </button>
            </>
          ),
        )}
        {step(
          2,
          q.step2.title,
          verified,
          verified && stakeTx ? (
            <p className="text-ink-soft">
              {q.step2.done(
                b,
                describeTx(stakeTx, t.wallet),
                stakeTx.feeSol,
                <span key="sig" className="font-mono">
                  {stakeTx.signature.slice(0, 6)}…{stakeTx.signature.slice(-6)}
                </span>,
              )}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setVerified(true)}
              disabled={!stakeTx}
              className={`${btn} bg-deep-ocean text-white hover:bg-ocean-teal`}
            >
              {q.step2.verify}
            </button>
          ),
        )}
        {step(
          3,
          q.step3.title,
          claimed,
          claimed ? (
            <p className="text-ink-soft">{q.step3.done(QUEST_XP)}</p>
          ) : (
            <button
              type="button"
              onClick={claim}
              disabled={!verified}
              className={`${btn} bg-sandy-beige text-deep-ocean hover:-translate-y-0.5`}
            >
              {q.step3.claim}
            </button>
          ),
        )}
      </ol>

      <p className="mt-8 text-sm leading-relaxed text-ink-soft">
        {q.realThing(
          <a
            key="link"
            href="https://marinade.finance"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-ocean-teal underline"
          >
            marinade.finance
          </a>,
        )}
      </p>
    </main>
  );
}
