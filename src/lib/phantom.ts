"use client";

// "Connect Phantom": asks the Phantom extension / in-app browser for the learner's PUBLIC address only.
// We never request a signature or a transaction here, and never touch keys or recovery phrases.
// On a phone without the extension we offer Phantom's universal link, which reopens this page
// inside the Phantom app's browser (where window.phantom.solana exists).

import { useSyncExternalStore } from "react";

type PublicKeyLike = { toString(): string };
type PhantomProvider = {
  isPhantom?: boolean;
  publicKey?: PublicKeyLike | null;
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: PublicKeyLike }>;
  disconnect(): Promise<void>;
};

export function getPhantom(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { phantom?: { solana?: PhantomProvider }; solana?: PhantomProvider };
  const p = w.phantom?.solana ?? (w.solana?.isPhantom ? w.solana : undefined);
  return p?.isPhantom ? p : null;
}

export const isMobileDevice = () => typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/** Opens the current page inside the Phantom app (phones). */
export function phantomBrowseLink(): string {
  const url = window.location.href;
  return `https://phantom.app/ul/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(window.location.origin)}`;
}

export type ConnectResult = { ok: true; address: string } | { ok: false; reason: "notInstalled" | "rejected" };

// remember the connected PUBLIC address so other screens can prefill it
const KEY = "crypto-voyage-phantom-v1";
const listeners = new Set<() => void>();
const read = () => {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
};
const save = (v: string) => {
  try {
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
  listeners.forEach((cb) => cb());
};

export async function connectPhantom(): Promise<ConnectResult> {
  const p = getPhantom();
  if (!p) return { ok: false, reason: "notInstalled" };
  try {
    const res = await p.connect();
    const address = res.publicKey.toString();
    save(address);
    return { ok: true, address };
  } catch {
    // the learner closed or rejected the pop-up
    return { ok: false, reason: "rejected" };
  }
}

export async function forgetPhantom() {
  save("");
  try {
    await getPhantom()?.disconnect();
  } catch {
    /* already disconnected */
  }
}

export function usePhantomAddress(): string {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => "",
  );
}
