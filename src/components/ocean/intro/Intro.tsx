"use client";

// Home intro (/), built on the "portal" mechanics:
//  1. Preloader: our wave logo floats dead-centre, a thin 0–100% counter at the bottom.
//     The % follows real readiness (fonts + first Earth frame) with a ~2.6 s minimum.
//  2. At 100% the counter blurs away and the logo glides into the top bar's logo slot;
//     the top bar fades down.
//  3. A rounded window opens in the centre of a full-screen canvas mask. Behind it a
//     SCREEN-LOCKED Earth scene (cobe globe + sky + clouds) — the window moves and tilts
//     toward the pointer (fake 3D, focal 850), the Earth stays put.
//  4. Title + friendly course facts rise in.
//  5. Click the window (or the pill): chrome blurs out, the window swallows the screen,
//     the camera dives into the ocean and we land on /journey, which opens from the same blue.

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { lessons, lessonNum } from "@/content/lessons";
import { useProgress } from "@/lib/progress";
import { WaveLogo } from "@/components/shell/icons";
import { createEarthScene } from "./earthScene";
import { animateValue, project, roundedRectPoints } from "./portalMath";
import s from "./intro.module.css";

type Stage = "preload" | "docking" | "ready";

// Rules that reach into the shared top bar during the intro (hide, then reveal it; hide its
// logo mark until ours has docked on top of it) and swap the cursor on fine pointers.
const GLOBAL_CSS = `
html[data-intro="preload"] [data-shell-header]{opacity:0}
html[data-intro="preload"] [data-shell-header] *{pointer-events:none!important}
html[data-intro="reveal"] [data-shell-header]{animation:cv-reveal-down .9s cubic-bezier(.22,1,.36,1) .1s both}
html[data-intro="preload"] [data-shell-logo],html[data-intro="reveal"] [data-shell-logo]{visibility:hidden}
html[data-cursor="custom"],html[data-cursor="custom"] *{cursor:none!important}
html[data-intro="done"] [data-intro-preload]{display:none}
@keyframes cv-reveal-down{from{opacity:0;filter:blur(8px);transform:translateY(-18px)}to{opacity:1;filter:blur(0);transform:translateY(0)}}
@media (prefers-reduced-motion:reduce){html[data-intro="reveal"] [data-shell-header]{animation:none}}
`;

const STARS = Array.from({ length: 90 }, (_, i) => {
  const a = Math.sin(i * 127.1) * 43758.5453;
  const b = Math.sin(i * 311.7) * 12543.1234;
  const c = Math.sin(i * 74.7) * 9631.77;
  const f = (n: number) => n - Math.floor(n);
  return { x: f(a) * 100, y: f(b) * 70, r: 0.4 + f(c) * 0.9, o: 0.12 + f(c) * 0.45 };
});

const SEEN_KEY = "crypto-voyage-intro-seen";
const MIN_PRELOAD_MS = 2600;
const MAX_PRELOAD_MS = 7000;

