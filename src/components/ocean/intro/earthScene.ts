// The scene seen through the portal: our own rendered "approach to Earth".
// A cobe WebGL globe (on a detached canvas) is composited into an offscreen 2D canvas with
// a night-sky gradient, stars, an atmosphere halo, a slow cloud layer and sunlit shading.
// The portal samples this canvas full-screen (screen-locked), so the window shape moves
// while the Earth stays put.
//
// `zoom` (0..1) dives into the ocean: the globe swells past the screen and everything
// fades into the same deep-blue gradient that /journey opens with.

import createGlobe from "cobe";

type Star = { x: number; y: number; r: number; a: number; tw: number };

export type SceneFrame = {
  t: number; // seconds
  cx: number; // globe centre, CSS px
  cy: number;
  diameter: number; // CSS px
  zoom: number; // 0..1
};

// cobe draws its sphere with a diameter of ~0.8 × canvas height × scale.
const COBE_DIAMETER = 0.8;

export function createEarthScene() {
  const out = document.createElement("canvas");
  const ctx = out.getContext("2d");
  const gc = document.createElement("canvas");
  if (!ctx) return null;
  const c = ctx;

  let webgl = false;
  try {
    const probe = document.createElement("canvas");
    webgl = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    webgl = false;
  }

  let vw = 1;
  let vh = 1;
  let dpr = 1;
  let phi = 2.6; // start over the Atlantic
  let lastT = 0;
  let rendered = false;
  let gw = 0; // current cobe canvas size (device px)
  let gh = 0;

  const globe = webgl
    ? createGlobe(gc, {
        devicePixelRatio: 1, // we size the canvas in device pixels ourselves
        width: 2,
        height: 2,
        phi,
        theta: 0.22,
        dark: 1,
        diffuse: 2.2,
        mapSamples: 20000,
        mapBrightness: 8,
        mapBaseBrightness: 0.12,
        baseColor: [0.3, 0.55, 0.7],
        markerColor: [0.86, 0.78, 0.67],
        glowColor: [0.32, 0.56, 0.72],
        markers: [],
        scale: 1,
        offset: [0, 0],
      })
    : null;

  const stars: Star[] = [];
  {
    let s = 7;
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    for (let i = 0; i < 240; i++) {
      stars.push({ x: rand(), y: rand(), r: 0.35 + rand() * rand() * 1.4, a: 0.2 + rand() * 0.6, tw: rand() * 6.28 });
    }
  }
  const clouds = makeCloudSprite();

  function resize(width: number, height: number) {
    vw = Math.max(1, width);
    vh = Math.max(1, height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    out.width = Math.round(vw * dpr);
    out.height = Math.round(vh * dpr);
    gw = gh = 0; // re-size the globe canvas on the next frame
  }

  function render(f: SceneFrame) {
    const dt = Math.min(0.05, Math.max(0, f.t - lastT));
    lastT = f.t;
    phi += dt * (0.08 + f.zoom * 0.25);
    const z = f.zoom;
    const grow = 1 + 22 * Math.pow(z, 2.4);
    const D = f.diameter * grow;
    // during the dive the globe drifts to the middle of the screen
    const cx = f.cx + (vw / 2 - f.cx) * z;
    const cy = f.cy + (vh * 0.45 - f.cy) * z;
    const R = D / 2;

    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.globalAlpha = 1;
    c.globalCompositeOperation = "source-over";

    // night sky
    const sky = c.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(vw, vh) * 0.75);
    sky.addColorStop(0, "#15406a");
    sky.addColorStop(0.3, "#0d2b45");
    sky.addColorStop(1, "#040c17");
    c.fillStyle = sky;
    c.fillRect(0, 0, vw, vh);

    // stars rush outward as we dive
    const spread = 1 + z * 2.5;
    c.fillStyle = "#dbeaf3";
    for (const s of stars) {
      const sx = cx + (s.x * vw - cx) * spread;
      const sy = cy + (s.y * vh - cy) * spread;
      const a = s.a * (0.75 + 0.25 * Math.sin(f.t * 1.3 + s.tw)) * (1 - z);
      if (a <= 0.01) continue;
      c.globalAlpha = a;
      c.beginPath();
      c.arc(sx, sy, s.r * (1 + z * 2), 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;

    // atmosphere halo
    const halo = c.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.55);
    halo.addColorStop(0, "rgba(183, 212, 230, 0.32)");
    halo.addColorStop(0.35, "rgba(107, 167, 160, 0.12)");
    halo.addColorStop(1, "rgba(107, 167, 160, 0)");
    c.fillStyle = halo;
    c.fillRect(cx - R * 1.6, cy - R * 1.6, R * 3.2, R * 3.2);

    if (globe) {
      // While the Earth sits in the window, cobe only renders a square around the sphere
      // (cheap on phones). For the dive it renders the whole viewport.
      const big = z > 0 || D * 1.2 > Math.min(vw, vh);
      if (big) {
        if (gw !== out.width || gh !== out.height) {
          gw = out.width;
          gh = out.height;
          globe.update({ width: gw, height: gh });
        }
        const scale = (D * dpr) / (COBE_DIAMETER * gh);
        const dx = (cx - vw / 2) * dpr;
        const dy = (cy - vh / 2) * dpr;
        globe.update({ phi, scale, offset: [(2 * dx) / scale, (2 * dy) / scale] });
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.drawImage(gc, 0, 0, gw, gh);
      } else {
        const side = Math.ceil((D * 1.2 * dpr) / 8) * 8;
        if (gw !== side || gh !== side) {
          gw = gh = side;
          globe.update({ width: side, height: side });
        }
        globe.update({ phi, scale: (D * dpr) / (COBE_DIAMETER * side), offset: [0, 0] });
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.drawImage(gc, Math.round(cx * dpr - side / 2), Math.round(cy * dpr - side / 2), side, side);
      }
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    } else {
      // no WebGL: a soft painted sphere
      const g = c.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      g.addColorStop(0, "#3c7f97");
      g.addColorStop(0.6, "#1e5a6e");
      g.addColorStop(1, "#0d2b45");
      c.fillStyle = g;
      c.beginPath();
      c.arc(cx, cy, R, 0, Math.PI * 2);
      c.fill();
    }

    // inside the sphere: drifting clouds, sunlight and a soft night side
    c.save();
    c.beginPath();
    c.arc(cx, cy, R * 0.995, 0, Math.PI * 2);
    c.clip();
    const cw = D * 1.6;
    const ch = D * 0.8;
    const drift = ((f.t * 0.018) % 1) * cw;
    c.globalAlpha = 0.09 * (1 - z);
    for (let k = -1; k <= 1; k++) {
      c.drawImage(clouds, cx - R + drift + k * cw - cw / 2, cy - ch / 2 - R * 0.15, cw, ch);
      c.drawImage(clouds, cx - R - drift * 0.7 + k * cw, cy - ch / 2 + R * 0.35, cw, ch * 0.8);
    }
    c.globalAlpha = 1;
    c.globalCompositeOperation = "screen";
    const sun = c.createRadialGradient(cx - R * 0.32, cy - R * 0.44, 0, cx - R * 0.32, cy - R * 0.44, R * 1.25);
    sun.addColorStop(0, "rgba(70, 150, 180, 0.75)");
    sun.addColorStop(0.45, "rgba(36, 104, 128, 0.42)");
    sun.addColorStop(1, "rgba(13, 43, 69, 0.12)");
    c.fillStyle = sun;
    c.fillRect(cx - R, cy - R, D, D);
    c.globalCompositeOperation = "source-over";
    const night = c.createRadialGradient(cx - R * 0.4, cy - R * 0.45, R * 0.6, cx, cy, R * 1.05);
    night.addColorStop(0, "rgba(3, 12, 22, 0)");
    night.addColorStop(1, "rgba(3, 12, 22, 0.45)");
    c.fillStyle = night;
    c.fillRect(cx - R, cy - R, D, D);
    c.restore();

    // the dive ends in exactly the gradient /journey starts from
    if (z > 0) {
      const a = smooth(0.2, 0.92, z);
      const ox = vw * 0.5;
      const oy = vh * 0.45;
      const far = Math.hypot(Math.max(ox, vw - ox), Math.max(oy, vh - oy));
      const sea = c.createRadialGradient(ox, oy, 0, ox, oy, far);
      sea.addColorStop(0, "#1e5a6e");
      sea.addColorStop(0.45, "#0d2b45");
      sea.addColorStop(1, "#081c2e");
      c.globalAlpha = a;
      c.fillStyle = sea;
      c.fillRect(0, 0, vw, vh);
      c.globalAlpha = 1;
    }
    rendered = true;
  }

  return {
    canvas: out,
    resize,
    render,
    isReady: () => rendered,
    destroy: () => globe?.destroy(),
  };
}

export type EarthScene = NonNullable<ReturnType<typeof createEarthScene>>;

function smooth(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Soft white cloud bands, painted once with radial gradients (no canvas filters). */
function makeCloudSprite() {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 256;
  const g = cv.getContext("2d")!;
  let s = 3;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = 0; i < 26; i++) {
    const x = rand() * 512;
    const y = 60 + rand() * 136;
    const rx = 30 + rand() * 70;
    const ry = rx * (0.25 + rand() * 0.25);
    g.save();
    g.translate(x, y);
    g.scale(1, ry / rx);
    const grad = g.createRadialGradient(0, 0, 0, 0, 0, rx);
    grad.addColorStop(0, "rgba(255,255,255,0.9)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.35)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(0, 0, rx, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  return cv;
}
