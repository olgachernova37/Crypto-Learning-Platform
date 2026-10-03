"use client";

import { useSyncExternalStore } from "react";

/** Subscribe to a CSS media query. Returns `fallback` during SSR. */
export function useMediaQuery(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** Phones and narrow tablets: the route runs vertically and the card sits at the bottom. */
export const useIsNarrow = () => useMediaQuery("(max-width: 767px)");
