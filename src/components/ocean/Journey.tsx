"use client";

// The boat route (= lesson selection). A top-down sea, a dotted route with one buoy per
// lesson plus a reward flag, and a little boat that sails between them. The selected
// stop's text block fades in bottom-right (desktop) / as a bottom card (phone).
//
// Animation: one requestAnimationFrame loop owns everything that moves every frame —
// the boat's distance along the route (eased), the camera (follows the boat with a
// little lag), the world transform and the canvas sea. React only re-renders when the
// selection changes or the boat arrives.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { lessonNum } from "@/content/lessons";
import { useT } from "@/i18n";
import { useProfile } from "@/lib/profile";
import { useLessons } from "@/i18n/lessons";
import { useProgress } from "@/lib/progress";
import { Boat } from "./Boat";
import { allyAfterLesson, bossInLesson } from "@/content/voyage";
import { StopTeaser } from "@/components/voyage/StopTeaser";
import { Islands } from "./Islands";
import { createOcean } from "./oceanRenderer";
import { buildRoute, pointAt, subPath } from "./route";
import { useIsNarrow, useReducedMotion } from "./useMedia";
import styles from "./ocean.module.css";

type Stop = {
  key: string;
  kind: "lesson" | "reward";
  label: string;
  num: string;
  kicker: string;
  title: string;
  summary: string;
  meta: string;
  href: string;
  cta: string;
  done: boolean;
};

type Motion = {
  placed: boolean;
  route: unknown;
  s: number;
  lastS: number;
  from: number;
  to: number;
  start: number;
  dur: number;
  sailing: boolean;
  index: number;
  reported: number;
  angle: number;
  camX: number;
  camY: number;
  snap: boolean;
  vw: number;
  vh: number;
};

const BOAT_WIDE = 128;
const BOAT_NARROW = 96;

