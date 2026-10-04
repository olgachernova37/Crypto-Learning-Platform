"use client";

// Finale: mint the mascot as a real NFT on Solana devnet — into the training wallet, or straight
// into the learner's own Phantom wallet (paste its address). Falls back to practice mode gracefully.

import { useState } from "react";
import { isAddress } from "@solana/kit";
import { useProgress } from "@/lib/progress";
import { addressExplorerUrl, shortAddr, useTrainingWallet } from "@/lib/training-wallet";
import { Confetti } from "./Confetti";
import { IconCheck, IconExternal, IconSparkle } from "./icons";
import m from "./motion.module.css";

export function MintMascot() {
  const { claimNft } = useProgress();
  const { wallet, busy, error, mintMascot, switchToPractice } = useTrainingWallet();
  const [where, setWhere] = useState<"training" | "phantom">("training");
  const [phantom, setPhantom] = useState("");
  const minted = wallet?.mascot;
  const phantomOk = isAddress(phantom.trim());

  const mint = async () => {
    const ok = await mintMascot(where === "phantom" ? phantom.trim() : undefined);
    if (ok) claimNft();
  };

  if (minted) {
    const toPhantom = minted.owner !== wallet?.address;
    return (
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
            {minted.real
              ? `Pebble is a real NFT on Solana devnet, living in ${toPhantom ? `your Phantom wallet (${shortAddr(minted.owner)})` : "your training wallet"}. Exactly one exists — it's yours.`
              : "Pebble lives in your practice backpack (simulated). Try again on devnet any time."}
          </p>
          {minted.real && (
            <a
              href={addressExplorerUrl(minted.mint)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-[15px] font-extrabold text-deep-ocean"
            >
              See it on Solana Explorer <IconExternal width={16} height={16} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
        <div className="rounded-[1.5rem] bg-white p-5 text-ink">
          <p className="text-lg font-extrabold">Where to find your new friend 📱</p>
          {toPhantom ? (
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-[16px] leading-relaxed text-ink-soft">
              <li>Open Phantom → Settings → Developer Settings, and turn on Testnet Mode (Solana Devnet).</li>
              <li>Tap the Collectibles tab (the icon with little squares, ⊞).</li>
              <li>Pebble may take a minute to appear while the wallet catches up.</li>
            </ol>
          ) : (
            <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">
              In a wallet app like Phantom, NFTs live in the Collectibles tab (the icon with little squares, ⊞). Your Pebble
              is in the training wallet here — next time, send it straight to your own Phantom.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md text-left">
      <fieldset className="rounded-[1.5rem] bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md">
        <legend className="sr-only">Where should your mascot live?</legend>
        <p className="font-extrabold">Where should Pebble live?</p>
        <div className="mt-3 flex flex-col gap-2">
          {(
            [
              ["training", "My training wallet", "Easiest: no app needed."],
              ["phantom", "My own Phantom wallet", "Paste your Phantom address (it's safe to share)."],
            ] as const
          ).map(([value, label, hint]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-start gap-3 rounded-[1.1rem] p-3 ring-1 transition ${
                where === value ? "bg-white/15 ring-light-sky" : "ring-white/15 hover:bg-white/5"
              }`}
            >
              <input
                type="radio"
                name="where"
                value={value}
                checked={where === value}
                onChange={() => setWhere(value)}
                className="mt-1 size-4 accent-[#6ba7a0]"
              />
              <span>
                <span className="block font-bold">{label}</span>
                <span className="block text-sm text-white/70">{hint}</span>
              </span>
            </label>
          ))}
        </div>
        {where === "phantom" && (
          <div className={`mt-3 ${m.fadeUp}`}>
            <label htmlFor="phantom-address" className="text-sm font-bold text-white/85">
              Your Phantom address
            </label>
            <input
              id="phantom-address"
              value={phantom}
              onChange={(e) => setPhantom(e.target.value)}
              placeholder="e.g. 7Xb…9Yz"
              spellCheck={false}
              autoComplete="off"
              className="mt-1 w-full rounded-full bg-white px-4 py-3 font-mono text-[15px] text-ink outline-none ring-2 ring-transparent focus:ring-light-sky"
            />
            {phantom && !phantomOk && <p className="mt-1 text-sm text-sandy-beige">That doesn&apos;t look like a Solana address yet.</p>}
          </div>
        )}
      </fieldset>

      {error && (
        <div role="alert" className="mt-3 rounded-[1.1rem] bg-sandy-beige/25 p-4 text-[15px] leading-relaxed">
          <p className="font-bold">{error}</p>
          {wallet?.mode === "devnet" && (
            <button type="button" onClick={switchToPractice} className="mt-2 font-bold text-light-sky underline">
              Continue in practice mode (simulated)
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={mint}
        disabled={busy === "mint" || (where === "phantom" && !phantomOk)}
        className={`mt-5 inline-flex min-h-16 items-center gap-3 rounded-[1.25rem] bg-seafoam px-9 text-xl font-extrabold text-white shadow-[0_14px_44px_-12px_rgba(107,167,160,0.8)] transition hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-light-sky disabled:opacity-60 ${
          busy === "mint" ? "" : m.pulse
        }`}
      >
        {busy === "mint" ? (
          <>
            <span aria-hidden className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Minting on Solana…
          </>
        ) : (
          <>
            🎁 Mint my mascot <IconSparkle width={18} height={18} />
          </>
        )}
      </button>
      <p className="mt-3 text-sm text-white/60">A real 1-of-1 NFT on Solana devnet. Free: devnet coins have no value.</p>
    </div>
  );
}
