// Where a shared "I finished Crypto Voyage" / "Invite a friend" link opens.
// The link preview (Telegram, WhatsApp, X, LinkedIn…) is the card image from /api/card.
import type { Metadata } from "next";
import { dictFor } from "@/i18n/dict";
import { isLocale, type Locale } from "@/i18n/locales";
import { cleanName } from "@/lib/server/learners";
import { VoyagerView } from "@/components/account/VoyagerView";

type Search = Promise<{ k?: string; n?: string; l?: string }>;

async function read(searchParams: Search) {
  const q = await searchParams;
  const locale: Locale = isLocale(q.l) ? q.l : "en";
  const kind = q.k === "invite" ? ("invite" as const) : ("done" as const);
  const name = cleanName(q.n);
  return { locale, kind, name };
}

export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  const { locale, kind, name } = await read(searchParams);
  const s = dictFor(locale).share;
  const who = name || s.someone;
  const title = kind === "done" ? s.page.doneTitle(who) : s.page.inviteTitle(who);
  const q = new URLSearchParams({ k: kind, l: locale, f: "og" });
  if (name) q.set("n", name);
  const image = `/api/card?${q}`;
  return {
    title: `${title} · Crypto Voyage`,
    description: s.page.body,
    openGraph: { title, description: s.page.body, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description: s.page.body, images: [image] },
  };
}

export default async function Page({ searchParams }: { searchParams: Search }) {
  const { kind, name } = await read(searchParams);
  return <VoyagerView kind={kind} name={name} />;
}
