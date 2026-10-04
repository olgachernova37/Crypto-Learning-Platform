"use client";

// "Share the journey" / "Invite a friend" + "Download my card" (a 1080×1350 image for stories).
import { useState } from "react";
import { useLocale, useT } from "@/i18n";
import { useProfile } from "@/lib/profile";
import { cardPath, shareLink, shareOrCopy, type ShareKind } from "@/lib/share";
import { IconShare } from "@/components/lesson/icons";

export function ShareActions({ kind, tone = "dark", label }: { kind: ShareKind; tone?: "dark" | "light"; label?: string }) {
  const t = useT();
  const s = t.share;
  const [locale] = useLocale();
  const { profile } = useProfile();
  const [msg, setMsg] = useState("");
  const name = profile?.name ?? "";

  const go = async () => {
    const url = shareLink(window.location.origin, kind, name, locale);
    const text = kind === "done" ? t.finale.shareText : s.inviteText;
    const r = await shareOrCopy({ title: t.common.appName, text, url });
    setMsg(r === "copied" ? s.copied : r === "manual" ? s.copyManually(url) : "");
  };

  const dark = tone === "dark";
  const pill = `inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-[15px] font-bold transition focus-visible:outline-3 ${
    dark
      ? "bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md hover:bg-white/20 focus-visible:outline-light-sky"
      : "bg-white text-deep-ocean ring-1 ring-deep-ocean/12 hover:bg-foam focus-visible:outline-ocean-teal"
  }`;
  const primary = dark ? pill : pill.replace("bg-white text-deep-ocean", "bg-ocean-teal text-white").replace("hover:bg-foam", "hover:bg-deep-ocean");

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={go} className={primary}>
          <IconShare width={18} height={18} />
          {label ?? (kind === "done" ? t.finale.share : s.invite)}
        </button>
        <a href={cardPath(kind, name, locale, "story")} download="crypto-voyage-card.png" className={pill}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
          </svg>
          {s.download}
        </a>
      </div>
      <p aria-live="polite" className={`mt-2 min-h-5 text-sm font-semibold ${dark ? "text-light-sky" : "text-ocean-teal"}`}>
        {msg}
      </p>
    </div>
  );
}
