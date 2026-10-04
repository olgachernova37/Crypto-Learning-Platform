"use client";

// "New crewmate!" — a partner joining the voyage (end of a lesson, or the finale for Superteam).
import Link from "next/link";
import type { Ally } from "@/content/voyage";
import { useT } from "@/i18n";
import { useProgress } from "@/lib/progress";
import { useVisitedPartners } from "@/components/partners/visited";
import { AllyMark } from "./AllyMark";
import m from "@/components/lesson/motion.module.css";

export function CrewCard({ ally, tone = "light" }: { ally: Ally; tone?: "light" | "dark" }) {
  const t = useT();
  const a = t.voyage.allies[ally.id];
  const { addXp } = useProgress();
  const { markVisited } = useVisitedPartners();
  const dark = tone === "dark";
  const onVisit = () => {
    if (!ally.internal && markVisited(ally.id) && ally.xp) addXp(ally.xp);
  };
  const cta =
    "mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-[16px] font-extrabold transition focus-visible:outline-3 focus-visible:outline-offset-2 " +
    (dark ? "bg-white text-deep-ocean hover:bg-light-sky focus-visible:outline-light-sky" : "bg-deep-ocean text-white hover:bg-ocean-teal focus-visible:outline-ocean-teal/50");

  return (
    <section
      aria-label={a.joins}
      className={`w-full max-w-md rounded-[1.75rem] p-5 text-left sm:p-6 ${
        dark ? "bg-white/8 text-white ring-1 ring-light-sky/20" : "bg-white text-ink shadow-[0_18px_44px_-26px_rgba(13,43,69,0.5)] ring-1 ring-ink/6"
      } ${m.pop}`}
    >
      <span className={`inline-flex rounded-full px-3 py-1 text-[13px] font-extrabold ${dark ? "bg-[#8ff0c4]/20 text-[#8ff0c4]" : "bg-seafoam/20 text-[#2f6b64]"}`}>
        ⚓ {t.voyage.crew.newCrewmate}
      </span>
      <div className="mt-3 flex items-center gap-4">
        <AllyMark ally={ally} alt={t.voyage.crew.logoAlt(ally.brand)} />
        <div className="min-w-0">
          <p className="text-[19px] leading-tight font-extrabold">{a.joins}</p>
          <p className={`mt-0.5 text-[14px] font-bold ${dark ? "text-light-sky/80" : "text-ocean-teal"}`}>
            {ally.brand} · {a.role}
          </p>
        </div>
      </div>
      <p className={`mt-3 text-[16px] leading-relaxed ${dark ? "text-light-sky/85" : "text-ink-soft"}`}>{a.line}</p>
      {ally.internal ? (
        <Link href={ally.href} className={cta}>
          {a.cta} <span aria-hidden>→</span>
        </Link>
      ) : (
        <a href={ally.href} target="_blank" rel="noopener noreferrer" onClick={onVisit} className={cta}>
          {a.cta} <span aria-hidden>↗</span>
          <span className="sr-only">{t.partners.page.opensInNewTab}</span>
        </a>
      )}
    </section>
  );
}
