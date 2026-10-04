"use client";

// "Your crew": the partners in route order — joined ones in full colour, the rest waiting at their stop.
import { ALLIES, allyJoined } from "@/content/voyage";
import { lessonNum } from "@/content/lessons";
import { useT } from "@/i18n";
import { useLessons } from "@/i18n/lessons";
import { useProgress } from "@/lib/progress";
import { AllyMark } from "./AllyMark";

export function CrewList() {
  const t = useT();
  const v = t.voyage;
  const lessons = useLessons();
  const { progress } = useProgress();
  const joined = ALLIES.filter((a) => allyJoined(a, progress)).length;

  return (
    <section aria-labelledby="crew-title" className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <h2 id="crew-title" className="text-2xl font-extrabold tracking-tight text-deep-ocean">
          ⚓ {v.crew.title}
        </h2>
        <p className="text-sm font-bold text-ink-soft">
          {joined} / {ALLIES.length}
        </p>
      </div>
      {joined === 0 && <p className="mt-2 text-[16px] text-ink-soft">{v.crew.empty}</p>}
      <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {ALLIES.map((a) => {
          const isIn = allyJoined(a, progress);
          const lesson = lessons.find((l) => l.id === a.joinsAfter);
          const where = lesson ? v.crew.joinsAt(t.common.lessonLabel(lessonNum(lesson.number))) : v.crew.joinsAtFinale;
          return (
            <li
              key={a.id}
              className={`flex flex-col items-center gap-2 rounded-[1.5rem] p-4 text-center ring-1 transition ${
                isIn ? "bg-white ring-deep-ocean/8 shadow-[0_12px_30px_-22px_rgba(13,43,69,0.5)]" : "bg-foam ring-ink/6"
              }`}
            >
              <span className={isIn ? "" : "opacity-40 grayscale"}>
                <AllyMark ally={a} size={52} alt={v.crew.logoAlt(a.brand)} />
              </span>
              <span className="text-[16px] leading-tight font-extrabold text-deep-ocean">{a.brand}</span>
              <span className="text-[13px] font-bold text-ocean-teal">{v.allies[a.id].role}</span>
              <span
                className={`mt-auto rounded-full px-2.5 py-1 text-[12px] font-extrabold ${
                  isIn ? "bg-seafoam/20 text-[#2f6b64]" : "bg-white text-ink-soft ring-1 ring-ink/8"
                }`}
              >
                {isIn ? `✓ ${v.crew.joined}` : where}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
