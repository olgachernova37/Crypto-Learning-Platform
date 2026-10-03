"use client";

// Home: a glowing Earth on a dark sea-night sky, one headline, one button.
// "Start your journey" zooms into the globe until the screen is ocean, then opens /journey.

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { lessons } from "@/content/lessons";
import { Globe } from "./Globe";
import { useReducedMotion } from "./useMedia";
import styles from "./ocean.module.css";

const STARS = Array.from({ length: 70 }, (_, i) => {
  // deterministic pseudo-random positions so server and client agree
  const a = Math.sin(i * 127.1) * 43758.5453;
  const b = Math.sin(i * 311.7) * 12543.1234;
  const c = Math.sin(i * 74.7) * 9631.77;
  return {
    x: (a - Math.floor(a)) * 100,
    y: (b - Math.floor(b)) * 100,
    r: 0.4 + (c - Math.floor(c)) * 0.9,
    o: 0.15 + (c - Math.floor(c)) * 0.45,
  };
});

export function GlobeStart() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const speed = useRef(1);
  const globeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const seaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    router.prefetch("/journey");
  }, [router]);

  const start = () => {
    if (leaving) return;
    if (reduced || typeof globeRef.current?.animate !== "function") {
      router.push("/journey");
      return;
    }
    setLeaving(true);
    const ease = "cubic-bezier(0.55, 0, 0.2, 1)";
    textRef.current?.animate(
      [
        { opacity: 1, transform: "none", filter: "blur(0)" },
        { opacity: 0, transform: "translateY(-24px) scale(0.98)", filter: "blur(6px)" },
      ],
      { duration: 550, easing: "ease-in", fill: "forwards" },
    );
    globeRef.current?.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(2.2)", opacity: 1, offset: 0.55 },
        { transform: "scale(5.5)", opacity: 0.15 },
      ],
      { duration: 1500, easing: ease, fill: "forwards" },
    );
    const sea = seaRef.current?.animate(
      [
        { opacity: 0, transform: "scale(0.4)" },
        { opacity: 0, transform: "scale(0.4)", offset: 0.35 },
        { opacity: 1, transform: "scale(1.6)" },
      ],
      { duration: 1500, easing: ease, fill: "forwards" },
    );
    // spin up the Earth as we dive in
    const t0 = performance.now();
    const spin = () => {
      const k = Math.min(1, (performance.now() - t0) / 1200);
      speed.current = 1 + k * 6;
      if (k < 1) requestAnimationFrame(spin);
    };
    requestAnimationFrame(spin);
    const go = () => router.push("/journey");
    if (sea) sea.finished.then(go, go);
    else setTimeout(go, 1500);
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-sea-night text-white">
      {/* sky */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(90% 70% at 50% 60%, #12385a 0%, #0b2540 40%, #061423 100%)" }}
        aria-hidden="true"
      />
      <svg className={`absolute inset-0 h-full w-full ${styles.fadeIn}`} aria-hidden="true">
        {STARS.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#dbeaf3" opacity={s.o} />
        ))}
      </svg>

      {/* globe */}
      <div
        ref={globeRef}
        className="absolute left-1/2 top-[58%] w-[min(132vw,82vh)] -translate-x-1/2 -translate-y-1/2 md:top-[56%] md:w-[min(76vw,92vh,900px)]"
        style={{ transformOrigin: "50% 42%" }}
      >
        {/* atmosphere */}
        <div
          className="pointer-events-none absolute inset-[-8%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(183,212,230,0.20) 0%, rgba(107,167,160,0.10) 48%, transparent 66%)",
          }}
          aria-hidden="true"
        />
        <Globe speedRef={speed} reduced={reduced} />
        {/* sunlit ocean tint on the sphere (cobe draws the sphere ~80% of the canvas) */}
        <div
          className="pointer-events-none absolute inset-[10%] rounded-full mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle at 34% 28%, rgba(46,120,150,0.55) 0%, rgba(30,90,110,0.32) 38%, rgba(13,43,69,0.12) 70%, transparent 72%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* readability: a soft dark pool behind the headline */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 38% at 50% 44%, rgba(6,20,35,0.55) 0%, transparent 100%)" }}
        aria-hidden="true"
      />

      {/* the sea we dive into */}
      <div
        ref={seaRef}
        className="pointer-events-none absolute inset-0 z-20 opacity-0"
        style={{ background: "radial-gradient(circle at 50% 50%, #1e5a6e 0%, #0d2b45 45%, #081c2e 100%)" }}
        aria-hidden="true"
      />

      {/* words */}
      <div
        ref={textRef}
        className={`relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 pb-[12vh] text-center md:pb-[8vh] ${styles.cardIn}`}
      >
        <p className="label-mono flex items-center text-light-sky/90">
          <span className="mr-2.5 inline-block h-1.5 w-1.5 bg-sandy-beige" aria-hidden="true" />
          Crypto Voyage · {lessons.length} small lessons
        </p>
        <h1 className="mt-5 max-w-[13ch] text-balance text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white [text-shadow:0_4px_40px_rgba(6,20,35,0.6)] sm:text-6xl md:text-[5.6rem]">
          Your crypto voyage starts here
        </h1>
        <p className="mt-5 max-w-[34ch] text-balance text-base font-light leading-relaxed text-white/85 md:mt-6 md:text-lg">
          Learn crypto from zero, one small step at a time — no jargon, no real money.
        </p>
        <button
          type="button"
          onClick={start}
          disabled={leaving}
          className="group mt-8 inline-flex min-h-14 items-center gap-3 rounded-full bg-white py-2 pl-7 pr-3 text-base font-bold text-deep-ocean shadow-[0_12px_40px_rgba(2,12,22,0.45)] transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.98] md:mt-10"
        >
          Start your journey
          <span className="grid h-9 w-9 place-items-center rounded-full bg-sandy-beige/35" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-sandy-beige transition-transform duration-300 group-hover:scale-150" />
          </span>
        </button>
      </div>

      {/* tiny footer labels, OceanX style */}
      <p
        className={`label-mono pointer-events-none absolute bottom-6 left-6 z-10 hidden text-light-sky/55 md:block ${styles.fadeIn}`}
      >
        <span className="mr-2 inline-block h-1.5 w-1.5 bg-light-sky/55" aria-hidden="true" />
        Solana devnet
        <br />
        <span className="ml-3.5">No real money</span>
      </p>
      <p
        className={`label-mono pointer-events-none absolute bottom-6 right-6 z-10 hidden text-light-sky/55 md:block ${styles.fadeIn}`}
      >
        Drag to spin the Earth
      </p>
    </main>
  );
}
