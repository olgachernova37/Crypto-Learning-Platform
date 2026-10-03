// Geometry of the boat route: a soft Catmull-Rom curve through the lesson stops,
// sampled densely so the boat can sail along it by distance.
//
// World units are CSS pixels. Wide screens: the route runs left → right.
// Narrow screens: it runs bottom → top (upcoming stops stay above the bottom card).

export type Pt = { x: number; y: number };

export type Route = {
  vertical: boolean;
  stops: Pt[]; // marker positions (lessons + reward flag)
  samples: Pt[];
  cum: number[]; // cumulative length at each sample
  total: number;
  stopS: number[]; // distance along the route of each marker
  boatS: number[]; // where the boat moors for each stop (just before the marker)
  d: string; // SVG path of the whole route
  bounds: { x: number; y: number; w: number; h: number };
};

// Gentle side-to-side sway of the route, per stop (−1 … 1).
const SWAY = [0.15, -0.85, 0.55, -0.45, 0.95, -0.3, 0.6, -0.7];
const SEG_SAMPLES = 48;
export const MOOR_GAP = 78; // boat stops this far before the buoy

export function buildRoute(count: number, vertical: boolean): Route {
  const spacing = vertical ? 330 : 560;
  const amp = vertical ? 78 : 100;

  const place = (main: number, cross: number): Pt =>
    vertical ? { x: cross, y: -main } : { x: main, y: cross };

  const stops: Pt[] = [];
  for (let i = 0; i < count; i++) stops.push(place(i * spacing, SWAY[i % SWAY.length] * amp));

  // A lead-in from off-screen so the boat has water (and a route) behind it at stop 1.
  const lead = place(-spacing * 1.1, -amp * 0.6);
  const pts = [lead, ...stops];

  const samples: Pt[] = [];
  let d = `M${r(pts[0].x)},${r(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${r(c1.x)},${r(c1.y)} ${r(c2.x)},${r(c2.y)} ${r(p2.x)},${r(p2.y)}`;
    for (let k = i === 0 ? 0 : 1; k <= SEG_SAMPLES; k++) {
      samples.push(bezier(p1, c1, c2, p2, k / SEG_SAMPLES));
    }
  }

  const cum = [0];
  for (let i = 1; i < samples.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y));
  }
  const total = cum[cum.length - 1];
  // Stop i is the end of segment i (segment 0 is the lead-in).
  const stopS = stops.map((_, i) => cum[(i + 1) * SEG_SAMPLES]);
  const boatS = stopS.map((s) => Math.max(0, s - MOOR_GAP));

  const xs = samples.map((p) => p.x);
  const ys = samples.map((p) => p.y);
  const pad = 40;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const bounds = {
    x: minX,
    y: minY,
    w: Math.max(...xs) + pad - minX,
    h: Math.max(...ys) + pad - minY,
  };

  return { vertical, stops, samples, cum, total, stopS, boatS, d, bounds };
}

/** Position and heading (radians) at distance s along the route. */
export function pointAt(route: Route, s: number): { x: number; y: number; angle: number } {
  const { cum, samples } = route;
  const t = Math.max(0, Math.min(route.total, s));
  let lo = 0;
  let hi = cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= t) lo = mid;
    else hi = mid;
  }
  const a = samples[lo];
  const b = samples[hi];
  const f = cum[hi] === cum[lo] ? 0 : (t - cum[lo]) / (cum[hi] - cum[lo]);
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, angle: Math.atan2(b.y - a.y, b.x - a.x) };
}

/** SVG polyline path of the route between two distances. */
export function subPath(route: Route, from: number, to: number): string {
  const pts: Pt[] = [];
  const { cum, samples } = route;
  pts.push(pointAt(route, from));
  for (let i = 0; i < samples.length; i++) if (cum[i] > from && cum[i] < to) pts.push(samples[i]);
  pts.push(pointAt(route, to));
  return pts.map((p, i) => `${i ? "L" : "M"}${r(p.x)},${r(p.y)}`).join(" ");
}

function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const e = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + e * p3.x, y: a * p0.y + b * p1.y + c * p2.y + e * p3.y };
}

const r = (n: number) => Math.round(n * 10) / 10;
