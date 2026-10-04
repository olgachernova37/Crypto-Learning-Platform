// Share links and card images: "I finished Crypto Voyage" and "Invite a friend".
// A shared link opens /voyager, whose link preview is the card image from /api/card.
import type { Locale } from "@/i18n/locales";

export type ShareKind = "done" | "invite";
export type CardFormat = "og" | "story";

function query(kind: ShareKind, name: string, locale: Locale) {
  const q = new URLSearchParams({ k: kind, l: locale });
  if (name.trim()) q.set("n", name.trim().slice(0, 40));
  return q.toString();
}

export const shareLink = (origin: string, kind: ShareKind, name: string, locale: Locale) =>
  `${origin}/voyager?${query(kind, name, locale)}`;

export const cardPath = (kind: ShareKind, name: string, locale: Locale, format: CardFormat) =>
  `/api/card?${query(kind, name, locale)}&f=${format}`;

/** Phone share sheet when there is one, else copy the link. Returns what happened. */
export async function shareOrCopy(data: { title: string; text: string; url: string }): Promise<"shared" | "copied" | "manual" | "cancelled"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(data);
      return "shared";
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return "cancelled";
    }
  }
  try {
    await navigator.clipboard.writeText(data.url);
    return "copied";
  } catch {
    return "manual";
  }
}