/** Emoji badge on a stop where a crewmate joins or a boss waits. */
const stopBadge = (lessonId: string) => bossInLesson(lessonId)?.emoji ?? allyAfterLesson(lessonId)?.emoji;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function Journey() {
  const { profile } = useProfile();
  const router = useRouter();
  const { progress, ready } = useProgress();
  const narrow = useIsNarrow();
  const reduced = useReducedMotion();
  const t = useT();
  const lessons = useLessons();

  const stops: Stop[] = useMemo(() => {
    const done = new Set(progress.completedLessons);
    const allDone = lessons.every((l) => done.has(l.id));
    return [
      ...lessons.map<Stop>((l) => ({
        key: l.id,
        kind: "lesson",
        label: t.common.lessonLabel(lessonNum(l.number)),
        num: lessonNum(l.number),
        kicker: l.kicker,
        title: l.title,
        summary: l.summary,
        meta: t.journey.lessonMeta(l.minutes, l.xp),
        href: `/lesson/${l.id}`,
        cta: done.has(l.id) ? t.journey.reviewLesson : t.journey.startLesson,
        done: done.has(l.id),
      })),
      {
        key: "reward",
        kind: "reward",
        label: t.journey.reward.label,
        num: "",
        kicker: t.journey.reward.kicker,
        title: t.journey.reward.title,
        summary: allDone ? t.journey.reward.summaryAllDone : t.journey.reward.summary,
        meta: t.journey.reward.meta,
        href: "/finale",
        cta: t.journey.reward.cta,
        done: progress.nftClaimed,
      },
    ];
  }, [progress.completedLessons, progress.nftClaimed, lessons, t]);

  const currentIndex = useMemo(() => {
    const i = stops.findIndex((s) => s.kind === "lesson" && !s.done);
    return i === -1 ? stops.length - 1 : i;
  }, [stops]);

  const route = useMemo(() => buildRoute(stops.length, narrow), [stops.length, narrow]);

  const [picked, setPicked] = useState<number | null>(null);
  const sel = picked ?? currentIndex;
  const [arrivedAt, setArrivedAt] = useState(-1);
  const [leaving, setLeaving] = useState<Stop | null>(null);
  const [touched, setTouched] = useState(false);
  // Wide screens: which half of the sea the mouse is over (-1 = back, 1 = forward, 0 = none).
  const [hoverSide, setHoverSide] = useState<-1 | 0 | 1>(0);
  const cursorRef = useRef<HTMLDivElement>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const boatRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const motion = useRef<Motion>({
    placed: false,
    route: null,
    s: 0,
    lastS: 0,
    from: 0,
    to: 0,
    start: 0,
    dur: 0,
    sailing: false,
    index: -1,
    reported: -1,
    angle: 0,
    camX: 0,
    camY: 0,
    snap: true,
    vw: 0,
    vh: 0,
  });

  // Start sailing whenever the selection changes (or place the boat instantly the first time).
  useEffect(() => {
    if (!ready) return;
    const m = motion.current;
    const target = route.boatS[sel];
    if (!m.placed || m.route !== route || reduced) {
      const firstTime = !m.placed;
      m.placed = true;
      m.route = route;
      m.s = m.lastS = m.from = m.to = target;
      m.sailing = false;
      m.index = sel;
      m.snap = true;
      if (firstTime) m.angle = pointAt(route, target).angle;
      return;
    }
    if (m.index === sel && !m.sailing) return;
    m.from = m.s;
    m.to = target;
    m.start = performance.now();
    m.dur = Math.min(3400, Math.max(1100, 650 + Math.abs(m.to - m.from) * 1.9));
    m.sailing = true;
    m.index = sel;
  }, [ready, sel, route, reduced]);

  // The frame loop: boat, camera, world transform, sea.
  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ocean = createOcean(canvas);
    if (!ocean) return;
    const m = motion.current;

    const resize = () => {
      const rect = root.getBoundingClientRect();
      m.vw = rect.width;
      m.vh = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, rect.width < 768 ? 1.75 : 2);
      ocean.resize(rect.width, rect.height, dpr);
      m.snap = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(root);

    let raf = 0;
    let last = performance.now();
    const t0 = last;
    const boatLen = narrow ? BOAT_NARROW : BOAT_WIDE;

    const frame = (now: number) => {
      const dt = Math.max(0.001, (now - last) / 1000);
      last = now;

      if (m.sailing) {
        const k = Math.min(1, (now - m.start) / m.dur);
        m.s = m.from + (m.to - m.from) * easeInOut(k);
        if (k >= 1) m.sailing = false;
      }
      const p = pointAt(route, m.s);
      const speed = Math.abs(m.s - m.lastS) / dt;
      m.lastS = m.s;

      // Face the way we're going; turn back to face "forward" once moored.
      const goal = m.sailing && m.to < m.from ? p.angle + Math.PI : p.angle;
      let diff = goal - m.angle;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      const turnRate = m.sailing ? 10 : 2.2;
      m.angle += reduced || m.snap ? diff : diff * (1 - Math.exp(-dt * turnRate));

      // Camera: the boat sits a little left of centre (wide) or in the upper half (phone).
      const ax = narrow ? m.vw * 0.5 : m.vw * 0.36;
      const ay = narrow ? m.vh * 0.4 : m.vh * 0.42;
      if (m.snap || reduced) {
        m.camX = p.x;
        m.camY = p.y;
        m.snap = false;
      } else {
        const f = 1 - Math.exp(-dt * 2.6);
        m.camX += (p.x - m.camX) * f;
        m.camY += (p.y - m.camY) * f;
      }
      const viewX = m.camX - ax;
      const viewY = m.camY - ay;

      if (worldRef.current) worldRef.current.style.transform = `translate3d(${-viewX}px, ${-viewY}px, 0)`;
      if (boatRef.current)
        boatRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${m.angle}rad)`;

      ocean.draw({
        t: (now - t0) / 1000,
        dt,
        viewX,
        viewY,
        boat: m.placed ? { x: p.x, y: p.y, angle: m.angle, speed, length: boatLen } : undefined,
        still: reduced,
      });

      if (m.placed && !m.sailing && m.reported !== m.index) {
        m.reported = m.index;
        setArrivedAt(m.index);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [route, reduced, narrow]);

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(stops.length - 1, i));
      setTouched(true);
      setPicked(next);
    },
    [stops.length],
  );
  const step = useCallback((d: number) => goTo(sel + d), [goTo, sel]);

  // Keyboard: arrows sail between stops.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (leaving || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, leaving]);

  // Scroll wheel / trackpad: one notch (or one flick) = one stop.
  const wheel = useRef({ acc: 0, lockUntil: 0, lastAt: 0 });
  const onWheel = (e: React.WheelEvent) => {
    const w = wheel.current;
    const now = performance.now();
    if (now - w.lastAt > 220) w.acc = 0;
    w.lastAt = now;
    if (now < w.lockUntil) return;
    w.acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(w.acc) > 40) {
      step(w.acc > 0 ? 1 : -1);
      w.acc = 0;
      w.lockUntil = now + 850;
    }
  };

  // Wide screens: click the right half of the sea to sail forward, the left half to sail back.
  // A little bubble follows the mouse and says where a click will take you.
  const sideAt = (e: ReactPointerEvent): -1 | 0 | 1 => {
    if (narrow || leaving) return 0;
    if ((e.target as Element | null)?.closest?.("a, button, [data-no-sail]")) return 0;
    const side = e.clientX >= window.innerWidth / 2 ? 1 : -1;
    const target = sel + side;
    return target < 0 || target > stops.length - 1 ? 0 : side;
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const side = sideAt(e);
    if (side !== hoverSide) setHoverSide(side);
    const el = cursorRef.current;
    if (el) el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  };

  // Swipe / drag on the water.
  const drag = useRef<{ x: number; y: number; t: number } | null>(null);
  const onPointerDown = (e: ReactPointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || performance.now() - d.t > 900) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    // A click (not a drag) on the open sea: right half = next stop, left half = previous.
    if (!narrow && Math.hypot(dx, dy) < 8) {
      const side = sideAt(e);
      if (side) step(side);
      return;
    }
    // Phone: the route runs upwards, so swiping up sails forward. Wide: drag left = forward.
    const main = narrow ? -dy : -dx;
    const cross = narrow ? dx : dy;
    if (Math.abs(main) > 46 && Math.abs(main) > Math.abs(cross)) step(main > 0 ? 1 : -1);
    else if (narrow && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  };

  // "Start lesson": the white panel slides in from the right, then fills the screen.
  const openLesson = (e: ReactMouseEvent<HTMLAnchorElement>, stop: Stop) => {
    if (reduced || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const el = overlayRef.current;
    if (!el || typeof el.animate !== "function") return;
    e.preventDefault();
    if (leaving) return;
    setLeaving(stop);
    const radius = narrow ? "28px" : "32px";
    const panelStart = narrow ? "inset(100% 0 0 0 round 28px 28px 0 0)" : `inset(6% 0 6% 100% round ${radius} 0 0 ${radius})`;
    const panelMid = narrow ? "inset(38% 0 0 0 round 28px 28px 0 0)" : `inset(4% 0 4% 58% round ${radius} 0 0 ${radius})`;
    el.style.visibility = "visible";
    const anim = el.animate(
      [
        { clipPath: panelStart, offset: 0 },
        { clipPath: panelMid, offset: 0.45 },
        { clipPath: "inset(0 0 0 0 round 0px)", offset: 1 },
      ],
      { duration: 900, easing: "cubic-bezier(0.65, 0, 0.25, 1)", fill: "forwards" },
    );
    anim.finished.then(() => router.push(stop.href)).catch(() => router.push(stop.href));
  };

  const active = stops[sel];
  const showCard = ready && arrivedAt === sel && !leaving;
  const lastDone = stops.reduce((acc, s, i) => (s.kind === "lesson" && s.done ? i : acc), -1);
  const donePath = lastDone >= 0 ? subPath(route, 0, route.stopS[lastDone]) : null;
  const b = route.bounds;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 touch-none select-none overflow-hidden bg-sea-night text-white"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHoverSide(0)}
      onPointerCancel={() => (drag.current = null)}
      style={{ cursor: hoverSide ? "pointer" : undefined }}
    >
      <h1 className="sr-only">{t.journey.srTitle}</h1>
      {/* arrival: continue the dive from the home intro, fading out of the same deep blue */}
      <div aria-hidden className={`pointer-events-none fixed inset-0 z-50 ${styles.arrive}`} />

      {/* ---- the sea & the world ---- */}
      <div className={`absolute inset-0 ${styles.worldIn}`}>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div ref={worldRef} className="absolute left-0 top-0 will-change-transform" style={{ opacity: ready ? 1 : 0 }}>
          <Islands route={route} />

          <svg
            className="pointer-events-none absolute overflow-visible"
            style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
            viewBox={`${b.x} ${b.y} ${b.w} ${b.h}`}
            aria-hidden="true"
          >
            <path d={route.d} fill="none" stroke="#08192a" strokeOpacity="0.35" strokeWidth="10" strokeLinecap="round" />
            <path
              d={route.d}
              fill="none"
              stroke="#b7d4e6"
              strokeOpacity="0.55"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray="0.1 12"
            />
            {donePath && (
              <path d={donePath} fill="none" stroke="#9fd3c9" strokeWidth="3.6" strokeLinecap="round" strokeDasharray="0.1 12" />
            )}
          </svg>

          {stops.map((stop, i) => {
            const p = route.stops[i];
            const selected = i === sel;
            const labelSide = narrow ? (p.x >= 0 ? "left" : "right") : "above";
            return (
              <div key={stop.key} className="absolute" style={{ left: p.x, top: p.y }}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  onPointerDown={(e) => e.stopPropagation()}
                  aria-label={t.journey.stopAria(stop.kind === "lesson" ? stop.label : stop.kicker, stop.title, stop.done)}
                  aria-current={selected ? "step" : undefined}
                  className="group absolute -left-7 -top-7 grid h-14 w-14 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  {selected && !reduced && (
                    <span className={`absolute inset-1 rounded-full border border-white/60 ${styles.halo}`} aria-hidden="true" />
                  )}
                  {stop.kind === "reward" ? (
                    <FlagMarker selected={selected} />
                  ) : (
                    <span
                      className={[
                        "relative grid h-10 w-10 place-items-center rounded-full text-[13px] font-extrabold shadow-[0_6px_18px_rgba(2,12,22,0.45)] transition-all duration-300",
                        stop.done
                          ? "bg-seafoam text-white"
                          : selected
                            ? "bg-white text-deep-ocean"
                            : "bg-deep-ocean/85 text-light-sky ring-[1.5px] ring-light-sky/60 group-hover:ring-white",
                        selected && stop.done ? "ring-2 ring-white" : "",
                        selected ? "scale-110" : "group-hover:scale-105",
                      ].join(" ")}
                    >
                      {stop.done ? <Check /> : stop.num}
                    </span>
                  )}
                </button>
                {stop.kind === "lesson" && stopBadge(stop.key) && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-2 left-2 grid size-7 place-items-center rounded-full bg-sea-night/85 text-[15px] shadow-[0_0_14px_-2px_rgba(126,224,240,0.6)] ring-1 ring-light-sky/50"
                  >
                    {stopBadge(stop.key)}
                  </span>
                )}
                <span
                  className={[
                    "pointer-events-none absolute whitespace-nowrap text-[13px] font-semibold transition-opacity duration-500",
                    selected ? "text-white" : "text-light-sky/80",
                    // phones: the bottom card already names the lesson; long labels would run off-screen
                    stop.kind === "lesson" ? "max-md:hidden" : "",
                    labelSide === "above" ? "bottom-9 left-0 -translate-x-1/2" : "",
                    labelSide === "left" ? "right-10 top-0 -translate-y-1/2 text-right" : "",
                    labelSide === "right" ? "left-10 top-0 -translate-y-1/2" : "",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {stop.kind === "reward" ? t.journey.reward.mapLabel : stop.title}
                </span>
              </div>
            );
          })}

          {/* the boat */}
          <div
            ref={boatRef}
            className="pointer-events-none absolute left-0 top-0"
            style={{
              width: narrow ? BOAT_NARROW : BOAT_WIDE,
              height: (narrow ? BOAT_NARROW : BOAT_WIDE) / 2,
              marginLeft: -(narrow ? BOAT_NARROW : BOAT_WIDE) / 2,
              marginTop: -(narrow ? BOAT_NARROW : BOAT_WIDE) / 4,
            }}
            aria-hidden="true"
          >
            <div className={`h-full w-full ${styles.bob}`}>
              <Boat className="h-full w-full drop-shadow-[0_0_14px_rgba(183,212,230,0.25)]" />
            </div>
          </div>
        </div>

        {/* soft vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 40% 45%, transparent 55%, rgba(5,16,28,0.55) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* scrim so the text block always reads well over the glints */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: narrow
            ? "linear-gradient(to bottom, transparent 42%, rgba(8,28,46,0.82) 60%, rgba(8,28,46,0.96) 70%, rgba(8,28,46,0.97) 100%)"
            : "radial-gradient(48% 58% at 84% 80%, rgba(8,28,46,0.88) 0%, rgba(8,28,46,0.6) 45%, rgba(8,28,46,0.18) 75%, transparent 92%)",
        }}
        aria-hidden="true"
      />

      {/* ---- back to the start page ---- */}
      <Link
        href="/"
        onPointerDown={(e) => e.stopPropagation()}
        className={`label-mono absolute left-4 top-[76px] z-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-sea-night/25 px-3.5 text-light-sky/90 backdrop-blur-sm transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white md:left-8 md:top-[84px] ${styles.fadeIn}`}
      >
        <span aria-hidden="true" className="text-base leading-none">
          ←
        </span>
        {t.journey.backToStart}
      </Link>
      {profile && (
        <p
          className={`absolute left-4 top-[128px] z-10 max-w-[70vw] truncate rounded-full px-3.5 text-[15px] font-extrabold text-white/90 md:left-8 md:top-[136px] ${styles.fadeIn}`}
        >
          {t.account.hello(profile.name)}
        </p>
      )}

      {/* ---- wide screens: counter, arrows, hint (bottom-left) ---- */}
      {!narrow && (
        <div
          data-no-sail
          className={`absolute bottom-10 left-8 z-10 flex items-center gap-5 short:bottom-5 ${styles.fadeIn}`}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <StepArrows sel={sel} count={stops.length} onStep={step} />
          <div className="flex flex-col gap-1">
            <span className="label-mono text-white/90">
              <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-px bg-sandy-beige align-middle" aria-hidden="true" />
              {t.journey.stopCounter(sel + 1, stops.length)}
            </span>
            <span className={`label-mono text-light-sky/60 transition-opacity duration-700 short:hidden ${touched ? "opacity-0" : "opacity-100"}`}>
              {t.journey.hint}
            </span>
          </div>
        </div>
      )}

      {/* ---- the text block ---- */}
      <section
        aria-live="polite"
        data-no-sail
        className="absolute inset-x-0 bottom-0 z-10 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:inset-x-auto md:bottom-[11vh] md:right-[6vw] md:w-[min(460px,40vw)] md:px-0 md:pb-0 short:md:bottom-5"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {showCard && active && (
          <div key={active.key} className={styles.cardIn}>
            <p className="label-mono flex items-center justify-between text-white/85">
              <span className="flex items-center">
                <span className="mr-2.5 inline-block h-1.5 w-1.5 bg-sandy-beige" aria-hidden="true" />
                {active.label}
              </span>
              {narrow && (
                <span className="text-light-sky/60">
                  {String(sel + 1).padStart(2, "0")} / {String(stops.length).padStart(2, "0")}
                </span>
              )}
            </p>
            <p className="mt-3 text-[15px] font-bold text-light-sky md:text-base">
              {active.kicker}
            </p>
            <h2 className="mt-2 text-balance text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[3.3rem] short:md:text-[2rem]">
              {active.title}
            </h2>
            <p className="mt-3 max-w-[38ch] text-[15px] font-light leading-relaxed text-white/80 md:mt-4 md:text-base short:hidden">
              {active.summary}
            </p>
            {active.kind === "lesson" && <StopTeaser lessonId={active.key} className="mt-3 short:hidden" />}
            <p className="label-mono mt-3 flex items-center gap-2 text-light-sky/80">
              {active.done && (
                <span className="inline-flex items-center gap-1 rounded-full bg-seafoam/25 px-2 py-0.5 text-[#bfe3dc]">
                  <Check small /> {t.journey.done}
                </span>
              )}
              {active.meta}
            </p>
            <div className="mt-5 flex items-center justify-between gap-3 md:mt-7 short:md:mt-4">
              <Link
                href={active.href}
                onClick={(e) => openLesson(e, active)}
                data-testid="open-stop"
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2.5 text-[15px] font-bold text-deep-ocean shadow-[0_10px_30px_rgba(2,12,22,0.35)] transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.98]"
              >
                {active.cta}
                <span className="grid h-8 w-8 place-items-center rounded-full bg-sandy-beige/35" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-sandy-beige transition-transform duration-300 group-hover:scale-150" />
                </span>
              </Link>
              {narrow && <StepArrows sel={sel} count={stops.length} onStep={step} />}
            </div>
          </div>
        )}
      </section>

      {/* ---- wide screens: the "click to sail" bubble that follows the mouse ---- */}
      {!narrow && (
        <div ref={cursorRef} className="pointer-events-none fixed left-0 top-0 z-30" aria-hidden="true">
          <div
            className={`flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/90 px-3.5 py-2 text-[13px] font-extrabold text-deep-ocean shadow-[0_10px_30px_rgba(2,12,22,0.4)] backdrop-blur-sm transition-[opacity,scale] duration-200 ${
              hoverSide ? "scale-100 opacity-100" : "scale-75 opacity-0"
            } ${hoverSide < 0 ? "-translate-x-[calc(100%+14px)]" : "translate-x-[14px]"}`}
          >
            {hoverSide < 0 && <Chevron dir={-1} />}
            {hoverSide !== 0 && stops[sel + hoverSide] && (stops[sel + hoverSide].kind === "lesson" ? stops[sel + hoverSide].label : stops[sel + hoverSide].kicker)}
            {hoverSide > 0 && <Chevron dir={1} />}
          </div>
        </div>
      )}

      {/* ---- arriving from the globe: the deep blue clears like surfacing ---- */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 ${styles.diveIn}`}
        style={{ background: "radial-gradient(circle at 50% 45%, #1e5a6e 0%, #0d2b45 45%, #081c2e 100%)" }}
        aria-hidden="true"
      />

      {/* ---- leaving for a lesson: the panel that becomes the lesson page ---- */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-50 bg-[#f6fafc] text-deep-ocean"
        style={{ visibility: "hidden", clipPath: "inset(0 0 0 100%)" }}
        aria-hidden="true"
      >
        {leaving && (
          <div className={`flex h-full flex-col items-center justify-center px-8 text-center ${styles.cardIn}`}>
            <p className="label-mono text-ocean-teal">{leaving.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{leaving.title}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StepArrows({ sel, count, onStep }: { sel: number; count: number; onStep: (d: number) => void }) {
  const t = useT();
  const btn =
    "grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10 disabled:opacity-30 disabled:hover:border-white/25 focus-visible:outline-2 focus-visible:outline-white";
  return (
    <div className="flex gap-2">
      <button type="button" className={btn} onClick={() => onStep(-1)} disabled={sel <= 0} aria-label={t.journey.prevAria}>
        <Chevron dir={-1} />
      </button>
      <button type="button" className={btn} onClick={() => onStep(1)} disabled={sel >= count - 1} aria-label={t.journey.nextAria}>
        <Chevron dir={1} />
      </button>
    </div>
  );
}

function Chevron({ dir }: { dir: 1 | -1 }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={dir > 0 ? "M6 3.5 L10.5 8 L6 12.5" : "M10 3.5 L5.5 8 L10 12.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check({ small = false }: { small?: boolean }) {
  const s = small ? 11 : 16;
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.5 L6.8 11.5 L12.5 4.8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlagMarker({ selected }: { selected: boolean }) {
  return (
    <span
      className={`relative grid h-11 w-11 place-items-center rounded-full shadow-[0_6px_18px_rgba(2,12,22,0.45)] transition-transform duration-300 ${
        selected ? "scale-110 bg-white" : "bg-deep-ocean/85 ring-[1.5px] ring-sandy-beige/80 group-hover:scale-105"
      }`}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <path d="M6 3 V19" stroke={selected ? "#0d2b45" : "#dcc8aa"} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6.6 3.6 C10 2.2 12 5.4 16.8 4 V11 C12 12.4 10 9.2 6.6 10.6 Z" fill="#dcc8aa" />
      </svg>
    </span>
  );
}
