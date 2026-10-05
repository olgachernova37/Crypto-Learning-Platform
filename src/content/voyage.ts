// The crew: partners join the voyage at the stop where their topic is taught, in route order,
// so nobody shows up before the learner knows what they do. Text lives in t.voyage.allies[id].
//
//   02 Wallet   → 👻 Phantom joins the crew (keeper of keys)
//   05 Swap     → 💳 Bybit EU harbor (where euros become crypto)
//   06 Staking  → 💧 Marinade lighthouse (stake + mSOL, the practice quest)
//   08 Memecoins→ 🌀 boss: the Whirlpool of Hype      (lesson step, see lesson-7.ts)
//   09 Scams    → 🧜 boss: the Island of Sirens       (lesson step, see lesson-8.ts)
//   10 Vault    → 🔐 Trezor, the vault for your savings (hot vs cold wallet)
//   Finale      → ☀️ Superteam welcomes you ashore (community)
//
// Logos: drop the partner's official file into public/partners/<id>.(svg|png) and set `logo`.

import type { BossId } from "./types";

export type AllyId = "phantom" | "bybit" | "marinade" | "trezor" | "superteam";
export type Ally = {
  id: AllyId;
  /** joins after this lesson is finished; "finale" = after the NFT */
  joinsAfter: string | "finale";
  emoji: string;
  /** brand name, never translated */
  brand: string;
  href: string;
  internal?: boolean;
  logo?: string;
  /** XP for visiting the partner the first time (from the partners page / crew card) */
  xp: number;
  tile: string;
};

export const ALLIES: Ally[] = [
  { id: "phantom", joinsAfter: "your-first-wallet", emoji: "👻", brand: "Phantom", href: "https://phantom.com/download", xp: 100, tile: "bg-light-sky/55" },
  { id: "bybit", joinsAfter: "your-first-swap", emoji: "💳", brand: "Bybit EU", href: "https://www.bybit.eu", xp: 50, tile: "bg-deep-ocean/10" },
  { id: "marinade", joinsAfter: "staking", emoji: "💧", brand: "Marinade", href: "/partners/marinade", internal: true, xp: 0, tile: "bg-seafoam/20" },
  { id: "trezor", joinsAfter: "treasure-vault", emoji: "🔐", brand: "Trezor", href: "https://trezor.io", xp: 50, tile: "bg-light-sky/40" },
  { id: "superteam", joinsAfter: "finale", emoji: "☀️", brand: "Superteam", href: "https://superteam.fun", xp: 50, tile: "bg-sandy-beige/45" },
];

export const BOSSES: { id: BossId; lessonId: string; emoji: string }[] = [
  { id: "hype-whirlpool", lessonId: "memecoins", emoji: "🌀" },
  { id: "siren-island", lessonId: "spot-the-scam", emoji: "🧜" },
];

export const allyAfterLesson = (lessonId: string) => ALLIES.find((a) => a.joinsAfter === lessonId);
export const bossInLesson = (lessonId: string) => BOSSES.find((b) => b.lessonId === lessonId);

/** Has this ally joined the crew yet? */
export function allyJoined(a: Ally, p: { completedLessons: string[]; nftClaimed: boolean }) {
  return a.joinsAfter === "finale" ? p.nftClaimed : p.completedLessons.includes(a.joinsAfter);
}
