"use client";

// The learner's TRAINING WALLET.
//
// mode "devnet"   — a real Solana devnet wallet created in this browser (key kept in localStorage,
//                   never shown). Faucet, transfers and receipts are real devnet transactions you
//                   can open on Solana Explorer. Devnet coins have no value.
// mode "practice" — a simulator, used when devnet can't be reached (or the learner chooses it), and
//                   for actions that don't exist on devnet for us yet (the swap, Marinade staking).
//
// Everything else in the app talks to this hook, never to devnet directly.

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { mintMascotNft } from "@/lib/solana/mascot";
import {
  explorerUrl,
  getBalanceSol,
  newSeed,
  requestAirdrop,
  sendSol,
  signerFromSeed,
} from "@/lib/solana/devnet";

export type PracticeTx = {
  signature: string;
  kind: "faucet" | "send" | "swap" | "stake" | "mint";
  label: string; // "Sent 0.1 SOL to a friend"
  amountSol: number; // SOL that left (-) or arrived (+)
  feeSol: number;
  at: number; // epoch ms
  real: boolean; // a real devnet transaction (has an Explorer page)
};

export type TrainingWallet = {
  mode: "devnet" | "practice";
  seed: string; // base64 secret seed (devnet key) — stays in this browser
  address: string;
  simSol: number; // practice-mode SOL balance
  tokens: Record<string, number>; // practice tokens: { OCN: 10, mSOL: 1 }
  txs: PracticeTx[]; // newest first
  mascot?: { mint: string; signature: string; owner: string; real: boolean };
};

const KEY = "crypto-voyage-training-wallet-v2";
const EVENT = "crypto-voyage-training-wallet";
const SIM_FEE = 0.000005;

/** A friend's devnet address we send practice SOL to (we don't hold its key; it just receives). */
export const PRACTICE_FRIEND_ADDRESS = "6EaBAEFjZLiAdwfStB9ikwSkdfR6MZzkSLyHZfT7ajpc";

export const shortAddr = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;
export const txExplorerUrl = (tx: PracticeTx) => (tx.real ? explorerUrl("tx", tx.signature) : null);
export const addressExplorerUrl = (a: string) => explorerUrl("address", a);

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const fakeSig = () => {
  const bytes = new Uint8Array(88);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => B58[b % 58]).join("");
};
const toB64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/* ---------------- store ---------------- */

let cachedRaw: string | null | undefined;
let cached: TrainingWallet | null = null;
let memoryOnly: TrainingWallet | null = null; // private mode fallback

function getSnapshot(): TrainingWallet | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return memoryOnly;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? (JSON.parse(raw) as TrainingWallet) : null;
    } catch {
      cached = null;
    }
  }
  return cached ?? memoryOnly;
}

function save(w: TrainingWallet) {
  try {
    localStorage.setItem(KEY, JSON.stringify(w));
  } catch {
    memoryOnly = w;
  }
  emit();
}

// live devnet balance (not persisted)
type Busy = "" | "faucet" | "send" | "swap" | "stake" | "mint";
type Status = { balance: number | null; busy: Busy; lastError: string };
let balance: number | null = null;
let busy: Busy = "";
let lastError = "";
let status: Status = { balance, busy, lastError };
function emit() {
  status = { balance, busy, lastError };
  window.dispatchEvent(new Event(EVENT));
}
const getStatus = () => status;
const serverStatus: Status = { balance: null, busy: "", lastError: "" };

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function resetTrainingWallet() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  memoryOnly = null;
  balance = null;
  lastError = "";
  emit();
}

let creating: Promise<TrainingWallet> | null = null;
async function ensureWallet(): Promise<TrainingWallet> {
  const existing = getSnapshot();
  if (existing) return existing;
  creating ??= (async () => {
    const seed = newSeed();
    const signer = await signerFromSeed(seed);
    const w: TrainingWallet = { mode: "devnet", seed: toB64(seed), address: signer.address, simSol: 5, tokens: {}, txs: [] };
    save(w);
    return w;
  })();
  try {
    return await creating;
  } finally {
    creating = null;
  }
}

function update(fn: (w: TrainingWallet) => TrainingWallet) {
  const w = getSnapshot();
  if (w) save(fn(w));
}
const addTx = (tx: PracticeTx) => update((w) => ({ ...w, txs: [tx, ...w.txs] }));

async function refreshBalance() {
  const w = getSnapshot();
  if (!w || w.mode !== "devnet") return;
  try {
    balance = await getBalanceSol(w.address);
    if (lastError.startsWith("We couldn't reach")) lastError = "";
    emit();
  } catch (e) {
    // first load failed: say so, so the learner isn't left with a dead button
    if (balance === null) {
      lastError = friendly(e, "We couldn't reach the Solana devnet. Check your connection and try again.");
      if (!/reach/.test(lastError)) lastError = "We couldn't reach the Solana devnet right now.";
      emit();
    }
  }
}

const friendly = (e: unknown, fallback: string) => {
  const m = e instanceof Error ? e.message : "";
  if (/429|rate|limit|airdrop/i.test(m)) return "The free devnet tap is busy right now (it limits how often it pours).";
  if (/fetch|network|Failed/i.test(m)) return "We couldn't reach the Solana devnet. Check your connection and try again.";
  return m && m.length < 140 ? m : fallback;
};

/* ---------------- hook ---------------- */

