"use client";

// "Trusted Harbors": our recommended partners. Partners don't reward our learners directly,
// so we reward the step ourselves (XP and badges), once per partner.

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { CheckIcon, ExternalIcon } from "@/components/shell/icons";
import { useVisitedPartners } from "./visited";
import { Guides } from "./Guides";

type Partner = {
  id: string;
  emoji: string;
  name: string;
  tagline: string;
  line: string;
  reward: string;
  xp: number;
  cta: string;
  href: string;
  internal?: boolean; // an in-app quest instead of an external link
  tile: string;
  note?: string;
};

const PARTNERS: Partner[] = [
  {
    id: "marinade",
    emoji: "💧",
    name: "Marinade",
    tagline: "Your digital savings account",
    line: "A simple, safe way to let your crypto grow peacefully while you sleep.",
    reward: "⭐️ Starfish NFT (practice) + Marinade's $10 sign-up bonus",
    xp: 0,
    cta: "Start the staking quest",
    href: "/partners/marinade",
    internal: true,
    tile: "bg-seafoam/20",
    note: "The $10 bonus is Marinade's own offer for real sign-ups. Check current terms on their site.",
  },
  {
    id: "superteam",
    emoji: "☀️",
    name: "Solana Community (Superteam)",
    tagline: "The friendly global family behind our network",
    line: "Crypto is better together! Discover free events and meet new friends who are also learning.",
    reward: "🌟 +50 XP",
    xp: 50,
    cta: "Explore the Solana community",
    href: "https://superteam.fun",
    tile: "bg-sandy-beige/45",
  },
  {
    id: "phantom",
    emoji: "👻",
    name: "Phantom Wallet",
    tagline: "Your real everyday digital backpack",
    line: "Ready to graduate from our training wallet? Get the official app to carry your digital treasures safely every day.",
    reward: "🛡️ \"True Owner\" badge + 100 XP",
    xp: 100,
    cta: "Set up your Phantom wallet",
    href: "https://phantom.com/download",
    tile: "bg-light-sky/55",
  },
  {
    id: "bybit",
    emoji: "💳",
    name: "Bybit EU",
    tagline: "Your friendly currency exchange",
    line: "Ready to try real coins? Exchange your regular money (with a bank card) for crypto to start your journey.",
    reward: "🎟️ +50 XP",
    xp: 50,
    cta: "Visit Bybit EU",
    href: "https://www.bybit.eu",
    tile: "bg-deep-ocean/10",
  },
];

export function PartnersView() {
  const { addXp } = useProgress();
  const { visited, markVisited } = useVisitedPartners();

  const onVisit = (p: Partner) => {
    if (p.internal) return;
    if (markVisited(p.id) && p.xp) addXp(p.xp);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-10 sm:px-6 sm:pt-10">
      <header className="max-w-2xl">
        <p className="label-mono text-ocean-teal">We recommend</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-deep-ocean sm:text-5xl">🧭 Trusted harbors</h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-soft">
          We&apos;ve picked the safest and friendliest places to help you on your future journey. Tap any of our
          trusted friends to see how they can help.
        </p>
      </header>

      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {PARTNERS.map((p) => {
          const done = visited.includes(p.internal ? `${p.id}-quest` : p.id);
          const linkClass =
            "flex min-h-12 items-center justify-between gap-3 rounded-full bg-ocean-teal py-1.5 pr-1.5 pl-6 font-bold text-white transition-colors hover:bg-deep-ocean focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal";
          return (
            <li
              key={p.id}
              className="flex flex-col rounded-[1.75rem] bg-white p-6 shadow-[0_1px_2px_rgba(13,43,69,0.04),0_12px_32px_-18px_rgba(13,43,69,0.22)] ring-1 ring-deep-ocean/5 sm:p-7"
            >
              <div className="flex items-center gap-4">
                <span className={`grid size-14 shrink-0 place-items-center rounded-[1.1rem] text-3xl ${p.tile}`} aria-hidden>
                  {p.emoji}
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl font-extrabold tracking-tight text-deep-ocean sm:text-2xl">{p.name}</h2>
                  <p className="font-semibold text-ocean-teal">{p.tagline}</p>
                </div>
              </div>

              <p className="mt-5 text-lg leading-snug text-ink">{p.line}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-sandy-beige/40 px-3 py-1.5 text-sm font-bold text-deep-ocean">
                  {p.reward}
                </span>
                {done && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-seafoam/15 px-3 py-1.5 text-sm font-bold text-[#2f6b64]">
                    <CheckIcon size={14} /> Reward earned
                  </span>
                )}
              </div>
              {p.note && <p className="mt-2 text-sm text-ink-soft">{p.note}</p>}

              <div className="mt-auto pt-6">
                {p.internal ? (
                  <Link href={p.href} className={linkClass}>
                    <span>{p.cta}</span>
                    <span className="grid size-9 place-items-center rounded-full bg-white/15 text-lg" aria-hidden>
                      ➔
                    </span>
                  </Link>
                ) : (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onVisit(p)}
                    onAuxClick={(e) => e.button === 1 && onVisit(p)}
                    className={linkClass}
                  >
                    <span>
                      {p.cta}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    <span className="grid size-9 place-items-center rounded-full bg-white/15" aria-hidden>
                      <ExternalIcon size={18} />
                    </span>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <Guides />

      <p className="mt-10 text-center text-sm text-ink-soft">
        We provide educational maps, not financial advice. Crypto is risky — start small.
      </p>
    </main>
  );
}
