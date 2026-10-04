// A partner's face on the voyage: their official logo if we have the file, otherwise our emoji tile.
import type { Ally } from "@/content/voyage";

export function AllyMark({ ally, size = 56, alt }: { ally: Ally; size?: number; alt: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-[30%] ${ally.logo ? "bg-white ring-1 ring-ink/8" : ally.tile}`}
      style={{ width: size, height: size, fontSize: size * 0.52 }}
    >
      {ally.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- small static partner logo from /public
        <img src={ally.logo} alt={alt} width={size} height={size} className="h-[72%] w-[72%] object-contain" />
      ) : (
        <span aria-hidden>{ally.emoji}</span>
      )}
    </span>
  );
}
