"use client";

// "We recommend": a short, calm list of partners. Partners give no bonus for our product, so we
// reward the step ourselves: visiting a partner from here gives +20 XP, once per partner.

import { useProgress } from "@/lib/progress";
import { CheckIcon, ExternalIcon, XpIcon } from "@/components/shell/icons";
import { useVisitedPartners } from "./visited";

const VISIT_XP = 20;

type Partner = {
  id: string;
  name: string;
  initial: string;
  kind: string;
  line: string;
  detail: string;
  href: string;
  host: string;
  tile: string; // logo tile colours
  bonus?: { label: string; note: string };
};

const PARTNERS: Partner[] = [
  {
    id: "marinade",
    name: "Marinade",
    initial: "M",
    kind: "Staking on Solana",
    line: "Let your SOL work for you by staking it — Marinade does the technical part.",
    detail:
      "Staking is a bit like a savings account: you lend your coins to help run the network, and you get a small reward back over time.",
    href: "https://marinade.finance",
    host: "marinade.finance",
    tile: "bg-seafoam text-white",
    bonus: { label: "Sign-up bonus: $10", note: "Check current terms on their site." },
  },
  {
    id: "trezor",
    name: "Trezor",
    initial: "T",
    kind: "Hardware wallet",
    line: "A small device that keeps your keys offline — the safest home for savings.",
    detail:
      "Think of it as a little safe you keep in a drawer: even if your phone or laptop gets a virus, your keys never leave the device.",
    href: "https://trezor.io",
    host: "trezor.io",
    tile: "bg-deep-ocean text-sandy-beige",
  },
];

export function PartnersView() {
  const { addXp } = useProgress();
  const { visited, markVisited } = useVisitedPartners();
  const visitedCount = PARTNERS.filter((p) => visited.includes(p.id)).length;

  const onVisit = (id: string) => {
    if (markVisited(id)) addXp(VISIT_XP);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10">
      <header className="max-w-2xl">
        <p className="label-mono text-ocean-teal">Partners</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-deep-ocean sm:text-5xl">
          We recommend
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-soft">
          Trusted places to take your next step — when you&apos;re ready, and never with more than you
          can afford to lose.
        </p>
      </header>

      {/* Our own reward for following a recommendation. */}
      <section
        aria-labelledby="reward-title"
        className="mt-8 flex items-start gap-4 rounded-[1.5rem] bg-sandy-beige/35 p-5 ring-1 ring-sandy-beige/60 sm:items-center sm:p-6"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white" aria-hidden>
          <XpIcon size={26} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="reward-title" className="text-lg font-extrabold text-deep-ocean">
            Visit a partner from here and earn +{VISIT_XP} XP
          </h2>
          <p className="text-[0.95rem] text-ink-soft">
            Just having a look counts — you don&apos;t need to sign up or buy anything.
          </p>
          <p className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-sm font-bold text-ocean-teal sm:hidden">
            {visitedCount} / {PARTNERS.length} visited
          </p>
        </div>
        <p className="hidden shrink-0 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-ocean-teal sm:block">
          {visitedCount} / {PARTNERS.length} visited
        </p>
      </section>

      <ul className="mt-6 grid gap-5 md:grid-cols-2">
        {PARTNERS.map((p) => {
          const done = visited.includes(p.id);
          return (
            <li
              key={p.id}
              className="flex flex-col rounded-[1.75rem] bg-white p-6 shadow-[0_1px_2px_rgba(13,43,69,0.04),0_12px_32px_-18px_rgba(13,43,69,0.22)] ring-1 ring-deep-ocean/5 sm:p-7"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`grid size-14 shrink-0 place-items-center rounded-[1.1rem] text-2xl font-black ${p.tile}`}
                  aria-hidden
                >
                  {p.initial}
                </span>
                <div className="min-w-0">
                  <h2 className="text-2xl font-extrabold tracking-tight text-deep-ocean">{p.name}</h2>
                  <p className="label-mono text-ink-soft">{p.kind}</p>
                </div>
              </div>

              <p className="mt-5 text-lg font-semibold leading-snug text-ink">{p.line}</p>
              <p className="mt-2 leading-relaxed text-ink-soft">{p.detail}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {p.bonus && (
                  <span className="inline-flex items-center rounded-full bg-light-sky/45 px-3 py-1.5 text-sm font-bold text-ocean-teal">
                    {p.bonus.label}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold ${
                    done ? "bg-seafoam/15 text-seafoam" : "bg-foam text-ink-soft"
                  }`}
                >
                  {done ? (
                    <>
                      <CheckIcon size={14} /> +{VISIT_XP} XP earned
                    </>
                  ) : (
                    <>+{VISIT_XP} XP for a visit</>
                  )}
                </span>
              </div>
              {p.bonus && <p className="mt-2 text-sm text-ink-soft">{p.bonus.note}</p>}

              <div className="mt-auto pt-6">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onVisit(p.id)}
                  onAuxClick={(e) => e.button === 1 && onVisit(p.id)}
                  className="flex min-h-12 items-center justify-between gap-3 rounded-full bg-ocean-teal py-1.5 pl-6 pr-1.5 font-bold text-white transition-colors hover:bg-deep-ocean focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal"
                >
                  <span>
                    Visit {p.host}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                  <span className="grid size-9 place-items-center rounded-full bg-white/15" aria-hidden>
                    <ExternalIcon size={18} />
                  </span>
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-center text-sm text-ink-soft">
        Not financial advice. Crypto is risky.      </p>
    </main>
  );
}
