"use client";

// Is this browser logged in as admin? (Asked once per page load from /api/admin/session;
// the httpOnly cookie itself is never readable here.) Admin only unlocks demo shortcuts.

import { useSyncExternalStore } from "react";

type State = { admin: boolean; configured: boolean; ready: boolean };
let state: State = { admin: false, configured: false, ready: false };
let started = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((cb) => cb());

export async function refreshAdmin() {
  try {
    const r = await fetch("/api/admin/session", { cache: "no-store" });
    const d = (await r.json()) as { admin?: boolean; configured?: boolean };
    state = { admin: !!d.admin, configured: !!d.configured, ready: true };
  } catch {
    state = { ...state, ready: true };
  }
  emit();
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  if (!started) {
    started = true;
    refreshAdmin();
  }
  return () => listeners.delete(cb);
};
const SERVER: State = { admin: false, configured: false, ready: false };

export function useAdmin(): State {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}

export async function adminLogin(password: string): Promise<"ok" | "wrong" | "tooMany" | "notConfigured" | "network"> {
  try {
    const r = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.ok) {
      await refreshAdmin();
      return "ok";
    }
    const d = (await r.json().catch(() => ({}))) as { error?: string };
    return d.error === "tooMany" || d.error === "notConfigured" ? d.error : "wrong";
  } catch {
    return "network";
  }
}

export async function adminLogout() {
  await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
  await refreshAdmin();
}
