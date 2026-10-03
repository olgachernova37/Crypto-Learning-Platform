// Soft, rounded little islands that drift by along the route. Purely decorative.
// Top-down: turquoise shallows, a foam line, a sandy beach and round tree canopies.

import type { Route } from "./route";

type IslandSpec = { at: number; side: 1 | -1; dist: number; size: number; shape: 0 | 1 | 2; rot: number };

// Placed along the main axis (in "stops"), pushed sideways off the route.
const SPECS_WIDE: IslandSpec[] = [
  // Wide screens: the text block lives bottom-right of the boat, so islands sit above
  // the route (plus one bottom-left at the very start).
  { at: -0.7, side: 1, dist: 240, size: 1.1, shape: 0, rot: -10 },
  { at: 0.5, side: -1, dist: 250, size: 0.85, shape: 1, rot: 24 },
  { at: 1.55, side: -1, dist: 230, size: 1.0, shape: 2, rot: 5 },
  { at: 2.5, side: -1, dist: 270, size: 0.8, shape: 0, rot: 160 },
  { at: 3.45, side: -1, dist: 240, size: 1.2, shape: 1, rot: -30 },
  { at: 4.5, side: -1, dist: 250, size: 0.9, shape: 2, rot: 200 },
  { at: 5.5, side: -1, dist: 230, size: 1.0, shape: 0, rot: 12 },
];

const SPECS_NARROW: IslandSpec[] = [
  { at: -0.55, side: 1, dist: 220, size: 1.1, shape: 0, rot: -10 },
  { at: 0.5, side: -1, dist: 240, size: 0.8, shape: 1, rot: 24 },
  { at: 1.5, side: 1, dist: 250, size: 1.05, shape: 2, rot: 5 },
  { at: 2.55, side: -1, dist: 230, size: 0.75, shape: 0, rot: 160 },
  { at: 3.45, side: 1, dist: 250, size: 1.2, shape: 1, rot: -30 },
  { at: 4.5, side: -1, dist: 250, size: 0.9, shape: 2, rot: 200 },
  { at: 5.55, side: 1, dist: 230, size: 1.0, shape: 0, rot: 12 },
];

type Shape = { sand: string; trees: [number, number, number][] };

const SHAPES: Shape[] = [
  {
    // long, bean-shaped island
    sand: "M22,52 C14,34 34,18 62,20 C84,21 96,10 116,16 C138,23 144,46 128,60 C114,72 92,66 74,76 C54,87 30,74 22,52 Z",
    trees: [
      [44, 46, 13], [60, 40, 11], [58, 56, 12], [78, 50, 10], [96, 34, 10], [112, 30, 8], [118, 46, 9], [36, 58, 8],
    ],
  },
  {
    // round island with a little bay
    sand: "M30,40 C30,20 52,8 76,12 C102,16 118,34 114,56 C110,78 88,92 64,88 C50,86 52,72 40,70 C28,68 30,54 30,40 Z",
    trees: [
      [60, 34, 13], [78, 30, 10], [86, 50, 13], [68, 54, 11], [96, 66, 9], [74, 72, 9], [48, 46, 9],
    ],
  },
  {
    // two small islets
    sand: "M18,46 C16,30 34,22 50,26 C64,30 66,48 56,58 C44,70 20,64 18,46 Z M78,34 C80,20 100,14 116,22 C132,30 130,52 114,60 C98,68 76,52 78,34 Z",
    trees: [
      [36, 42, 10], [48, 48, 8], [30, 52, 7], [100, 34, 11], [112, 44, 9], [94, 48, 8],
    ],
  },
];

export function Islands({ route }: { route: Route }) {
  const n = route.stops.length;
  const spacing =
    n > 1
      ? route.vertical
        ? route.stops[0].y - route.stops[1].y
        : route.stops[1].x - route.stops[0].x
      : 400;

  return (
    <>
      {(route.vertical ? SPECS_NARROW : SPECS_WIDE).filter((s) => s.at < n - 0.2).map((spec, i) => {
        const main = spec.at * spacing;
        const cross = routeCrossAt(route, main) + spec.side * spec.dist * (route.vertical ? 0.62 : 1);
        const x = route.vertical ? cross : main;
        const y = route.vertical ? -main : cross;
        const s = spec.size * (route.vertical ? 0.8 : 1.15);
        const shape = SHAPES[spec.shape];
        const W = 160;
        const H = 100;
        return (
          <svg
            key={i}
            viewBox={`-10 -10 ${W} ${H}`}
            className="pointer-events-none absolute"
            style={{
              left: x - (W / 2) * s,
              top: y - (H / 2) * s,
              width: W * s,
              height: H * s,
              transform: `rotate(${spec.rot}deg)`,
              overflow: "visible",
            }}
            aria-hidden="true"
          >
            <defs>
              <filter id={`isl-soft-${i}`} x="-40%" y="-60%" width="180%" height="220%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
              <filter id={`isl-foam-${i}`} x="-20%" y="-30%" width="140%" height="160%">
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
              <filter id={`isl-shade-${i}`} x="-20%" y="-30%" width="140%" height="160%">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>
            {/* turquoise shallows */}
            <path
              d={shape.sand}
              fill="#6ba7a0"
              opacity="0.5"
              stroke="#6ba7a0"
              strokeWidth="22"
              strokeLinejoin="round"
              filter={`url(#isl-soft-${i})`}
            />
            {/* foam line */}
            <path
              d={shape.sand}
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.7"
              strokeWidth="4"
              strokeLinejoin="round"
              filter={`url(#isl-foam-${i})`}
            />
            {/* beach */}
            <path d={shape.sand} fill="#dcc8aa" />
            {/* tree shadows, then canopies */}
            <g filter={`url(#isl-shade-${i})`} opacity="0.35">
              {shape.trees.map(([tx, ty, tr], k) => (
                <circle key={k} cx={tx + 2.5} cy={ty + 3} r={tr} fill="#0d2b45" />
              ))}
            </g>
            {shape.trees.map(([tx, ty, tr], k) => (
              <g key={k}>
                <circle cx={tx} cy={ty} r={tr} fill={k % 3 === 0 ? "#4f8a80" : k % 3 === 1 ? "#5d9a8e" : "#548f84"} />
                <circle cx={tx - tr * 0.28} cy={ty - tr * 0.3} r={tr * 0.5} fill="#7fb6aa" opacity="0.75" />
              </g>
            ))}
          </svg>
        );
      })}
    </>
  );
}

/** Sideways offset of the route at a given position along its main axis. */
function routeCrossAt(route: Route, main: number) {
  let best = route.samples[0];
  let bestD = Infinity;
  for (const p of route.samples) {
    const m = route.vertical ? -p.y : p.x;
    const d = Math.abs(m - main);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return route.vertical ? best.x : best.y;
}
