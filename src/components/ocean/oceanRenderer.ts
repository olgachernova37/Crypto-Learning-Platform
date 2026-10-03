// Top-down animated sea on a 2D canvas. Cheap enough for phones:
// a few pre-rendered, tiling glint textures drawn as patterns (each fading in and out
// on its own rhythm so the water twinkles), slow soft swells, a handful of bright
// sparkles, and foam particles for the boat's wake.
//
// Everything is anchored to WORLD coordinates, so when the camera follows the boat
// the water scrolls underneath it, like the OceanX ship.

export type OceanFrame = {
  t: number; // seconds
  dt: number; // seconds since the last frame
  viewX: number; // world coordinate at the canvas' left edge
  viewY: number; // world coordinate at the canvas' top edge
  boat?: { x: number; y: number; angle: number; speed: number; length: number };
  still?: boolean; // reduced motion: no twinkle, no particles
};

type Particle = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number };

const TILE = 512;
const SWELL_TILE = 1024;

export function createOcean(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;
  const c = ctx;

  const glintTiles = [11, 29, 47].map((seed) => makeGlintTile(seed));
  const swellTile = makeSwellTile(5);
  const glintPatterns = glintTiles.map((tile) => c.createPattern(tile, "repeat"));
  const swellPattern = c.createPattern(swellTile, "repeat");

  let w = 0;
  let h = 0;
  let dpr = 1;
  let foam: Particle[] = [];
  let sparkles: Particle[] = [];
  let foamDebt = 0;
  let prevBoat: { x: number; y: number } | null = null;
  let trail: { x: number; y: number; age: number }[] = [];
  const TRAIL_LIFE = 2.4;
  let bg: CanvasGradient | null = null;

  function resize(width: number, height: number, ratio: number) {
    w = width;
    h = height;
    dpr = ratio;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    bg = c.createRadialGradient(width * 0.42, height * 0.38, 0, width * 0.5, height * 0.5, Math.hypot(width, height) * 0.62);
    bg.addColorStop(0, "#164466");
    bg.addColorStop(0.55, "#0f3352");
    bg.addColorStop(1, "#0a223a");
  }

  function drawPattern(p: CanvasPattern | null, ox: number, oy: number, scale = 1) {
    if (!p) return;
    p.setTransform(new DOMMatrix().translate(ox, oy).scale(scale));
    c.fillStyle = p;
    c.fillRect(0, 0, w, h);
  }

  function draw(f: OceanFrame) {
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.globalAlpha = 1;
    c.fillStyle = bg ?? "#0d2b45";
    c.fillRect(0, 0, w, h);

    const t = f.still ? 2.2 : f.t;

    // Slow, large swells: lighter patches of teal drifting with the current.
    c.globalAlpha = 0.55;
    drawPattern(swellPattern, -f.viewX * 0.92 + t * 4, -f.viewY * 0.92 + t * 2.5, 1);

    // Wave glints: three tiles, each breathing in and out on its own phase.
    for (let i = 0; i < glintPatterns.length; i++) {
      const phase = (i * Math.PI * 2) / 3;
      const breathe = 0.5 + 0.5 * Math.sin(t * 0.85 + phase);
      c.globalAlpha = 0.15 + 0.6 * breathe * breathe;
      const drift = (i - 1) * 3;
      drawPattern(glintPatterns[i], -f.viewX + t * (5 + drift), -f.viewY + t * (2 - drift * 0.5), 1);
    }
    c.globalAlpha = 1;

    if (!f.still) {
      stepFoam(f);
      stepSparkles(f);
    } else {
      foam = [];
      sparkles = [];
    }

    // Wake trail: a soft white ribbon widening behind the boat.
    if (trail.length > 1) {
      c.lineCap = "round";
      c.strokeStyle = "#ffffff";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const p = trail[i];
        const k = p.age / TRAIL_LIFE;
        c.globalAlpha = 0.3 * (1 - k) * (1 - k);
        c.lineWidth = 5 + k * 26;
        c.beginPath();
        c.moveTo(a.x - f.viewX, a.y - f.viewY);
        c.lineTo(p.x - f.viewX, p.y - f.viewY);
        c.stroke();
      }
    }

    // Foam (wake)
    c.fillStyle = "#ffffff";
    for (const p of foam) {
      const k = p.age / p.life;
      c.globalAlpha = 0.62 * (1 - k) * (1 - k) * Math.min(1, p.age * 8);
      c.beginPath();
      c.arc(p.x - f.viewX, p.y - f.viewY, p.size * (0.7 + k * 1.8), 0, Math.PI * 2);
      c.fill();
    }

    // Sparkles: tiny four-point stars catching the sun.
    for (const s of sparkles) {
      const k = s.age / s.life;
      const a = Math.sin(k * Math.PI);
      const x = s.x - f.viewX;
      const y = s.y - f.viewY;
      const len = s.size * (0.6 + a * 0.8);
      c.globalAlpha = 0.7 * a;
      c.strokeStyle = "#ffffff";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(x - len, y);
      c.lineTo(x + len, y);
      c.moveTo(x, y - len * 0.7);
      c.lineTo(x, y + len * 0.7);
      c.stroke();
      c.globalAlpha = 0.35 * a;
      c.beginPath();
      c.arc(x, y, 2.2, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
  }

  function stepFoam(f: OceanFrame) {
    const dt = Math.min(f.dt, 0.05);
    for (const p of foam) {
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 1 - dt * 1.2;
      p.vy *= 1 - dt * 1.2;
    }
    foam = foam.filter((p) => p.age < p.life);

    for (const p of trail) p.age += dt;
    trail = trail.filter((p) => p.age < TRAIL_LIFE);

    const b = f.boat;
    if (!b) return;
    {
      const sx = b.x - Math.cos(b.angle) * b.length * 0.4;
      const sy = b.y - Math.sin(b.angle) * b.length * 0.4;
      const head = trail[trail.length - 1];
      if (b.speed > 20 && (!head || Math.hypot(head.x - sx, head.y - sy) > 6)) trail.push({ x: sx, y: sy, age: 0 });
    }
    const moving = Math.min(1, b.speed / 160);
    foamDebt += dt * (14 + moving * 150);
    const ax = Math.cos(b.angle);
    const ay = Math.sin(b.angle);
    const from = prevBoat && Math.hypot(prevBoat.x - b.x, prevBoat.y - b.y) < 160 ? prevBoat : b;
    prevBoat = { x: b.x, y: b.y };
    const total = Math.max(1, Math.floor(foamDebt));
    let k = 0;
    while (foamDebt >= 1 && foam.length < 700) {
      foamDebt -= 1;
      // spread spawns along the path travelled since the last frame
      const u = (k++ + Math.random()) / total;
      const bx = from.x + (b.x - from.x) * u;
      const by = from.y + (b.y - from.y) * u;
      const side = Math.random() < 0.5 ? -1 : 1;
      const back = b.length * (0.36 + Math.random() * 0.08);
      const lateral = (Math.random() - 0.5) * b.length * 0.22;
      // stern spray
      const spread = (10 + moving * 34) * side * (0.3 + Math.random());
      foam.push({
        x: bx - ax * back - ay * lateral,
        y: by - ay * back + ax * lateral,
        vx: -ax * (10 + moving * 40) - ay * spread,
        vy: -ay * (10 + moving * 40) + ax * spread,
        age: 0,
        life: 1.0 + Math.random() * (0.8 + moving * 1.8),
        size: 1.5 + Math.random() * (2 + moving * 2.5),
      });
      // a little bow wave while sailing
      if (moving > 0.2 && Math.random() < 0.35) {
        const fwd = b.length * 0.42;
        foam.push({
          x: bx + ax * fwd + -ay * side * b.length * 0.08,
          y: by + ay * fwd + ax * side * b.length * 0.08,
          vx: -ay * side * 34 - ax * 20,
          vy: ax * side * 34 - ay * 20,
          age: 0,
          life: 0.7 + Math.random() * 0.5,
          size: 1.4 + Math.random() * 1.6,
        });
      }
    }
  }

  function stepSparkles(f: OceanFrame) {
    const dt = Math.min(f.dt, 0.05);
    for (const s of sparkles) s.age += dt;
    sparkles = sparkles.filter((s) => s.age < s.life);
    const target = Math.round((w * h) / 34000);
    if (sparkles.length < target && Math.random() < dt * 14) {
      sparkles.push({
        x: f.viewX + Math.random() * w,
        y: f.viewY + Math.random() * h,
        vx: 0,
        vy: 0,
        age: 0,
        life: 0.9 + Math.random() * 1.2,
        size: 2 + Math.random() * 2.6,
      });
    }
  }

  return { resize, draw };
}

export type Ocean = NonNullable<ReturnType<typeof createOcean>>;

/* ---------- pre-rendered textures ---------- */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Small crescent-shaped glints, the way sunlight catches wave crests from above.
 * They come in loose clusters (wind lanes) with sparse ones in between, so the sea
 * reads as water, not as rain.
 */
function makeGlintTile(seed: number) {
  const cv = document.createElement("canvas");
  cv.width = TILE;
  cv.height = TILE;
  const g = cv.getContext("2d")!;
  const rand = rng(seed);
  g.lineCap = "round";
  const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;

  const glint = (x: number, y: number, len: number, alpha: number, width: number) => {
    const angle = -0.32 + (rand() - 0.5) * 0.45; // waves share a direction
    const bend = 0.5 + rand() * 0.9;
    for (const dx of [-TILE, 0, TILE]) {
      for (const dy of [-TILE, 0, TILE]) {
        const cx = x + dx;
        const cy = y + dy;
        if (cx < -30 || cx > TILE + 30 || cy < -30 || cy > TILE + 30) continue;
        g.save();
        g.translate(cx, cy);
        g.rotate(angle);
        g.strokeStyle = `rgba(226, 240, 249, ${alpha})`;
        g.lineWidth = width;
        g.beginPath();
        g.moveTo(-len / 2, 0);
        g.quadraticCurveTo(0, -len * 0.2 * bend, len / 2, 0);
        g.stroke();
        g.restore();
      }
    }
  };

  // clusters
  for (let c = 0; c < 7; c++) {
    const cx = rand() * TILE;
    const cy = rand() * TILE;
    const rx = 70 + rand() * 90;
    const ry = rx * (0.3 + rand() * 0.25);
    const n = 5 + Math.floor(rand() * 9);
    for (let i = 0; i < n; i++) {
      const u = gauss();
      const v = gauss();
      const near = 1 - Math.min(1, Math.hypot(u, v));
      // rotate the cluster along the wave direction
      const x = cx + u * rx * 0.95 - v * ry * 0.3;
      const y = cy + u * rx * -0.3 + v * ry;
      glint(x, y, 4 + near * 10 + rand() * 5, 0.2 + near * 0.55, 0.9 + near * 1.1);
    }
  }
  // sparse
  for (let i = 0; i < 38; i++) {
    glint(rand() * TILE, rand() * TILE, 3 + rand() * 6, 0.1 + rand() * 0.28, 0.9);
  }
  return cv;
}

/** Big blurred patches of lighter water. */
function makeSwellTile(seed: number) {
  const cv = document.createElement("canvas");
  cv.width = SWELL_TILE;
  cv.height = SWELL_TILE;
  const g = cv.getContext("2d")!;
  const rand = rng(seed);
  for (let i = 0; i < 14; i++) {
    const x = rand() * SWELL_TILE;
    const y = rand() * SWELL_TILE;
    const rad = 120 + rand() * 260;
    const light = rand() < 0.6;
    for (const dx of [-SWELL_TILE, 0, SWELL_TILE]) {
      for (const dy of [-SWELL_TILE, 0, SWELL_TILE]) {
        const grad = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, rad);
        const col = light ? "40, 104, 128" : "6, 22, 38";
        grad.addColorStop(0, `rgba(${col}, ${light ? 0.38 : 0.45})`);
        grad.addColorStop(1, `rgba(${col}, 0)`);
        g.fillStyle = grad;
        g.fillRect(x + dx - rad, y + dy - rad, rad * 2, rad * 2);
      }
    }
  }
  return cv;
}
