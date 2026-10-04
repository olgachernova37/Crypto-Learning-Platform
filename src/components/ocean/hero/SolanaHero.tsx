"use client";

// Landing page (/): the entrance to the voyage. Solana is the first destination — an illustrated,
// slightly magical planet — and our little boat (the same one that sails the lesson route) is
// arriving along a dotted route of light. One clear call to action leads to /journey.

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useT } from "@/i18n";
import { useLessons } from "@/i18n/lessons";
import { Boat } from "../Boat";
import s from "./solana-hero.module.css";

// fixed star field (deterministic, so server and client render the same)
const STARS = Array.from({ length: 70 }, (_, i) => {
  const f = (n: number) => n - Math.floor(n);
  return {
    x: f(Math.sin(i * 127.1) * 43758.5453) * 100,
    y: f(Math.sin(i * 311.7) * 12543.1234) * 100,
    r: 0.6 + f(Math.sin(i * 74.7) * 9631.77) * 1.4,
    d: f(Math.sin(i * 19.3) * 3121.3) * 6,
  };
});

export function SolanaHero() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const t = useT();
  const lessons = useLessons();
  const minutes = Math.round(lessons.reduce((n, l) => n + l.minutes, 0) / 5) * 5;

  useEffect(() => {
    router.prefetch("/journey");
  }, [router]);

  const start = () => {
    if (leaving) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return router.push("/journey");
    setLeaving(true);
    window.setTimeout(() => router.push("/journey"), 1100);
  };

  return (
    <main className={`${s.stage} ${leaving ? s.leaving : ""}`}>
      {/* sky */}
      <div className={s.sky} aria-hidden="true">
        {STARS.map((st, i) => (
          <span
            key={i}
            className={s.star}
            style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.r * 2, height: st.r * 2, animationDelay: `${st.d}s` }}
          />
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <span key={`p${i}`} className={s.particle} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 1.7) % 12}s` }} />
        ))}
      </div>

      <div className={s.layout}>
        {/* the world */}
        <div className={s.visual} aria-hidden="true">
          <SolanaWorld />
          <div className={s.tag}>
            <span className={s.tagDot} />
            <span>
              <strong>{t.home.tagTitle}</strong>
              <br />
              {t.home.tagLine}
            </span>
          </div>
        </div>

        {/* the words */}
        <section className={s.copy} aria-labelledby="hero-title">
          <p className={s.eyebrow}>{t.home.eyebrow}</p>
          <h1 id="hero-title" className={s.title}>
            <span className={s.titleLead}>{t.home.titleLead}</span>
            <span className={s.titleWorld}>Solana</span>
          </h1>
          <p className={s.lede}>
            {t.home.lede}
          </p>

          <div className={s.ctaRow}>
            <button type="button" className={s.cta} onClick={start} disabled={leaving}>
              {t.home.cta}
              <span className={s.ctaArrow} aria-hidden="true">
                →
              </span>
            </button>
            <p className={s.note}>
              {t.home.note(lessons.length, minutes)}
            </p>
          </div>

          <div className={s.route}>
            <p className={s.routeLabel}>{t.home.routeLabel}</p>
            <ol className={s.routeList}>
              {t.home.route.map((r, i) => (
                <li key={i} className={i === 1 ? s.routeHere : undefined}>
                  {r}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      <div className={s.dive} aria-hidden="true" />
    </main>
  );
}

/** Illustrated Solana-inspired planet with rings, a small moon, and our boat arriving on a route of light. */
function SolanaWorld() {
  return (
    <div className={s.world}>
      <div className={s.glow} />
      <svg viewBox="0 0 640 640" className={s.planetSvg}>
        <defs>
          <radialGradient id="sh-body" cx="34%" cy="28%" r="78%">
            <stop offset="0" stopColor="#9ff3dd" />
            <stop offset="0.28" stopColor="#4cc3d9" />
            <stop offset="0.58" stopColor="#5b6ee8" />
            <stop offset="0.85" stopColor="#5a33b8" />
            <stop offset="1" stopColor="#2b1666" />
          </radialGradient>
          <radialGradient id="sh-shade" cx="70%" cy="78%" r="70%">
            <stop offset="0" stopColor="#0a0730" stopOpacity="0.75" />
            <stop offset="0.55" stopColor="#0a0730" stopOpacity="0.15" />
            <stop offset="1" stopColor="#0a0730" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sh-band" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sh-ring" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9b7bff" stopOpacity="0.15" />
            <stop offset="0.45" stopColor="#7ee0f0" stopOpacity="0.85" />
            <stop offset="1" stopColor="#6ff0b8" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="sh-route" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#b7d4e6" stopOpacity="0" />
            <stop offset="0.35" stopColor="#b7d4e6" stopOpacity="0.7" />
            <stop offset="1" stopColor="#7ee0f0" stopOpacity="0.9" />
          </linearGradient>
          <clipPath id="sh-front">
            <rect x="0" y="290" width="700" height="120" />
          </clipPath>
          <clipPath id="sh-clip">
            <circle cx="350" cy="290" r="185" />
          </clipPath>
        </defs>

        {/* ring, back half (behind the planet) */}
        <g className={s.ringSpin}>
          <ellipse cx="350" cy="290" rx="275" ry="62" transform="rotate(-16 350 290)" fill="none" stroke="url(#sh-ring)" strokeWidth="3" opacity="0.55" />
        </g>

        {/* planet */}
        <g className={s.planetFloat}>
          <circle cx="350" cy="290" r="198" fill="#7ee0f0" opacity="0.12" />
          <circle cx="350" cy="290" r="185" fill="url(#sh-body)" />
          <g clipPath="url(#sh-clip)">
            {/* soft continents */}
            <path d="M210 230c40-40 110-50 150-20s20 80-30 90-60 40-100 20-60-50-20-90z" fill="#c9fbe9" opacity="0.22" />
            <path d="M380 360c40-20 100-10 120 25s-10 70-60 70-90-20-90-50 0-35 30-45z" fill="#c9fbe9" opacity="0.16" />
            <path d="M420 170c30-10 70 0 80 25s-25 40-55 35-50-50-25-60z" fill="#c9fbe9" opacity="0.18" />
            {/* three slanted light bands: a quiet nod to Solana */}
            <g transform="rotate(-12 350 290)">
              <rect x="150" y="200" width="420" height="18" rx="9" fill="url(#sh-band)" />
              <rect x="130" y="262" width="440" height="18" rx="9" fill="url(#sh-band)" />
              <rect x="150" y="324" width="420" height="18" rx="9" fill="url(#sh-band)" />
            </g>
            {/* twinkling settlement lights */}
            {[
              [300, 250],
              [338, 236],
              [455, 395],
              [430, 205],
              [262, 300],
              [480, 300],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3.2" fill="#fff6d8" className={s.light} style={{ animationDelay: `${i * 0.7}s` }} />
            ))}
            <circle cx="350" cy="290" r="185" fill="url(#sh-shade)" />
          </g>
          {/* rim light */}
          <circle cx="350" cy="290" r="185" fill="none" stroke="#c7f6ff" strokeOpacity="0.55" strokeWidth="2" />
        </g>

        {/* ring, front half (over the planet) */}
        <g className={s.ringSpin}>
          <g transform="rotate(-16 350 290)">
            <ellipse cx="350" cy="290" rx="275" ry="62" fill="none" stroke="url(#sh-ring)" strokeWidth="4" clipPath="url(#sh-front)" />
          </g>
        </g>

        {/* a little moon on its orbit */}
        <g className={s.moonOrbit}>
          <circle cx="590" cy="120" r="16" fill="#e9dcc6" />
          <circle cx="585" cy="115" r="4" fill="#d6c3a2" />
        </g>

        {/* the route of light the boat sails in on (same dotted route as the lessons) */}
        <path
          d="M30 640 C 90 540, 120 500, 190 470 S 270 430, 300 400"
          fill="none"
          stroke="url(#sh-route)"
          strokeWidth="3"
          strokeDasharray="2 10"
          strokeLinecap="round"
          className={s.routeFlow}
        />
      </svg>

      {/* our boat, arriving */}
      <div className={s.boat}>
        <span className={s.wake} />
        <Boat className={s.boatSvg} />
      </div>
    </div>
  );
}
