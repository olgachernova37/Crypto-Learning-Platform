"use client";

// Hands-on "Action Zone" inside a lesson step: send, swap, or look at a receipt.
// Runs on the in-app training wallet (a simulator) and says so — real devnet comes later.

import { useEffect, useState } from "react";
import type { Practice } from "@/content/types";
import {
  PRACTICE_FRIEND_ADDRESS,
  shortAddr,
  useTrainingWallet,
  type PracticeTx,
} from "@/lib/training-wallet";
import { IconCheck, IconSparkle } from "./icons";
import m from "./motion.module.css";

const fmt = (n: number) => (Math.round(n * 1000) / 1000).toLocaleString("en", { maximumFractionDigits: 3 });

export function PracticeZone({ practice, onDone }: { practice: Practice; onDone: () => void }) {
  const { wallet, ensure, send, swap } = useTrainingWallet();
  const [busy, setBusy] = useState(false);
  const [tx, setTx] = useState<PracticeTx | null>(null);
  const [showReceipt, setShowReceipt] = useState(practice.kind === "receipt");

  // create the training wallet the first time a learner reaches a practice zone
  useEffect(() => {
    ensure();
  }, [ensure]);

  const kind = practice.kind === "receipt" ? "send" : practice.kind === "swap" ? "swap" : "send";
  const existing = wallet?.txs.find((t) => t.kind === kind) ?? null;
  const done = tx ?? existing;

  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);

  const run = () => {
    if (busy) return;
    setBusy(true);
    window.setTimeout(() => {
      const t =
        practice.kind === "swap"
          ? swap(practice.payAmount, practice.getAmount, practice.getSymbol)
          : send(practice.kind === "send" ? practice.amount : 1);
      setTx(t);
      setBusy(false);
    }, 1100);
  };

  const sol = wallet?.sol ?? 5;

  return (
    <section
      aria-label="Practice zone"
      className={`overflow-hidden rounded-[1.75rem] bg-deep-ocean text-white shadow-[0_24px_60px_-30px_rgba(13,43,69,0.9)] ${m.fadeUp} ${m.delay2}`}
    >
      {/* wallet header */}
      <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid size-10 place-items-center rounded-2xl bg-white/10 text-xl">🎒</span>
          <div>
            <p className="text-[15px] font-extrabold">Your training wallet</p>
            <p className="font-mono text-xs text-white/60">{wallet ? shortAddr(wallet.address) : "…"}</p>
          </div>
        </div>
        <span className="label-mono rounded-full bg-sandy-beige/20 px-3 py-1.5 text-sandy-beige">Practice</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 px-5 sm:px-6">
        <Balance label="SOL" value={fmt(sol)} />
        {Object.entries(wallet?.tokens ?? {}).map(([sym, v]) => (
          <Balance key={sym} label={sym} value={fmt(v)} />
        ))}
      </div>

      <div className="m-3 mt-5 rounded-[1.4rem] bg-white p-5 text-ink sm:m-4 sm:p-6">
        {practice.kind === "swap" ? (
          <SwapForm pay={practice.payAmount} get={practice.getAmount} symbol={practice.getSymbol} />
        ) : practice.kind === "send" ? (
          <SendForm amount={practice.amount} />
        ) : null}

        {practice.kind === "receipt" && !done && (
          <div>
            <p className="text-[17px] leading-relaxed text-ink-soft">
              No practice transfer yet. Send 1 practice SOL now and we&apos;ll show you its receipt.
            </p>
            <div className="mt-4">
              <SendForm amount={1} />
            </div>
          </div>
        )}

        {!done ? (
          <button
            type="button"
            onClick={run}
            disabled={busy}
            className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-ocean-teal px-6 text-[17px] font-extrabold text-white transition hover:bg-deep-ocean focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50 disabled:bg-ocean-teal/70"
          >
            {busy ? (
              <>
                <span aria-hidden className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {practice.kind === "swap" ? "Swapping…" : "Sending…"}
              </>
            ) : practice.kind === "swap" ? (
              `Swap to ${practice.getSymbol}`
            ) : (
              `Send ${practice.kind === "send" ? practice.amount : 1} SOL`
            )}
          </button>
        ) : (
          <div className={m.fadeUp}>
            {practice.kind !== "receipt" && (
              <p role="status" className="mt-5 flex items-center gap-3 text-lg font-extrabold text-ink">
                <span aria-hidden className="grid size-9 place-items-center rounded-full bg-seafoam text-white">
                  <IconCheck width={18} height={18} />
                </span>
                {practice.kind === "swap" ? "The vending machine gave you your tokens!" : "Sent! It arrived in about a second."}
              </p>
            )}
            {!showReceipt ? (
              <>
                <p className="mt-3 text-[16px] text-ink-soft">
                  {practice.kind === "swap" ? "Did it really happen? Let's verify!" : "Did you send it? Let's check the public notebook!"}
                </p>
                <button
                  type="button"
                  onClick={() => setShowReceipt(true)}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-deep-ocean px-6 text-[16px] font-extrabold text-white transition hover:bg-ocean-teal focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50"
                >
                  🔍 Verify my {practice.kind === "swap" ? "swap" : "transaction"} onchain
                </button>
              </>
            ) : (
              <Receipt tx={done} from={wallet?.address ?? ""} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Balance({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-full bg-white/10 px-4 py-2">
      <span className="text-xl font-extrabold">{value}</span>
      <span className="text-sm font-bold text-light-sky">{label}</span>
    </span>
  );
}

function Row({ k, v, mono }: { k: string; v: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink/8 py-2.5 last:border-0">
      <dt className="text-[15px] text-ink-soft">{k}</dt>
      <dd className={`text-right text-[15px] font-bold text-ink ${mono ? "font-mono" : ""}`}>{v}</dd>
    </div>
  );
}

function SendForm({ amount }: { amount: number }) {
  return (
    <dl>
      <Row k="To (a friend)" v={shortAddr(PRACTICE_FRIEND_ADDRESS)} mono />
      <Row k="Amount" v={`${amount} SOL`} />
      <Row k="Network fee" v="0.000005 SOL" />
    </dl>
  );
}

function SwapForm({ pay, get, symbol }: { pay: number; get: number; symbol: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-[1.1rem] bg-foam px-4 py-3">
        <p className="text-sm font-bold text-ink-soft">You pay</p>
        <p className="text-2xl font-extrabold">{pay} SOL</p>
      </div>
      <span aria-hidden className="mx-auto -my-4 z-10 grid size-10 place-items-center rounded-full bg-sandy-beige text-deep-ocean ring-4 ring-white">
        ↓
      </span>
      <div className="rounded-[1.1rem] bg-light-sky/35 px-4 py-3">
        <p className="text-sm font-bold text-ink-soft">You get</p>
        <p className="text-2xl font-extrabold">
          {get} {symbol} <span className="text-base font-bold text-ink-soft">Ocean Token</span>
        </p>
      </div>
    </div>
  );
}

function Receipt({ tx, from }: { tx: PracticeTx; from: string }) {
  return (
    <div className={`mt-5 rounded-[1.25rem] ring-1 ring-ink/10 ${m.fadeUp}`}>
      <div className="flex items-center justify-between gap-3 rounded-t-[1.25rem] bg-foam px-4 py-3">
        <p className="flex items-center gap-2 font-extrabold">
          <IconSparkle width={16} height={16} /> Transaction receipt
        </p>
        <span className="rounded-full bg-seafoam/20 px-3 py-1 text-sm font-extrabold text-[#2f6b64]">✓ Success</span>
      </div>
      <dl className="px-4 pb-2">
        <Row k="What" v={tx.label} />
        <Row k="Signature" v={`${tx.signature.slice(0, 6)}…${tx.signature.slice(-6)}`} mono />
        <Row k="From (you)" v={from ? shortAddr(from) : "—"} mono />
        {tx.kind === "send" && <Row k="To" v={shortAddr(PRACTICE_FRIEND_ADDRESS)} mono />}
        <Row k="Amount" v={`${Math.abs(tx.amountSol)} SOL`} />
        <Row k="Network fee" v={`${tx.feeSol} SOL`} />
        <Row k="Time" v={new Date(tx.at).toLocaleString()} />
        <Row k="Network" v="Practice (simulated devnet)" />
      </dl>
      <p className="border-t border-ink/8 px-4 py-3 text-sm leading-relaxed text-ink-soft">
        This is a practice receipt. Once your wallet is connected to the real Solana devnet, this button will open the
        same receipt on Solana Explorer. Notice: addresses only, never your name.
      </p>
    </div>
  );
}
