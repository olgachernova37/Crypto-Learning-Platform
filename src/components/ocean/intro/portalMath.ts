// Geometry for the portal window: a rounded rectangle sampled as points, tilted with a
// fake perspective (focal 850) and projected back to the screen.

export type P2 = [number, number];

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** ~44 points around a w×h rounded rect centred on the origin (10 steps per corner arc). */
export function roundedRectPoints(w: number, h: number, radius: number): P2[] {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  const corners: [number, number, number, number][] = [
    [w / 2 - r, -h / 2 + r, -Math.PI / 2, 0],
    [w / 2 - r, h / 2 - r, 0, Math.PI / 2],
    [-w / 2 + r, h / 2 - r, Math.PI / 2, Math.PI],
    [-w / 2 + r, -h / 2 + r, Math.PI, Math.PI * 1.5],
  ];
  const pts: P2[] = [];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= 10; i++) {
      const a = a0 + ((a1 - a0) * i) / 10;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  }
  return pts;
}

/** Tilt a local point by rx/ry degrees and project it with focal length 850. */
export function project(x: number, y: number, rxDeg: number, ryDeg: number, cx: number, cy: number): P2 {
  const ax = (rxDeg * Math.PI) / 180;
  const ay = (ryDeg * Math.PI) / 180;
  const xx = x * Math.cos(ay);
  const yy = y * Math.cos(ax);
  const z = x * Math.sin(ay) - y * Math.sin(ax);
  const p = 850 / (850 + z);
  return [cx + xx * p, cy + yy * p];
}

/** Animate a 0→1 value with easeInOutCubic. Resolves when done (or immediately if duration ≤ 0). */
export function animateValue(set: (v: number) => void, duration: number): Promise<void> {
  return new Promise((resolve) => {
    if (duration <= 0) {
      set(1);
      resolve();
      return;
    }
    const start = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - start) / duration);
      set(easeInOutCubic(k));
      if (k < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}