export function Intro() {
  const router = useRouter();
  const { progress } = useProgress();

  const [stage, setStage] = useState<Stage>("preload");
  const [countLeaving, setCountLeaving] = useState(false);
  const [countGone, setCountGone] = useState(false);
  const [logoGone, setLogoGone] = useState(false);
  const [maskRevealing, setMaskRevealing] = useState(false);
  const [contentRevealing, setContentRevealing] = useState(false);
  const [travelling, setTravelling] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portalRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<() => void>(() => {});

  // What's next for this learner (first unfinished lesson, or the reward).
  const next = useMemo(() => {
    const done = new Set(progress.completedLessons);
    const l = lessons.find((x) => !done.has(x.id));
    return l ? { num: `[${lessonNum(l.number)}]`, name: l.title } : { num: "[★]", name: "Your reward" };
  }, [progress.completedLessons]);

  const facts = useMemo(() => {
    const minutes = lessons.reduce((n, l) => n + l.minutes, 0);
    return [
      ["Lessons:", `${lessons.length} short lessons + your mascot`],
      ["Time:", `About ${Math.round(minutes / 5) * 5} minutes`],
      ["Money needed:", "None — we practise with test coins"],
      ["Reward:", "Your own NFT sea mascot"],
    ];
  }, []);

  // Decide before the first paint whether the preloader plays (once per session, never
  // under reduced motion), so the top bar / floating logo never flash.
  useLayoutEffect(() => {
    const html = document.documentElement;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    html.dataset.intro = seen || reduced ? "done" : "preload";
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const canvas = canvasRef.current;
    const portal = portalRef.current;
    if (!canvas || !portal) return;
    const ctx = canvas.getContext("2d");
    const scene = createEarthScene();
    if (!ctx || !scene) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    const m = {
      rotX: 0,
      rotY: 0,
      tX: 0,
      tY: 0,
      expansion: 0,
      maskScale: 0,
      zoom: 0,
      busy: false,
      vw: 0,
      vh: 0,
      // cursor
      px: -100,
      py: -100,
      cx: -100,
      cy: -100,
    };
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    let alive = true;

    /* ---------- sizing ---------- */
    const resize = () => {
      m.vw = window.innerWidth;
      m.vh = window.innerHeight;
      const d = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(m.vw * d);
      canvas.height = Math.round(m.vh * d);
      canvas.style.width = `${m.vw}px`;
      canvas.style.height = `${m.vh}px`;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      scene.resize(m.vw, m.vh);
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------- frame loop ---------- */
    let raf = 0;
    let last = performance.now();
    const t0 = last;
    const frame = () => {
      const now = performance.now();
      const dt = Math.min(40, Math.max(0, now - last));
      last = now;

      if (!m.busy) {
        const k = Math.min(1, dt * 0.009);
        m.rotX += (m.tX - m.rotX) * k;
        m.rotY += (m.tY - m.rotY) * k;
      }

      const rect = portal.getBoundingClientRect();
      const rcx = rect.left + rect.width / 2;
      const rcy = rect.top + rect.height / 2;
      const e = m.expansion;

      // While the window is shut (preloader) render the scene just once, to warm it up.
      const open = m.maskScale > 0 || e > 0;
      if (open || !scene.isReady()) {
        scene.render({
          t: (now - t0) / 1000,
          cx: rcx,
          cy: rcy,
          diameter: Math.min(rect.width, rect.height) * 0.8,
          zoom: m.zoom,
        });
      }

      const cx = rcx + (m.vw / 2 - rcx) * e;
      const cy = rcy + (m.vh / 2 - rcy) * e;
      const baseW = rect.width + (m.vw - rect.width) * e;
      const baseH = rect.height + (m.vh - rect.height) * e;
      const scale = e ? 1 : m.maskScale;
      const w = baseW * scale;
      const h = baseH * scale;
      const radius = (m.vw <= 640 ? 70 : 90) * (1 - e) * scale;
      const rx = m.rotX * (1 - e);
      const ry = m.rotY * (1 - e);

      ctx.clearRect(0, 0, m.vw, m.vh);
      if (w > 1 && h > 1) {
        const pts = roundedRectPoints(w, h, radius).map(([x, y]) => project(x, y, rx, ry, cx, cy));
        ctx.save();
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = "#040c17";
        ctx.fillRect(0, 0, m.vw, m.vh);
        ctx.drawImage(scene.canvas, 0, 0, m.vw, m.vh);
        ctx.restore();
        // a hairline rim so the window reads as glass
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();
        ctx.strokeStyle = `rgba(183, 212, 230, ${0.32 * (1 - e) * scale})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // cursor
      const cur = cursorRef.current;
      if (cur && fine && !reduced) {
        m.cx += (m.px - m.cx) * 0.2;
        m.cy += (m.py - m.cy) * 0.2;
        cur.style.transform = `translate3d(${m.cx}px, ${m.cy}px, 0)`;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // pause when the tab is hidden
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    /* ---------- pointer: tilt + cursor ---------- */
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse" || reduced) return;
      m.px = ev.clientX;
      m.py = ev.clientY;
      cursorRef.current?.classList.add(s.cursorVisible);
      if (m.busy) return;
      m.tY = (ev.clientX / m.vw - 0.5) * 37.4;
      m.tX = (ev.clientY / m.vh - 0.5) * -33;
    };
    const onLeave = () => {
      m.tX = 0;
      m.tY = 0;
      cursorRef.current?.classList.remove(s.cursorVisible);
    };
    const onEnter = () => cursorRef.current?.classList.add(s.cursorEnter);
    const onExit = () => cursorRef.current?.classList.remove(s.cursorEnter);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    portal.addEventListener("pointerenter", onEnter);
    portal.addEventListener("pointerleave", onExit);

    /* ---------- travel ---------- */
    travelRef.current = async () => {
      if (m.busy) return;
      m.busy = true;
      m.tX = m.tY = 0;
      if (reduced) {
        router.push("/journey");
        return;
      }
      cursorRef.current?.classList.remove(s.cursorEnter, s.cursorVisible);
      setTravelling(true);
      const grow = animateValue((v) => (m.expansion = v), 1100);
      await new Promise((r) => later(() => r(null), 320));
      await animateValue((v) => (m.zoom = v), 1400);
      await grow;
      if (alive) router.push("/journey");
    };

    /* ---------- preloader ---------- */
    const revealContent = () => setContentRevealing(true);
    const revealMask = () => {
      setMaskRevealing(true);
      return animateValue((v) => (m.maskScale = v), 1050);
    };

    const dock = () => {
      const logo = logoRef.current;
      const target = document.querySelector("[data-shell-logo]")?.getBoundingClientRect();
      if (logo) {
        const r = target && target.width > 0 ? target : { left: 20, top: 18, width: 28, height: 28 };
        logo.style.left = `${r.left}px`;
        logo.style.top = `${r.top}px`;
        logo.style.width = `${r.width}px`;
        logo.style.height = `${r.height}px`;
        logo.style.transform = "none";
        logo.classList.add(s.docked);
      }
    };

    const finish = () => {
      if (valueRef.current) valueRef.current.textContent = "100";
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* private mode: the preloader simply plays again next time */
      }
      setStage("docking");
      setCountLeaving(true);
      dock();
      html.dataset.intro = "reveal";
      later(() => setCountGone(true), 750);
      later(() => {
        html.dataset.intro = "done";
        setLogoGone(true);
      }, 2050);
      // the window opens while the logo glides; the words follow
      later(() => {
        revealMask().then(() => alive && setStage("ready"));
        later(revealContent, 650);
      }, 250);
    };

    if (fine && !reduced) html.dataset.cursor = "custom";

    if (reduced) {
      html.dataset.intro = "done";
      m.maskScale = 1;
      requestAnimationFrame(() => {
        if (!alive) return;
        setStage("ready");
        setCountGone(true);
        setLogoGone(true);
        setMaskRevealing(true);
        setContentRevealing(true);
      });
    } else if (html.dataset.intro === "done") {
      // Preloader already played this session (e.g. "Back to globe"): just open the window.
      requestAnimationFrame(() => {
        if (!alive) return;
        setStage("docking");
        setCountGone(true);
        setLogoGone(true);
        revealMask().then(() => alive && setStage("ready"));
        later(revealContent, 450);
      });
    } else {
      let fontsReady = false;
      (document.fonts?.ready ?? Promise.resolve()).then(() => (fontsReady = true));
      const start = performance.now();
      let shown = 0;
      let prev = start;
      const tick = () => {
        if (!alive) return;
        const now = performance.now();
        const el = now - start;
        const dts = Math.min(0.1, (now - prev) / 1000);
        prev = now;
        const timeFrac = Math.min(1, el / MIN_PRELOAD_MS);
        const allReady = (fontsReady && scene.isReady()) || el > MAX_PRELOAD_MS;
        const eased = timeFrac < 0.5 ? 2 * timeFrac * timeFrac : 1 - Math.pow(-2 * timeFrac + 2, 2) / 2;
        const target = Math.min(100 * eased, allReady ? 100 : 92);
        shown += (target - shown) * (1 - Math.exp(-dts * 9));
        if (allReady && timeFrac >= 1 && shown > 99.4) {
          finish();
          return;
        }
        if (valueRef.current) valueRef.current.textContent = String(Math.floor(shown));
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    router.prefetch("/journey");

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      portal.removeEventListener("pointerenter", onEnter);
      portal.removeEventListener("pointerleave", onExit);
      delete html.dataset.intro;
      delete html.dataset.cursor;
      scene.destroy();
    };
  }, [router]);

  const rootClass = [
    s.root,
    maskRevealing ? s.maskRevealing : "",
    contentRevealing ? s.contentRevealing : "",
    travelling ? s.travelling : "",
  ].join(" ");

  return (
    <main className={rootClass}>
      <style>{GLOBAL_CSS}</style>
      <h1 className="sr-only">Crypto Voyage: learn crypto from zero</h1>

      <div className={s.sky} aria-hidden="true" />
      <svg className={s.stars} aria-hidden="true">
        {STARS.map((st, i) => (
          <circle key={i} cx={`${st.x}%`} cy={`${st.y}%`} r={st.r} fill="#dbeaf3" opacity={st.o} />
        ))}
      </svg>
      <div className={s.shade} aria-hidden="true" />

      <canvas ref={canvasRef} className={s.portalCanvas} aria-hidden="true" />

      {/* the window */}
      <section className={`${s.chrome} ${s.portalWrap}`} aria-label="Your next stop">
        <div className={s.caption}>
          <span>Next:</span>
          <span>
            <span className={s.num}>{next.num}</span>
            <strong>{next.name}</strong>
          </span>
        </div>
        <button
          ref={portalRef}
          type="button"
          className={s.portal}
          onClick={() => travelRef.current()}
          aria-label="Dive in: start your journey"
          disabled={stage === "preload"}
        />
        <div className={s.pillRow}>
          <button
            type="button"
            onClick={() => travelRef.current()}
            disabled={stage === "preload"}
            className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-white py-1.5 pl-6 pr-2 text-[15px] font-bold text-deep-ocean shadow-[0_12px_40px_rgba(2,12,22,0.45)] transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.98]"
          >
            Start your journey
            <span className="grid h-8 w-8 place-items-center rounded-full bg-sandy-beige/35" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-sandy-beige transition-transform duration-300 group-hover:scale-150" />
            </span>
          </button>
        </div>
      </section>

      {/* title + facts */}
      <section className={`${s.chrome} ${s.content}`} aria-label="About the course">
        <div>
          <p className={s.tagline}>Learn crypto from zero, one small step at a time — no jargon, no real money.</p>
          <p className={s.title} aria-hidden="true">
            <span>EARTH</span>
          </p>
        </div>
        <dl className={s.facts}>
          {facts.map(([k, v]) => (
            <div key={k} className={s.fact}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* preloader */}
      <div className={`${s.preloader} ${stage !== "preload" ? s.preloaderGone : ""}`} aria-hidden="true" />
      {!countGone && (
        <div
          data-intro-preload=""
          className={`${s.count} ${countLeaving ? s.countLeaving : ""}`}
          role="progressbar"
          aria-label="Loading"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span ref={valueRef} className={s.countValue}>
            0
          </span>
          <span className={s.percent}>%</span>
        </div>
      )}
      {!logoGone && (
        <div ref={logoRef} data-intro-preload="" className={s.floatingLogo} aria-hidden="true">
          <WaveLogo size={59} />
        </div>
      )}

      {/* custom cursor (fine pointers) */}
      <div ref={cursorRef} className={s.cursor} aria-hidden="true">
        <span className={s.cursorOrbit} />
        <span className={s.cursorDot} />
        <span className={s.cursorLabel}>Dive in</span>
      </div>
    </main>
  );
}
