"use client";

// Hands-on "Action Zone" inside a lesson step: fill up from the faucet, send, swap, or read a receipt.
// Sending and the faucet are REAL Solana devnet transactions (test coins, no value) with Solana
// Explorer receipts. The swap is a labelled practice simulation for now. If devnet can't be
// reached, the learner can continue in practice mode so a lesson never gets stuck.

import { useEffect, useState } from "react";
import type { Practice } from "@/content/types";
import {
  PRACTICE_FRIEND_ADDRESS,
  addressExplorerUrl,
  describeTx,
  shortAddr,
  txExplorerUrl,
  useTrainingWallet,
  walletErrorText,
  type PracticeTx,
} from "@/lib/training-wallet";
import { useT } from "@/i18n";
import { getReceipt } from "@/lib/solana/devnet";
import { IconCheck, IconExternal, IconSparkle } from "./icons";
import m from "./motion.module.css";

const FEE = 0.000005;
const fmt = (n: number) => (Math.round(n * 10000) / 10000).toLocaleString("en", { maximumFractionDigits: 4 });

export function PracticeZone({ practice, onDone }: { practice: Practice; onDone: () => void }) {
  const { wallet, sol, busy, error, ensure, faucet, send, swap, stake, switchToPractice } = useTrainingWallet();
  const [tx, setTx] = useState<PracticeTx | null>(null);
  const [showReceipt, setShowReceipt] = useState(practice.kind === "receipt");
  const [copied, setCopied] = useState(false);
  const t = useT();
  const p = t.practice;

  // the training wallet is created the first time a learner reaches a practice zone
  useEffect(() => {
    ensure();
  }, [ensure]);

  const kind = practice.kind === "swap" || practice.kind === "stake" ? practice.kind : "send";
  const simulatedOnly = practice.kind === "swap" || practice.kind === "stake";
  const existing = wallet?.txs.find((t) => t.kind === kind) ?? null;
  const done = tx ?? existing;
  const devnet = wallet?.mode === "devnet";

  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);

  const amount =
    practice.kind === "send" || practice.kind === "stake" ? practice.amount : practice.kind === "swap" ? practice.payAmount : 0.1;
  const needsCoins = !simulatedOnly && devnet && sol !== null && sol < amount + FEE;

  const run = async () => {
    if (busy) return;
    const t =
      practice.kind === "swap"
        ? await swap(practice.payAmount, practice.getAmount, practice.getSymbol)
        : practice.kind === "stake"
          ? await stake(amount)
          : await send(amount);
    if (t) setTx(t);
  };

  const copy = async () => {
    if (!wallet) return;
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the address is visible to select by hand */
    }
  };

  const btn =
    "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full px-4 text-[16px] font-extrabold sm:px-6 sm:text-[17px] transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50 disabled:opacity-70";

  return (
    <section
      aria-label={p.zoneLabel}
      className={`overflow-hidden rounded-[1.75rem] bg-deep-ocean text-white shadow-[0_24px_60px_-30px_rgba(13,43,69,0.9)] ${m.fadeUp} ${m.delay2}`}
    >
      {/* wallet header */}
      <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-xl">
            🎒
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-extrabold">
              <span className="sm:hidden">{p.header.titleShort}</span>
              <span className="hidden sm:inline">{p.header.title}</span>
            </p>
            {wallet ? (
              <button type="button" onClick={copy} className="font-mono text-xs text-white/65 underline-offset-2 hover:underline">
                {shortAddr(wallet.address)} · {copied ? p.header.copied : p.header.copy}
              </button>
            ) : (
              <p className="font-mono text-xs text-white/60">{p.header.creating}</p>
            )}
          </div>
        </div>
        <span
          className={`label-mono shrink-0 rounded-full px-3 py-1.5 ${devnet ? "bg-seafoam/25 text-[#bfe3de]" : "bg-sandy-beige/20 text-sandy-beige"}`}
        >
          {devnet ? p.header.modeDevnet : p.header.modePractice}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 px-5 sm:px-6">
        <Balance label="SOL" value={sol === null ? "…" : fmt(sol)} />
        {Object.entries(wallet?.tokens ?? {}).map(([sym, v]) => (
          <Balance key={sym} label={p.header.tokenPractice(sym)} value={fmt(v)} />
        ))}
        {devnet && wallet && (
          <a
            href={addressExplorerUrl(wallet.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-light-sky hover:underline"
          >
            {p.header.seeOnExplorer} <IconExternal width={14} height={14} />
            <span className="sr-only">{p.opensInNewTab}</span>
          </a>
        )}
      </div>

      <p className="mt-3 flex gap-2 px-5 text-[13px] leading-snug text-white/65 sm:px-6">
        <span aria-hidden>ⓘ</span>
        <span>{t.privacy.walletNotice}</span>
      </p>

      <div className="m-3 mt-4 rounded-[1.4rem] bg-white p-5 text-ink sm:m-4 sm:p-6">
        {/* step 1 (devnet): fill up from the faucet */}
        {needsCoins && !done && (
          <div className={`mb-5 rounded-[1.1rem] bg-light-sky/35 p-4 ${m.fadeUp}`}>
            <p className="font-extrabold">{p.faucet.title}</p>
            <p className="mt-1 text-[16px] leading-relaxed text-ink-soft">
              {p.faucet.body}
            </p>
            <button
              type="button"
              onClick={faucet}
              data-testid="practice-faucet"
              disabled={busy === "faucet"}
              className={`${btn} mt-4 bg-deep-ocean text-white hover:bg-ocean-teal`}
            >
              {busy === "faucet" ? (
                <>
                  <Spinner /> {p.faucet.busy}
                </>
              ) : (
                p.faucet.button
              )}
            </button>
          </div>
        )}

        {error && !done && (
          <div role="alert" className="mb-5 rounded-[1.1rem] bg-sandy-beige/35 p-4 text-[15px] leading-relaxed">
            <p className="font-bold text-deep-ocean">{walletErrorText(error, t.wallet)}</p>
            {devnet && wallet && (
              <p className="mt-2 text-ink-soft">
                {p.error.altFaucetBefore}{" "}
                <a href="https://faucet.solana.com" target="_blank" rel="noopener noreferrer" className="font-bold text-ocean-teal underline">
                  faucet.solana.com
                </a>{" "}
                {p.error.altFaucetAfter}
              </p>
            )}
            {devnet && (
              <button type="button" onClick={switchToPractice} data-testid="practice-switch" className="mt-3 font-bold text-ocean-teal underline">
                {p.error.switchToPractice}
              </button>
            )}
          </div>
        )}

        {practice.kind === "swap" ? (
          <SwapForm pay={practice.payAmount} get={practice.getAmount} symbol={practice.getSymbol} />
        ) : practice.kind === "stake" ? (
          <StakeForm amount={practice.amount} />
        ) : practice.kind === "send" ? (
          <SendForm amount={practice.amount} />
        ) : !done ? (
          <div>
            <p className="text-[17px] leading-relaxed text-ink-soft">
              {p.noTransferYet(amount)}
            </p>
            <div className="mt-4">
              <SendForm amount={amount} />
            </div>
          </div>
        ) : null}

        {!done ? (
          <button
            type="button"
            onClick={run}
            data-testid="practice-run"
            disabled={!!busy || needsCoins || (!simulatedOnly && sol === null)}
            className={`${btn} mt-5 bg-ocean-teal text-white hover:bg-deep-ocean disabled:bg-ocean-teal/50`}
          >
            {busy === "send" || busy === "swap" || busy === "stake" ? (
              <>
                <Spinner /> {practice.kind === "swap" ? p.action.swapping : practice.kind === "stake" ? p.action.staking : p.action.sending}
              </>
            ) : practice.kind === "swap" ? (
              p.action.swap(practice.getSymbol)
            ) : practice.kind === "stake" ? (
              p.action.stake(amount)
            ) : (
              p.action.send(amount)
            )}
          </button>
        ) : (
          <div className={m.fadeUp}>
            {practice.kind !== "receipt" && (
              <p role="status" data-testid="practice-done" className="mt-5 flex items-center gap-3 text-lg font-extrabold text-ink">
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-seafoam text-white">
                  <IconCheck width={18} height={18} />
                </span>
                {practice.kind === "swap"
                  ? p.success.swap
                  : practice.kind === "stake"
                    ? p.success.stake
                    : p.success.send}
              </p>
            )}
            {!showReceipt ? (
              <>
                <p className="mt-3 text-[16px] text-ink-soft">
                  {simulatedOnly ? p.verify.promptSimulated : p.verify.promptSend}
                </p>
                <button
                  type="button"
                  onClick={() => setShowReceipt(true)}
                  className={`${btn} mt-4 min-h-12 bg-deep-ocean text-[16px] text-white hover:bg-ocean-teal`}
                >
                  {p.verify.button}
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

function Spinner() {
  return <span aria-hidden className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />;
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
  const f = useT().practice.sendForm;
  return (
    <dl>
      <Row k={f.to} v={shortAddr(PRACTICE_FRIEND_ADDRESS)} mono />
      <Row k={f.amount} v={`${amount} SOL`} />
      <Row k={f.fee} v="~0.000005 SOL" />
    </dl>
  );
}

function SwapForm({ pay, get, symbol }: { pay: number; get: number; symbol: string }) {
  const f = useT().practice.swapForm;
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-[1.1rem] bg-foam px-4 py-3">
        <p className="text-sm font-bold text-ink-soft">{f.youPay}</p>
        <p className="text-2xl font-extrabold">{pay} SOL</p>
      </div>
      <span aria-hidden className="z-10 mx-auto -my-4 grid size-10 place-items-center rounded-full bg-sandy-beige text-deep-ocean ring-4 ring-white">
        ↓
      </span>
      <div className="rounded-[1.1rem] bg-light-sky/35 px-4 py-3">
        <p className="text-sm font-bold text-ink-soft">{f.youGet}</p>
        <p className="text-2xl font-extrabold">
          {get} {symbol} <span className="text-base font-bold text-ink-soft">{f.tokenName}</span>
        </p>
      </div>
      <p className="mt-1 text-sm text-ink-soft">{f.note}</p>
    </div>
  );
}

function StakeForm({ amount }: { amount: number }) {
  const f = useT().practice.stakeForm;
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-[1.1rem] bg-foam px-4 py-3">
        <p className="text-sm font-bold text-ink-soft">{f.youStake}</p>
        <p className="text-2xl font-extrabold">{amount} SOL</p>
      </div>
      <span aria-hidden className="z-10 mx-auto -my-4 grid size-10 place-items-center rounded-full bg-sandy-beige text-deep-ocean ring-4 ring-white">
        ↓
      </span>
      <div className="rounded-[1.1rem] bg-light-sky/35 px-4 py-3">
        <p className="text-sm font-bold text-ink-soft">{f.youGetReceipt}</p>
        <p className="text-2xl font-extrabold">
          ≈ {amount} mSOL <span className="text-base font-bold text-ink-soft">{f.keepsEarning}</span>
        </p>
      </div>
      <p className="mt-1 text-sm text-ink-soft">{f.note}</p>
    </div>
  );
}

function Receipt({ tx, from }: { tx: PracticeTx; from: string }) {
  const [live, setLive] = useState<Awaited<ReturnType<typeof getReceipt>>>(null);
  useEffect(() => {
    if (!tx.real) return;
    let alive = true;
    getReceipt(tx.signature)
      .then((r) => alive && setLive(r))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [tx.real, tx.signature]);
  const link = txExplorerUrl(tx);
  const t = useT();
  const r = t.practice.receipt;

  return (
    <div className={`mt-5 rounded-[1.25rem] ring-1 ring-ink/10 ${m.fadeUp}`}>
      <div className="flex items-center justify-between gap-3 rounded-t-[1.25rem] bg-foam px-4 py-3">
        <p className="flex items-center gap-2 font-extrabold">
          <IconSparkle width={16} height={16} /> {r.title}
        </p>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-seafoam/20 px-3 py-1 text-sm font-extrabold text-[#2f6b64]">
          ✓ {live && !live.ok ? r.failed : r.success}
        </span>
      </div>
      <dl className="px-4 pb-2">
        <Row k={r.what} v={describeTx(tx, t.wallet)} />
        <Row k={r.signature} v={`${tx.signature.slice(0, 6)}…${tx.signature.slice(-6)}`} mono />
        <Row k={r.from} v={from ? shortAddr(from) : "—"} mono />
        {tx.kind === "send" && <Row k={r.to} v={shortAddr(PRACTICE_FRIEND_ADDRESS)} mono />}
        <Row k={r.amount} v={`${Math.abs(tx.amountSol)} SOL`} />
        <Row k={r.fee} v={`${live ? live.feeSol : tx.feeSol} SOL`} />
        <Row k={r.time} v={new Date(live?.blockTime ?? tx.at).toLocaleString()} />
        <Row k={r.network} v={tx.real ? r.networkDevnet : r.networkPractice} />
      </dl>
      {link ? (
        <div className="border-t border-ink/8 p-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ocean-teal px-6 text-[16px] font-extrabold text-white transition hover:bg-deep-ocean focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50"
          >
            {r.viewOnExplorer} <IconExternal width={17} height={17} />
            <span className="sr-only">{t.practice.opensInNewTab}</span>
          </a>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {r.realNote}
          </p>
        </div>
      ) : (
        <p className="border-t border-ink/8 px-4 py-3 text-sm leading-relaxed text-ink-soft">
          {r.practiceNote}
        </p>
      )}
    </div>
  );
}
