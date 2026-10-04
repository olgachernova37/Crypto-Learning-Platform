"use client";

import Link from "next/link";
import { useState } from "react";
import { lessons } from "@/content/lessons";
import { useProgress } from "@/lib/progress";
import { SeaScene } from "./SeaScene";
import { SeaTurtle } from "./SeaTurtle";
import { Confetti } from "./Confetti";
import { IconArrowLeft, IconArrowRight, IconCheck, IconShare, IconSparkle } from "./icons";
import m from "./motion.module.css";

const core = lessons;

export function FinaleView() {
  const { progress, ready, claimNft } = useProgress();
  const [shareMsg, setShareMsg] = useState("");
  const done = core.filter((l) => progress.completedLessons.includes(l.id)).length;
  const unlocked = done === core.length;
  const claimed = progress.nftClaimed;

  async function share() {
    const url = window.location.origin;
    const data = {
      title: "Crypto Voyage",
      text: "I just sailed through my first crypto lessons on Crypto Voyage and earned a little sea-animal learning badge!",
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied. Paste it anywhere to share!");
    } catch {
      setShareMsg(`Copy this link to share: ${url}`);
    }
  }

  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-sea-night text-white">
      <SeaScene variant="finale" className="-z-10" />

      <header className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6">
        <Link
          href="/journey"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-bold text-white/90 ring-1 ring-white/15 backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-light-sky"
        >
          <IconArrowLeft width={18} height={18} />
          Back to the route
        </Link>
        <span className="label-mono text-white/60">Devnet · Finale</span>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-5 pt-6 pb-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-12">
        <div className="text-center lg:text-left">
          <p className={`label-mono inline-flex items-center gap-2 text-white/75 ${m.fadeUp}`}>
            <span aria-hidden className="size-2 rounded-[2px] bg-sandy-beige" />
            The end of the route
          </p>
          <p className={`mt-4 text-sm font-extrabold tracking-[0.12em] text-light-sky uppercase sm:text-base ${m.fadeUp} ${m.delay1}`}>
            Finale
          </p>
          <h1 className={`mt-2 text-[3rem] leading-[1.02] font-extrabold tracking-tight sm:text-7xl ${m.fadeUp} ${m.delay1}`}>
            Meet your mascot! 🐢
          </h1>
          <p className={`mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-white/80 sm:text-lg lg:mx-0 ${m.fadeUp} ${m.delay2}`}>
            Look how far you&apos;ve come! You mastered wallets, sent crypto, tracked receipts, and even made a
            decentralized swap. To celebrate your graduation, a unique ocean mascot is waiting for your digital
            backpack.
          </p>

          <div className={`mt-8 flex flex-col items-center gap-4 lg:items-start ${m.fadeUp} ${m.delay3}`}>
            {!ready ? (
              <div className="h-14" />
            ) : claimed ? (
              <div className="flex w-full max-w-md flex-col gap-4 text-left">
                <Confetti />
                <div role="status" className="rounded-[1.5rem] bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md">
                  <p className="flex items-center gap-3 text-lg font-extrabold">
                    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-seafoam text-white">
                      <IconCheck width={18} height={18} />
                    </span>
                    Your mascot is minted! 🎉
                  </p>
                  <p className="mt-2 text-[16px] leading-relaxed text-white/75">
                    For now it lives in your practice backpack here. Real minting to your wallet on Solana devnet
                    comes next.
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-white p-5 text-ink">
                  <p className="text-lg font-extrabold">Where to find your new friend 📱</p>
                  <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">
                    Open your Phantom wallet app and tap the Collectibles tab (the icon with little squares, ⊞).
                    That&apos;s where NFTs like your mascot live.
                  </p>
                </div>
              </div>
            ) : unlocked ? (
              <button
                type="button"
                onClick={claimNft}
                className={`inline-flex min-h-16 items-center gap-3 rounded-[1.25rem] bg-seafoam px-9 text-xl font-extrabold text-white shadow-[0_14px_44px_-12px_rgba(107,167,160,0.8)] transition hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-light-sky ${m.pulse}`}
              >
                🎁 Mint my mascot
                <IconSparkle width={18} height={18} />
              </button>
            ) : (
              <div className="w-full max-w-md rounded-[1.5rem] bg-white/10 p-5 text-left ring-1 ring-white/15 backdrop-blur-md">
                <p className="text-lg font-extrabold">Almost there!</p>
                <p className="mt-1 text-[16px] text-white/75">
                  Finish all {core.length} lessons to unlock your mascot. You&apos;ve done {done} of {core.length}.
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15" aria-hidden>
                  <div className="h-full rounded-full bg-seafoam" style={{ width: `${(done / core.length) * 100}%` }} />
                </div>
                <Link
                  href="/journey"
                  className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-[16px] font-extrabold text-deep-ocean focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-light-sky"
                >
                  Continue the route <IconArrowRight width={18} height={18} />
                </Link>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                href="/partners"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-5 text-[15px] font-bold text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-light-sky"
              >
                Trusted harbors <IconArrowRight width={18} height={18} />
              </Link>
              <button
                type="button"
                onClick={share}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-5 text-[15px] font-bold text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-light-sky"
              >
                <IconShare width={18} height={18} />
                Share the journey
              </button>
            </div>
            <p aria-live="polite" className="min-h-5 text-sm font-semibold text-light-sky">
              {shareMsg}
            </p>
          </div>
        </div>

        <NftCard claimed={claimed} />
      </div>
    </main>
  );
}

function NftCard({ claimed }: { claimed: boolean }) {
  return (
    <figure className={`order-first mx-auto w-full max-w-[16rem] sm:max-w-[20rem] lg:order-none lg:max-w-[22rem] ${m.pop} ${m.delay2}`}>
      <div className="relative rounded-[2rem] bg-white p-3 text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)] ring-1 ring-white/40">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-light-sky via-[#cfe2ee] to-[#e9eef0]">
          <svg aria-hidden viewBox="0 0 300 60" className="absolute inset-x-0 bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 30c40-14 80-14 120 0s80 14 120 0 40-10 60-6v36H0z" fill="#dcc8aa" opacity="0.55" />
            <path d="M0 42c50-12 100-12 150 0s100 12 150 0v18H0z" fill="#dcc8aa" />
          </svg>
          <span className="absolute top-3 left-3 rounded-full bg-white/85 px-3 py-1.5 text-xs font-extrabold text-ocean-teal">
            Devnet · Learning badge
          </span>
          <SeaTurtle className="relative mx-auto mt-10 mb-4 w-[85%]" />
        </div>
        <figcaption className="flex items-center justify-between gap-3 px-3 pt-4 pb-2">
          <div>
            <p className="text-lg font-extrabold sm:text-xl">Pebble the Sea Turtle</p>
            <p className="text-sm text-ink-soft">Finished the Crypto Voyage course</p>
          </div>
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-full ${
              claimed ? "bg-seafoam text-white" : "bg-light-sky/50 text-ocean-teal"
            }`}
            aria-label={claimed ? "Claimed" : "Not claimed yet"}
            role="img"
          >
            {claimed ? <IconCheck width={20} height={20} /> : <IconSparkle width={18} height={18} />}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