export function useTrainingWallet() {
  const wallet = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const st = useSyncExternalStore(subscribe, getStatus, () => serverStatus);

  // keep the real balance fresh while a page shows the wallet
  useEffect(() => {
    if (wallet?.mode !== "devnet") return;
    refreshBalance();
    const id = window.setInterval(refreshBalance, 6000);
    return () => clearInterval(id);
  }, [wallet?.mode, wallet?.address]);

  const ensure = useCallback(() => ensureWallet(), []);

  const switchToPractice = useCallback(() => {
    lastError = "";
    update((w) => ({ ...w, mode: "practice" }));
  }, []);

  const faucet = useCallback(async () => {
    const w = await ensureWallet();
    if (w.mode !== "devnet") return;
    busy = "faucet";
    lastError = "";
    emit();
    try {
      const sig = await requestAirdrop(w.address, 1);
      addTx({ signature: sig, kind: "faucet", label: "Received 1 SOL from the devnet faucet", amountSol: 1, feeSol: 0, at: Date.now(), real: true });
      await refreshBalance();
    } catch (e) {
      lastError = friendly(e, "The faucet didn't answer. Try again in a minute.");
    } finally {
      busy = "";
      emit();
    }
  }, []);

  const send = useCallback(async (amount: number): Promise<PracticeTx | null> => {
    const w = await ensureWallet();
    busy = "send";
    lastError = "";
    emit();
    try {
      let tx: PracticeTx;
      if (w.mode === "devnet") {
        const signer = await signerFromSeed(fromB64(w.seed));
        const sig = await sendSol(signer, PRACTICE_FRIEND_ADDRESS, amount);
        tx = { signature: sig, kind: "send", label: `Sent ${amount} SOL to a friend`, amountSol: -amount, feeSol: 0.000005, at: Date.now(), real: true };
        addTx(tx);
        await refreshBalance();
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        tx = { signature: fakeSig(), kind: "send", label: `Sent ${amount} SOL to a friend`, amountSol: -amount, feeSol: SIM_FEE, at: Date.now(), real: false };
        update((x) => ({ ...x, simSol: Math.max(0, x.simSol - amount - SIM_FEE), txs: [tx, ...x.txs] }));
      }
      return tx;
    } catch (e) {
      lastError = friendly(e, "The transfer didn't go through. Please try again.");
      return null;
    } finally {
      busy = "";
      emit();
    }
  }, []);

  // Practice-only for now: there's no devnet market for our Ocean Token yet.
  const simulated = useCallback(
    async (kind: "swap" | "stake", label: string, payAmount: number, gain: Record<string, number>) => {
      await ensureWallet();
      busy = kind;
      emit();
      await new Promise((r) => setTimeout(r, 1000));
      const tx: PracticeTx = { signature: fakeSig(), kind, label, amountSol: -payAmount, feeSol: SIM_FEE, at: Date.now(), real: false };
      update((x) => {
        const tokens = { ...x.tokens };
        for (const [k, v] of Object.entries(gain)) tokens[k] = (tokens[k] ?? 0) + v;
        return { ...x, tokens, simSol: x.mode === "practice" ? Math.max(0, x.simSol - payAmount - SIM_FEE) : x.simSol, txs: [tx, ...x.txs] };
      });
      busy = "";
      emit();
      return tx;
    },
    [],
  );

  const swap = useCallback(
    (pay: number, get: number, symbol: string) => simulated("swap", `Swapped ${pay} SOL for ${get} ${symbol}`, pay, { [symbol]: get }),
    [simulated],
  );
  const stake = useCallback(
    (amount: number) => simulated("stake", `Staked ${amount} SOL with Marinade (practice)`, amount, { mSOL: amount }),
    [simulated],
  );

  /** Mint the mascot NFT to the training wallet, or to another address (e.g. the learner's Phantom). */
  const mintMascot = useCallback(async (recipient?: string) => {
    const w = await ensureWallet();
    busy = "mint";
    lastError = "";
    emit();
    try {
      const owner = recipient || w.address;
      if (w.mode === "devnet") {
        const signer = await signerFromSeed(fromB64(w.seed));
        if ((balance ?? 0) < 0.01) {
          // a fresh wallet (lessons done in practice mode, or a new browser): top up first
          const a = await requestAirdrop(w.address, 1);
          addTx({ signature: a, kind: "faucet", label: "Received 1 SOL from the devnet faucet", amountSol: 1, feeSol: 0, at: Date.now(), real: true });
        }
        const { mint, signature } = await mintMascotNft(signer, owner, {
          name: "Pebble the Sea Turtle",
          symbol: "VOYAGE",
          uri: `${window.location.origin}/mascot/pebble.json`,
        });
        update((x) => ({
          ...x,
          mascot: { mint, signature, owner, real: true },
          txs: [{ signature, kind: "mint", label: "Minted Pebble the Sea Turtle NFT", amountSol: 0, feeSol: 0.000005, at: Date.now(), real: true }, ...x.txs],
        }));
        await refreshBalance();
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        update((x) => ({ ...x, mascot: { mint: fakeSig().slice(0, 44), signature: fakeSig(), owner, real: false } }));
      }
      return true;
    } catch (e) {
      lastError = friendly(e, "Minting didn't go through. Please try again.");
      return false;
    } finally {
      busy = "";
      emit();
    }
  }, []);

  const sol = wallet ? (wallet.mode === "devnet" ? st.balance : wallet.simSol) : null;

  return {
    wallet,
    sol, // null while the devnet balance is loading
    busy: st.busy,
    error: st.lastError,
    ensure,
    faucet,
    send,
    swap,
    stake,
    mintMascot,
    switchToPractice,
  };
}
