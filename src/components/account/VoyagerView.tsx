"use client";

// The page a shared link opens: the friend's card + "Start my voyage" (in the visitor's own language).
import Link from "next/link";
import { useLocale, useT } from "@/i18n";
import { cardPath, type ShareKind } from "@/lib/share";
import { Boat } from "@/components/ocean/Boat";

export function VoyagerView({ kind, name }: { kind: ShareKind; name: string }) {
  const t = useT();
  const s = t.share;
  const [locale] = useLocale();
  const who = name || s.someone;
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-gradient-to-b from-[#081C2E] via-deep-ocean to-ocean-teal px-4 py-10 text-white">
      {/* eslint-disable-next-line @next/next/no-img-element -- a generated PNG, already the right size */}
      <img
        src={cardPath(kind, name, locale, "og")}
        alt={s.page.cardAlt}
        width={1200}
        height={630}
        className="h-auto w-full max-w-2xl rounded-[1.75rem] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15"
      />
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          {kind === "done" ? s.page.doneTitle(who) : s.page.inviteTitle(who)}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-white/80">{s.page.body}</p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-14 items-center gap-3 rounded-full bg-white pr-3 pl-7 text-[17px] font-extrabold text-deep-ocean transition hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-light-sky"
        >
          {s.page.cta}
          <span aria-hidden className="grid size-9 place-items-center rounded-full bg-sandy-beige">
            <Boat className="size-6" />
          </span>
        </Link>
      </div>
    </main>
  );
}
