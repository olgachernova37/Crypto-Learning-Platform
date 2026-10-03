import type { CSSProperties } from "react";
import m from "./motion.module.css";

const COLORS = ["#6ba7a0", "#dcc8aa", "#b7d4e6", "#1e5a6e", "#0d2b45"];

// deterministic layout: same on server and client
const PIECES = Array.from({ length: 34 }, (_, i) => {
  const a = (i * 37) % 100;
  return {
    x: `${(a + (i % 3) * 3) % 100}%`,
    y: `${8 + ((i * 53) % 60)}%`,
    d: `${((i * 0.37) % 4).toFixed(2)}s`,
    t: `${4.5 + ((i * 7) % 30) / 10}s`,
    r: `${(i % 2 ? 1 : -1) * (240 + ((i * 41) % 360))}deg`,
    sway: `${((i * 29) % 80) - 40}px`,
    color: COLORS[i % COLORS.length],
    shape: i % 3,
    size: 7 + (i % 4) * 2,
  };
});

/** Soft falling confetti in palette colours (static scattered sparkles with reduced motion). */
export function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={m.confetti}
          style={
            {
              "--x": p.x,
              "--y": p.y,
              "--d": p.d,
              "--t": p.t,
              "--r": p.r,
              "--sway": p.sway,
              width: p.shape === 2 ? p.size * 0.6 : p.size,
              height: p.shape === 2 ? p.size * 1.8 : p.size,
              background: p.color,
              borderRadius: p.shape === 0 ? "999px" : p.shape === 1 ? "3px" : "999px",
              opacity: 0.85,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
