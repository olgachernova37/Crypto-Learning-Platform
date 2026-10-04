"use client";

// "On this stop: 👻 Phantom joins your crew!" / "On this stop: 🌀 Boss: the Whirlpool of Hype".
import { ALLIES, allyAfterLesson, bossInLesson } from "@/content/voyage";
import { useT } from "@/i18n";
import { AllyMark } from "./AllyMark";

export function useStopExtra(lessonId: string) {
  const t = useT();
  const ally = allyAfterLesson(lessonId);
  const boss = bossInLesson(lessonId);
  if (boss) return { kind: "boss" as const, emoji: boss.emoji, text: t.voyage.battle.boss(t.voyage.bosses[boss.id].name), ally: undefined };
  if (ally) return { kind: "ally" as const, emoji: ally.emoji, text: t.voyage.allies[ally.id].joins, ally };
  return null;
}

export function StopTeaser({ lessonId, tone = "dark", className = "" }: { lessonId: string; tone?: "dark" | "light"; className?: string }) {
  const t = useT();
  const extra = useStopExtra(lessonId);
  if (!extra) return null;
  const dark = tone === "dark";
  return (
    <p
      className={`inline-flex max-w-full items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-[14px] font-extrabold ${
        dark ? "bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-md" : "bg-light-sky/40 text-deep-ocean"
      } ${className}`}
    >
      {extra.ally ? (
        <AllyMark ally={extra.ally} size={30} alt={t.voyage.crew.logoAlt(extra.ally.brand)} />
      ) : (
        <span aria-hidden className="grid size-[30px] shrink-0 place-items-center rounded-full bg-[#b9a2ff]/30 text-[17px]">
          {extra.emoji}
        </span>
      )}
      <span className="min-w-0">
        <span className={dark ? "text-light-sky/80" : "text-ocean-teal"}>{t.voyage.crew.onThisStop}: </span>
        {extra.text}
      </span>
    </p>
  );
}

export { ALLIES };
