"use client";

// "Trusted Harbors": our recommended partners. Partners don't reward our learners directly,
// so we reward the step ourselves (XP and badges), once per partner.

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { CheckIcon, ExternalIcon } from "@/components/shell/icons";
import { useVisitedPartners } from "./visited";
import { Guides } from "./Guides";
import { useT } from "@/i18n";
import type { Dict } from "@/i18n/ui/en";
import { ALLIES, allyJoined } from "@/content/voyage";
import { lessonNum } from "@/content/lessons";
import { useLessons } from "@/i18n/lessons";
import { AllyMark } from "@/components/voyage/AllyMark";

type Partner = {
  id: "marinade" | "superteam" | "phantom" | "bybit" | "trezor"; // also the key in t.partners.cards
  emoji: string;
  /** Brand name; a translated name in t.partners.cards[id].name wins when present */
  name: string;
  xp: number;
  href: string;
  internal?: boolean; // an in-app quest instead of an external link
  tile: string;
};

// Same order as the voyage: each partner meets the learner at the stop where its topic is taught.
const PARTNERS: Partner[] = [
  { id: "phantom", emoji: "👻", name: "Phantom Wallet", xp: 100, href: "https://phantom.com/download", tile: "bg-light-sky/55" },
  { id: "bybit", emoji: "💳", name: "Bybit EU", xp: 50, href: "https://www.bybit.eu", tile: "bg-deep-ocean/10" },
  { id: "marinade", emoji: "💧", name: "Marinade", xp: 0, href: "/partners/marinade", internal: true, tile: "bg-seafoam/20" },
  { id: "trezor", emoji: "🔐", name: "Trezor", xp: 50, href: "https://trezor.io", tile: "bg-light-sky/40" },
  { id: "superteam", emoji: "☀️", name: "Solana Community (Superteam)", xp: 50, href: "https://superteam.fun", tile: "bg-sandy-beige/45" },
];

/** The partner's translated card text. */
function cardText(t: Dict["partners"]["cards"], p: Partner) {
  const c = t[p.id];
  return {
    name: "name" in c ? c.name : p.name,
    tagline: c.tagline,
    line: c.line,
    reward: typeof c.reward === "function" ? c.reward(p.xp) : c.reward,
    cta: c.cta,
    note: "note" in c ? c.note : undefined,
  };
}

export function PartnersView() {
  const { addXp, progress } = useProgress();
  const tt = useT();
  const lessons = useLessons();
  /** "In your crew" or "Joins at Lesson 02" */
  const crewStatus = (id: Partner["id"]) => {
    const a = ALLIES.find((x) => x.id === id)!;
    if (allyJoined(a, progress)) return { joined: true, text: tt.voyage.crew.joined };
    const l = lessons.find((x) => x.id === a.joinsAfter);
    return { joined: false, text: l ? tt.voyage.crew.joinsAt(tt.common.lessonLabel(lessonNum(l.number))) : tt.voyage.crew.joinsAtFinale };
  };
  const { visited, markVisited } = useVisitedPartners();
  const t = useT().partners;

  const onVisit = (p: Partner) => {
    if (p.internal) return;
    if (markVisited(p.id) && p.xp) addXp(p.xp);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-10 sm:px-6 sm:pt-10">
      <header className="max-w-2xl">
        <p className="label-mono text-ocean-teal">{t.page.kicker}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-deep-ocean sm:text-5xl">{t.page.title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-soft">{t.page.intro}</p>
      </header>

      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {PARTNERS.map((p) => {
          const c = cardText(t.cards, p);
          const done = visited.includes(p.internal ? `${p.id}-quest` : p.id);
          const linkClass =
            "flex min-h-12 items-center justify-between gap-3 rounded-full bg-ocean-teal py-1.5 pr-1.5 pl-6 font-bold text-white transition-colors hover:bg-deep-ocean focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal";
          return (
            <li
              key={p.id}
              className="flex flex-col rounded-[1.75rem] bg-white p-6 shadow-[0_1px_2px_rgba(13,43,69,0.04),0_12px_32px_-18px_rgba(13,43,69,0.22)] ring-1 ring-deep-ocean/5 sm:p-7"
            >
              <div className="flex items-center gap-4">
                <AllyMark ally={ALLIES.find((a) => a.id === p.id)!} alt={tt.voyage.crew.logoAlt(p.name)} />
                <div className="min-w-0">
                  <h2 className="text-xl font-extrabold tracking-tight text-deep-ocean sm:text-2xl">{c.name}</h2>
                  <p className="font-semibold text-ocean-teal">{c.tagline}</p>
                </div>
              </div>

              <p className="mt-5 text-lg leading-snug text-ink">{c.line}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {(() => {
                  const st = crewStatus(p.id);
                  return (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-bold ${
                        st.joined ? "bg-seafoam/15 text-[#2f6b64]" : "bg-light-sky/40 text-deep-ocean"
                      }`}
                    >
                      ⚓ {st.text}
                    </span>
                  );
                })()}
                <span className="inline-flex items-center rounded-full bg-sandy-beige/40 px-3 py-1.5 text-sm font-bold text-deep-ocean">
                  {c.reward}
                </span>
                {done && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-seafoam/15 px-3 py-1.5 text-sm font-bold text-[#2f6b64]">
                    <CheckIcon size={14} /> {t.page.rewardEarned}
                  </span>
                )}
              </div>
              {c.note && <p className="mt-2 text-sm text-ink-soft">{c.note}</p>}

              <div className="mt-auto pt-6">
                {p.internal ? (
                  <Link href={p.href} className={linkClass}>
                    <span>{c.cta}</span>
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
                      {c.cta}
                      <span className="sr-only">{t.page.opensInNewTab}</span>
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

      <p className="mt-10 text-center text-sm text-ink-soft">{t.page.disclaimer}</p>
    </main>
  );
}
