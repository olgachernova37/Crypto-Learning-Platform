"use client";

// The learner's light "registration": just a name (no email, no password), kept on this device
// and sent once to /api/learners so the admin can see who joined.

import { useSyncExternalStore } from "react";

export type Profile = { id: string; name: string; joinedAt: string };

const KEY = "crypto-voyage-profile-v1";
const listeners = new Set<() => void>();
let cache: Profile | null | undefined;

function read(): Profile | null {
  if (cache !== undefined) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const p = raw ? (JSON.parse(raw) as Profile) : null;
    cache = p && typeof p.name === "string" && p.name.trim() ? p : null;
  } catch {
    cache = null;
  }
  return cache;
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = undefined;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

export function saveName(name: string, locale: string): Profile {
  const prev = read();
  const p: Profile = { id: prev?.id ?? newId(), name: name.trim().slice(0, 40), joinedAt: prev?.joinedAt ?? new Date().toISOString() };
  cache = p;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage blocked: keep it for this visit */
  }
  listeners.forEach((cb) => cb());
  // tell the server (best effort; the app works the same if this fails)
  fetch("/api/learners", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: p.id, name: p.name, locale }),
    keepalive: true,
  }).catch(() => {});
  return p;
}

/** `ready` is false during server render / before hydration, so gates don't flash. */
export function useProfile(): { profile: Profile | null; ready: boolean } {
  const profile = useSyncExternalStore(subscribe, read, () => null);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  return { profile, ready };
}


/**
 * "Delete my data" (/privacy): removes the name from our server, then clears everything this site
 * saved in this browser (name, progress, practice wallet, Phantom address). The language choice stays.
 * Returns false if the server couldn't be reached (the browser is cleared anyway).
 */
export async function deleteMyData(): Promise<boolean> {
  const p = read();
  let ok = true;
  if (p) {
    try {
      const res = await fetch("/api/learners", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: p.id }),
      });
      ok = res.ok;
    } catch {
      ok = false;
    }
  }
  try {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith("crypto-voyage-") && k !== "crypto-voyage-locale") localStorage.removeItem(k);
    }
  } catch {
    /* storage blocked: nothing saved anyway */
  }
  return ok;
}
