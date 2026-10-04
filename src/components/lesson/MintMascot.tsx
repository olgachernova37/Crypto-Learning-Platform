"use client";

// Finale: mint the mascot as a real NFT on Solana devnet — into the training wallet, or straight
// into the learner's own Phantom wallet (paste its address). Falls back to practice mode gracefully.

import { useState } from "react";
import { isAddress } from "@solana/kit";
import { useProgress } from "@/lib/progress";
import { addressExplorerUrl, shortAddr, useTrainingWallet, walletErrorText } from "@/lib/training-wallet";
import { useT } from "@/i18n";
import { connectPhantom, forgetPhantom, isMobileDevice, phantomBrowseLink, usePhantomAddress } from "@/lib/phantom";
import { Confetti } from "./Confetti";
import { IconCheck, IconExternal, IconSparkle } from "./icons";
import m from "./motion.module.css";

export function MintMascot() {
  const { claimNft } = useProgress();
  const { wallet, busy, error, mintMascot, switchToPractice } = useTrainingWallet();
  const [where, setWhere] = useState<"training" | "phantom">("training");
  const [phantom, setPhantom] = useState("");
  const linked = usePhantomAddress(); // public address from "Connect Phantom" (remembered)
  const [conn, setConn] = useState<"" | "busy" | "notInstalled" | "rejected">("");
  const address = (phantom || linked).trim();
  const minted = wallet?.mascot;
  const phantomOk = isAddress(address);
  const t = useT();
  const f = t.finale.mint;

  const mint = async () => {
    const ok = await mintMascot(where === "phantom" ? address : undefined);
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
            {f.minted}
          </p>
          <p className="mt-2 text-[16px] leading-relaxed text-white/75">
            {minted.real
              ? toPhantom
                ? f.mintedRealPhantom(shortAddr(minted.owner))
                : f.mintedRealTraining
              : f.mintedPractice}
          </p>
          {minted.real && (
            <a
              href={addressExplorerUrl(minted.mint)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-[15px] font-extrabold text-deep-ocean"
            >
              {f.seeOnExplorer} <IconExternal width={16} height={16} />
              <span className="sr-only">{f.opensInNewTab}</span>
            </a>
          )}
        </div>
        <div className="rounded-[1.5rem] bg-white p-5 text-ink">
          <p className="text-lg font-extrabold">{f.findTitle}</p>
          {toPhantom ? (
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-[16px] leading-relaxed text-ink-soft">
              {f.phantomSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">
              {f.trainingFind}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md text-left">
      <fieldset className="rounded-[1.5rem] bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md">
        <legend className="sr-only">{f.whereLegend}</legend>
        <p className="font-extrabold">{f.whereTitle}</p>
        <div className="mt-3 flex flex-col gap-2">
          {(
            [
              ["training", f.trainingLabel, f.trainingHint],
              ["phantom", f.phantomLabel, f.phantomHint],
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
            {linked && !phantom ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-[1.1rem] bg-seafoam/25 px-4 py-3">
                <p className="font-mono text-[15px] font-bold text-white">✓ {f.connected(shortAddr(linked))}</p>
                <button type="button" onClick={() => forgetPhantom()} className="text-sm font-bold text-light-sky underline">
                  {f.useAnother}
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  disabled={conn === "busy"}
                  onClick={async () => {
                    setConn("busy");
                    const r = await connectPhantom();
                    if (r.ok) {
                      setPhantom("");
                      setConn("");
                    } else setConn(r.reason);
                  }}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ab9ff2] px-5 text-[16px] font-extrabold text-deep-ocean transition hover:brightness-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-light-sky disabled:opacity-60"
                >
                  {conn === "busy" ? f.connecting : f.connect}
                </button>
                {conn === "notInstalled" && (
                  <p role="status" className="mt-2 text-sm leading-relaxed text-white/85">
                    {f.notInstalled}{" "}
                    {isMobileDevice() ? (
                      <a href={phantomBrowseLink()} className="font-bold text-light-sky underline">
                        {f.openInApp}
                      </a>
                    ) : (
                      <a href="https://phantom.com/download" target="_blank" rel="noopener noreferrer" className="font-bold text-light-sky underline">
                        {f.install}
                        <span className="sr-only"> {f.opensInNewTab}</span>
                      </a>
                    )}
                  </p>
                )}
                {conn === "rejected" && (
                  <p role="status" className="mt-2 text-sm leading-relaxed text-sandy-beige">
                    {f.rejected}
                  </p>
                )}
                <p className="mt-2 text-xs leading-relaxed text-white/60">{f.connectSafe}</p>
              </>
            )}
            {!(linked && !phantom) && (
              <>
            <label htmlFor="phantom-address" className="mt-4 block text-sm font-bold text-white/85">
              {f.orPaste}
            </label>
            <input
              id="phantom-address"
              value={phantom}
              onChange={(e) => setPhantom(e.target.value)}
              placeholder={f.phantomPlaceholder}
              spellCheck={false}
              autoComplete="off"
              className="mt-1 w-full rounded-full bg-white px-4 py-3 font-mono text-[15px] text-ink outline-none ring-2 ring-transparent focus:ring-light-sky"
            />
            {phantom.trim() && !isAddress(phantom.trim()) && <p className="mt-1 text-sm text-sandy-beige">{f.phantomInvalid}</p>}
              </>
            )}
          </div>
        )}
      </fieldset>

      {error && (
        <div role="alert" className="mt-3 rounded-[1.1rem] bg-sandy-beige/25 p-4 text-[15px] leading-relaxed">
          <p className="font-bold">{walletErrorText(error, t.wallet)}</p>
          {wallet?.mode === "devnet" && (
            <button type="button" onClick={switchToPractice} className="mt-2 font-bold text-light-sky underline">
              {f.switchToPractice}
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
            {f.busy}
          </>
        ) : (
          <>
            {f.button} <IconSparkle width={18} height={18} />
          </>
        )}
      </button>
      <p className="mt-3 text-sm text-white/60">{f.note}</p>
    </div>
  );
}
