"use client";

// A slowly turning WebGL Earth (cobe) in our palette. Drag to spin it.

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** Multiplies the rotation speed (the zoom transition spins it up a little). */
  speedRef?: React.RefObject<number>;
  reduced?: boolean;
};

export function Globe({ className = "", speedRef, reduced = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let size = canvas.offsetWidth || 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let phi = 0.4; // start with Europe / Africa in view
    let dragX: number | null = null;
    let dragPhi = 0;
    let velocity = 0;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size,
      height: size,
      phi,
      theta: 0.28,
      dark: 1,
      diffuse: 2.2,
      mapSamples: size < 500 ? 14000 : 20000,
      mapBrightness: 8,
      mapBaseBrightness: 0.12,
      baseColor: [0.3, 0.55, 0.7],
      markerColor: [0.86, 0.78, 0.67],
      glowColor: [0.3, 0.55, 0.7],
      markerElevation: 0.01,
      markers: [],
      opacity: 0.92,
    });

    const ro = new ResizeObserver(() => {
      size = canvas.offsetWidth || size;
      globe.update({ width: size, height: size });
    });
    ro.observe(canvas);

    const down = (e: PointerEvent) => {
      dragX = e.clientX;
      dragPhi = phi;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (dragX === null) return;
      const next = dragPhi + (e.clientX - dragX) / 220;
      velocity = next - phi;
      phi = next;
    };
    const up = () => {
      dragX = null;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (dragX === null) {
        const boost = speedRef?.current ?? 1;
        phi += (reduced ? 0 : 0.09 * boost) * dt + velocity;
        velocity *= 0.92;
      }
      globe.update({ phi });
      canvas.style.opacity = "1";
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      globe.destroy();
    };
  }, [speedRef, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={`aspect-square h-auto w-full cursor-grab opacity-0 transition-opacity duration-[1600ms] active:cursor-grabbing ${className}`}
      style={{ contain: "layout paint size" }}
      aria-hidden="true"
    />
  );
}
