"use client";

// XP + streak chips. Rendered as invisible placeholders until progress is read from
// localStorage, so the server HTML and the first client render match (no hydration mismatch).

import { useT } from "@/i18n";
import { useProgress } from "@/lib/progress";
import { FlameIcon, XpIcon } from "./icons";

type Props = { tone?: "light" | "dark" };

export function StatChips({ tone = "light" }: Props) {
  const { progress, ready } = useProgress();
  const t = useT();
  const chip =
    tone === "dark"
      ? "bg-white/10 text-white/90 ring-1 ring-white/15 backdrop-blur-md"
      : "bg-white text-ink ring-1 ring-deep-ocean/8 shadow-[0_1px_2px_rgba(13,43,69,0.06)]";

  return (
    <div
      className={`flex items-center gap-1.5 transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
      aria-hidden={!ready}
    >
      <span
        className={`inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-sm font-bold tabular-nums ${chip}`}
        title={t.shell.stats.streakTitle}
      >
        <FlameIcon size={15} />
        {progress.streak}
        <span className="sr-only">{t.shell.stats.streakSr(progress.streak)}</span>
      </span>
      <span
        className={`inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-sm font-bold tabular-nums ${chip}`}
        title={t.shell.stats.xpTitle}
      >
        <XpIcon size={14} />
        {progress.xp}
        <span className={tone === "dark" ? "text-white/60 text-xs" : "text-ink-soft text-xs"}>{t.shell.stats.xpUnit}</span>
      </span>
    </div>
  );
}
