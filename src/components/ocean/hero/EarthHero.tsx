"use client";

// Home hero (/), after the MotionSites "space-planet" hero — Earth only, our palette and copy.
// A looping Earth clip fills the screen; centred over it: eyebrow, huge EARTH, a short rule,
// a friendly line and a glossy pill. The pill dives into the ocean: the copy blurs away, the
// Earth swells and the screen fades into the same deep blue /journey opens from.
//
// Assets: the hero clip + still come with the MotionSites prompt and are loaded from its CDN.
// If they fail to load, our own deep-sea gradient stays underneath.

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "@fontsource-variable/inter/wght-italic.css";
import { lessons } from "@/content/lessons";
import s from "./hero.module.css";

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P";
const EARTH_CLIP = `${CDN}/hf_20260827_202422_3ffb4889-c520-432d-8458-038009eb40df.mp4`;
const EARTH_STILL = `${CDN}/hf_20260827_202133_508c64b8-a31e-4290-bdfc-1187df70e0a6.png`;

export function EarthHero() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  // "ready" = composed opening frame (copy hidden), "play" = entrance running, "none" = done.
  // Reduced-motion users get the finished page straight away (handled in CSS).
  const [anim, setAnim] = useState<"none" | "ready" | "play">("ready");
  const [diving, setDiving] = useState(false);
  const minutes = Math.round(lessons.reduce((n, l) => n + l.minutes, 0) / 5) * 5;

  useEffect(() => {
    if (anim !== "ready") return;
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      requestAnimationFrame(() => requestAnimationFrame(() => setAnim("play")));
    };
    (document.fonts?.ready ?? Promise.resolve()).then(go);
    const guard = window.setTimeout(go, 500);
    return () => clearTimeout(guard);
  }, [anim]);

  useEffect(() => {
    if (anim !== "play") return;
    const t = window.setTimeout(() => setAnim("none"), 2150);
    return () => clearTimeout(t);
  }, [anim]);

  useEffect(() => {
    router.prefetch("/journey");
    // iOS sometimes needs an explicit play() for muted autoplay
    videoRef.current?.play().catch(() => {});
  }, [router]);

  const dive = () => {
    if (diving) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push("/journey");
      return;
    }
    setDiving(true);
    window.setTimeout(() => router.push("/journey"), 1250);
  };

  const rootClass = [s.stage, anim !== "none" ? s.anim : "", anim === "play" ? s.play : "", diving ? s.diving : ""].join(" ");

  return (
    <main className={rootClass}>
      <div className={s.sky} style={{ backgroundImage: `url(${EARTH_STILL})` }} aria-hidden="true">
        <video
          ref={videoRef}
          className={s.clip}
          src={EARTH_CLIP}
          poster={EARTH_STILL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>
      <div className={s.shade} aria-hidden="true" />

      <div className={s.copy}>
        <div className={`${s.col} ${s.eyebrow}`}>
          <span className={s.mask}>
            <span className={s.line}>PLANET</span>
          </span>
        </div>
        <h1 className={`${s.col} ${s.title}`}>
          <span className={s.mask}>
            <span className={s.line}>EARTH</span>
          </span>
          <span className="sr-only"> — Crypto Voyage, learn crypto from zero</span>
        </h1>
        <div className={`${s.col} ${s.rule}`} aria-hidden="true">
          <span />
        </div>
        <p className={`${s.col} ${s.lede}`}>
          Learn crypto from zero, one small step at a time — no jargon, no real money. {lessons.length} short lessons,
          about {minutes} minutes, <br />
          and your own NFT sea mascot waiting at the end of the route.
        </p>
        <div className={`${s.col} ${s.cta}`}>
          <button type="button" onClick={dive} disabled={diving}>
            START YOUR JOURNEY
          </button>
        </div>
      </div>

      {/* the dive: deep ocean blue rising over the Earth */}
      <div className={s.sea} aria-hidden="true" />
    </main>
  );
}
