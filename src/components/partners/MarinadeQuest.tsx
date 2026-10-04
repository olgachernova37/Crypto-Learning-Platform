"use client";

// Interactive quest: stake 1 practice SOL "with Marinade" in the training wallet, verify, claim a
// practice Starfish NFT. A simulation until real devnet staking is wired up — and it says so.

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTrainingWallet, shortAddr } from "@/lib/training-wallet";
import { useProgress } from "@/lib/progress";
import { useVisitedPartners } from "./visited";

const QUEST_ID = "marinade-quest";
const QUEST_XP = 50;

export function MarinadeQuest() {
  const { wallet, sol, ensure, stake } = useTrainingWallet();
  const { addXp } = useProgress();
  const { visited, markVisited } = useVisitedPartners();
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState(false);

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
        ← Trusted harbors
      </Link>
      <p className="label-mono mt-6 text-ocean-teal">Interactive quest · Practice</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-deep-ocean sm:text-5xl">💧 Marinade staking</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-soft">Welcome to your first real-world simulation!</p>

      <section className="mt-6 rounded-[1.5rem] bg-sandy-beige/35 p-5 sm:p-6">
        <p className="font-extrabold text-deep-ocean">The concept</p>
        <p className="mt-2 leading-relaxed text-ink">
          Imagine a traditional savings account: you put your money there, and it gives you a little extra over time.
          In crypto, this is called <strong>staking</strong>. Marinade puts your coins to work helping run the Solana
          network, so they can slowly grow while you sleep. (Like any investment, rewards aren&apos;t guaranteed.)
        </p>
      </section>

      <ol className="mt-6 flex flex-col gap-4">
        {step(
          1,
          "Deposit 1 practice SOL",
          !!stakeTx,
          stakeTx ? (
            <p className="text-ink-soft">
              Done! You received <strong className="text-ink">1 mSOL</strong>, Marinade&apos;s &ldquo;staked SOL&rdquo;
              receipt token, in your training wallet{wallet ? ` (${shortAddr(wallet.address)})` : ""}.
            </p>
          ) : (
            <>
              <p className="mb-4 text-ink-soft">
                Your training wallet has {sol === null ? "…" : Math.round(sol * 1000) / 1000} SOL. Let&apos;s practise
                staking 1 of them (a simulation: no coins actually move).
              </p>
              <button type="button" onClick={doStake} disabled={busy} className={`${btn} bg-ocean-teal text-white hover:bg-deep-ocean`}>
                {busy ? "Staking…" : "Stake 1 practice SOL"}
              </button>
            </>
          ),
        )}
        {step(
          2,
          "Verify it onchain",
          verified,
          verified && stakeTx ? (
            <p className="text-ink-soft">
              ✓ Receipt found: <strong className="text-ink">{stakeTx.label}</strong>, fee {stakeTx.feeSol} SOL,
              signature <span className="font-mono">{stakeTx.signature.slice(0, 6)}…{stakeTx.signature.slice(-6)}</span>.
              (Practice receipt: real Solana Explorer links come with the devnet wallet.)
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setVerified(true)}
              disabled={!stakeTx}
              className={`${btn} bg-deep-ocean text-white hover:bg-ocean-teal`}
            >
              🔍 Verify it onchain
            </button>
          ),
        )}
        {step(
          3,
          "Claim your reward",
          claimed,
          claimed ? (
            <p className="text-ink-soft">
              ⭐️ Your Starfish (practice NFT) is in your backpack, and +{QUEST_XP} XP is yours!
            </p>
          ) : (
            <button
              type="button"
              onClick={claim}
              disabled={!verified}
              className={`${btn} bg-sandy-beige text-deep-ocean hover:-translate-y-0.5`}
            >
              🎁 Claim reward (Starfish NFT)
            </button>
          ),
        )}
      </ol>

      <p className="mt-8 text-sm leading-relaxed text-ink-soft">
        Want to see the real thing? Visit{" "}
        <a href="https://marinade.finance" target="_blank" rel="noopener noreferrer" className="font-bold text-ocean-teal underline">
          marinade.finance
        </a>
        . Their $10 sign-up bonus is their own offer — check current terms on their site. Not financial advice.
      </p>
    </main>
  );
}
