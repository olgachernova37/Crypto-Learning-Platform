"use client";

// The in-app TRAINING WALLET: a practice simulator for lessons 2–4 and the Marinade quest.
// Nothing here touches a real blockchain yet — balances and receipts live in localStorage and
// every screen that uses them says "practice". Real devnet transactions replace this later.

import { useCallback, useSyncExternalStore } from "react";

export type PracticeTx = {
  signature: string;
  kind: "faucet" | "send" | "swap" | "stake";
  label: string; // "Sent 1 SOL", "Swapped 0.5 SOL for 10 OCN"
  amountSol: number; // SOL that left (-) or arrived (+)
  feeSol: number;
  at: number; // epoch ms
};

export type TrainingWallet = {
  address: string;
  sol: number;
  tokens: Record<string, number>; // e.g. { OCN: 10, mSOL: 1 }
  txs: PracticeTx[]; // newest first
};

const KEY = "crypto-voyage-training-wallet-v1";
const EVENT = "crypto-voyage-training-wallet";
const FEE = 0.000005; // a typical Solana base fee, in SOL

/** The friendly practice address we send to in lesson 2. */
export const PRACTICE_FRIEND_ADDRESS = "Fr1end7oceanPractice9Yz3kQe4Wq8sNdLm2HbVt5Cx";

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const randomB58 = (len: number) => {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => B58[b % 58]).join("");
};

export const shortAddr = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;

function fresh(): TrainingWallet {
  return {
    address: randomB58(44),
    sol: 5,
    tokens: {},
    txs: [
      {
        signature: randomB58(88),
        kind: "faucet",
        label: "Received 5 SOL from the practice faucet",
        amountSol: 5,
        feeSol: 0,
        at: Date.now(),
      },
    ],
  };
}

let cachedRaw: string | null | undefined;
let cached: TrainingWallet | null = null;

function getSnapshot(): TrainingWallet | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    /* ignore */
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? (JSON.parse(raw) as TrainingWallet) : null;
    } catch {
      cached = null;
    }
  }
  return cached;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function save(w: TrainingWallet) {
  try {
    localStorage.setItem(KEY, JSON.stringify(w));
  } catch {
    /* private mode: works for this page view only */
    cached = w;
  }
  window.dispatchEvent(new Event(EVENT));
}

export function resetTrainingWallet() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Read the training wallet; it is created (with 5 practice SOL) the first time it's needed. */
export function useTrainingWallet() {
  const wallet = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const ensure = useCallback((): TrainingWallet => {
    const w = getSnapshot();
    if (w) return w;
    const created = fresh();
    save(created);
    return created;
  }, []);

  const record = useCallback(
    (change: (w: TrainingWallet) => { next: TrainingWallet; tx: PracticeTx }) => {
      const { next, tx } = change(ensure());
      save({ ...next, txs: [tx, ...next.txs] });
      return tx;
    },
    [ensure],
  );

  const send = useCallback(
    (amount: number) =>
      record((w) => {
        const sol = Math.max(0, w.sol - amount - FEE);
        return {
          next: { ...w, sol },
          tx: { signature: randomB58(88), kind: "send", label: `Sent ${amount} SOL to a friend`, amountSol: -amount, feeSol: FEE, at: Date.now() },
        };
      }),
    [record],
  );

  const swap = useCallback(
    (pay: number, get: number, symbol: string) =>
      record((w) => ({
        next: { ...w, sol: Math.max(0, w.sol - pay - FEE), tokens: { ...w.tokens, [symbol]: (w.tokens[symbol] ?? 0) + get } },
        tx: { signature: randomB58(88), kind: "swap", label: `Swapped ${pay} SOL for ${get} ${symbol}`, amountSol: -pay, feeSol: FEE, at: Date.now() },
      })),
    [record],
  );

  const stake = useCallback(
    (amount: number) =>
      record((w) => ({
        next: { ...w, sol: Math.max(0, w.sol - amount - FEE), tokens: { ...w.tokens, mSOL: (w.tokens.mSOL ?? 0) + amount } },
        tx: { signature: randomB58(88), kind: "stake", label: `Staked ${amount} SOL with Marinade (practice)`, amountSol: -amount, feeSol: FEE, at: Date.now() },
      })),
    [record],
  );

  return { wallet, ensure, send, swap, stake };
}
