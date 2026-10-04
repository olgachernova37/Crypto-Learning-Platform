// GET /api/card?k=done|invite&n=Name&l=uk&f=og|story → a PNG card for social media.
// og = 1200×630 (link previews), story = 1080×1350 (download and post).
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { dictFor } from "@/i18n/dict";
import { isLocale } from "@/i18n/locales";
import { lessons } from "@/content/lessons";
import { cleanName } from "@/lib/server/learners";

const fontFiles = ["latin", "latin-ext", "cyrillic"].flatMap((subset) =>
  ([600, 900] as const).map((weight) => ({ subset, weight })),
);
let fonts: Promise<{ name: string; data: Buffer; weight: 600 | 900; style: "normal" }[]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all(
    fontFiles.map(async ({ subset, weight }) => ({
      // one name per subset: the card lists them all in font-family, so every letter finds a font
      name: `Nunito-${subset}`,
      data: await readFile(join(process.cwd(), "assets/fonts", `nunito-${subset}-${weight}-normal.woff`)),
      weight,
      style: "normal" as const,
    })),
  ));

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams;
  const locale = isLocale(q.get("l")) ? (q.get("l") as Parameters<typeof dictFor>[0]) : "en";
  const kind = q.get("k") === "invite" ? "invite" : "done";
  const story = q.get("f") === "story";
  const s = dictFor(locale).share;
  const name = cleanName(q.get("n")) || s.someone;

  const badge = kind === "done" ? s.card.doneBadge : s.card.inviteBadge;
  const title = kind === "done" ? s.card.done(name) : s.card.invite(name);
  const sub = kind === "done" ? s.card.doneSub(lessons.length) : s.card.inviteSub;
  const [w, h] = story ? [1080, 1350] : [1200, 630];
  const pad = story ? 88 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: pad,
          fontFamily: "Nunito-latin, Nunito-latin-ext, Nunito-cyrillic",
          color: "#F6FAFC",
          background: "linear-gradient(180deg, #081C2E 0%, #0D2B45 60%, #1E5A6E 100%)",
          position: "relative",
        }}
      >
        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="52" height="52" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="none" stroke="#B7D4E6" strokeWidth="2.5" />
            <path d="M11 22c4-4 9-4 13 0s9 4 13 0M11 30c4-4 9-4 13 0s9 4 13 0" fill="none" stroke="#B7D4E6" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: story ? 40 : 34, fontWeight: 900 }}>Crypto Voyage</span>
        </div>

        {/* message */}
        <div style={{ display: "flex", flexDirection: "column", gap: story ? 28 : 20, maxWidth: story ? 900 : 760 }}>
          <div style={{ display: "flex" }}>
            <span
              style={{
                fontSize: story ? 32 : 26,
                fontWeight: 900,
                color: "#0D2B45",
                background: "#DCC8AA",
                padding: story ? "10px 26px" : "8px 22px",
                borderRadius: 999,
              }}
            >
              {badge}
            </span>
          </div>
          <span style={{ fontSize: story ? 84 : 62, fontWeight: 900, lineHeight: 1.08 }}>{title}</span>
          <span style={{ fontSize: story ? 40 : 30, fontWeight: 600, lineHeight: 1.35, color: "#D9ECF7" }}>{sub}</span>
        </div>

        {/* footer */}
        <span style={{ fontSize: story ? 32 : 26, fontWeight: 600, color: "#B7D4E6" }}>{url.host}</span>

        {/* the boat on the waves */}
        <svg
          width={story ? 380 : 300}
          height={story ? 330 : 260}
          viewBox="0 0 300 260"
          style={{ position: "absolute", right: story ? 60 : 40, bottom: story ? 70 : 24 }}
        >
          <path d="M150 20 L150 170 L70 170 Z" fill="#B7D4E6" />
          <path d="M160 34 L160 170 L238 170 Z" fill="#F6FAFC" />
          <rect x="152" y="14" width="6" height="160" rx="3" fill="#DCC8AA" />
          <path d="M56 178 H262 L236 214 H84 Z" fill="#DCC8AA" />
          <path d="M70 192 H248" stroke="#1E5A6E" strokeWidth="6" />
          <path d="M0 236c25-12 50-12 75 0s50 12 75 0 50-12 75 0 50 12 75 0" fill="none" stroke="#6BA7A0" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      width: w,
      height: h,
      fonts: await loadFonts(),
      headers: { "cache-control": "public, max-age=86400, immutable" },
    },
  );
}
