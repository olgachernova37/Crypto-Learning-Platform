// The scene seen through the portal: a photoreal "Earth at night from orbit".
// three.js renders a huge Earth whose curved horizon crosses the portal window: the night side
// sparkles with city lights (NASA Black Marble), the sunlit limb glows blue (NASA Blue Marble),
// and a soft atmosphere rim sits on the horizon. Stars are painted on a 2D canvas behind it.
// The portal samples this canvas full-screen (screen-locked), so the window moves, the Earth stays.
//
// Textures: NASA Blue Marble / Black Marble, public domain (via public/ocean/*.jpg).
//
// `zoom` (0..1) dives toward the surface and fades into the same deep blue /journey starts from.

import * as THREE from "three";

type Star = { x: number; y: number; r: number; a: number; tw: number };

export type SceneFrame = {
  t: number; // seconds
  cx: number; // portal centre, CSS px
  cy: number;
  diameter: number; // ~ portal size, CSS px
  zoom: number; // 0..1
};

const SUN = new THREE.Vector3(0.22, 0.38, -0.9).normalize(); // behind the planet: night face, lit limb

const earthVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFrag = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform vec3 sunDir;
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vec3 n = normalize(vNormalW);
    float ndl = dot(n, sunDir);
    vec3 day = texture2D(dayMap, vUv).rgb;
    day = pow(day, vec3(1.15)) * vec3(0.78, 0.95, 1.12); // a touch cooler, ocean-blue
    vec3 night = texture2D(nightMap, vUv).rgb;
    vec3 lights = pow(night, vec3(1.35)) * vec3(2.0, 1.5, 0.85) * 3.2; // warm sodium glow
    float dayMix = smoothstep(-0.18, 0.35, ndl);
    vec3 col = mix(lights + day * vec3(0.025, 0.045, 0.085), day * (0.25 + 0.95 * max(ndl, 0.0)), dayMix);
    // thin blue haze toward the edge of the disc
    float rim = pow(1.0 - max(n.z, 0.0), 2.6);
    col += vec3(0.18, 0.4, 0.75) * rim * (0.25 + 0.55 * smoothstep(-0.4, 0.6, ndl));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const atmoVert = /* glsl */ `
  varying vec3 vNormalW;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmoFrag = /* glsl */ `
  uniform vec3 sunDir;
  varying vec3 vNormalW;
  void main() {
    vec3 n = normalize(vNormalW);
    // backside shell: only the thin ring outside the Earth shows; n.z runs from -0.153 (at the
    // Earth's edge) to 0 (outer edge of the air), so glow is brightest on the horizon line
    float glow = pow(clamp(-n.z / 0.153, 0.0, 1.0), 2.2);
    float lit = 0.45 + 0.55 * smoothstep(-0.5, 0.6, dot(n, sunDir));
    gl_FragColor = vec4(vec3(0.42, 0.72, 1.0) * glow * lit * 1.6, glow * lit);
  }
`;

export function createEarthScene() {
  const out = document.createElement("canvas");
  const ctx = out.getContext("2d");
  if (!ctx) return null;
  const c = ctx;

  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
  } catch {
    renderer = null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -100000, 100000);

  let texturesLoaded = 0;
  const loader = new THREE.TextureLoader();
  const loadTex = (url: string) =>
    loader.load(url, (t) => {
      t.colorSpace = THREE.NoColorSpace;
      t.anisotropy = 4;
      texturesLoaded++;
    });
  const dayMap = loadTex("/ocean/earth-day.jpg");
  const nightMap = loadTex("/ocean/earth-night.jpg");

  const earthMat = new THREE.ShaderMaterial({
    uniforms: { dayMap: { value: dayMap }, nightMap: { value: nightMap }, sunDir: { value: SUN.clone() } },
    vertexShader: earthVert,
    fragmentShader: earthFrag,
  });
  const atmoMat = new THREE.ShaderMaterial({
    uniforms: { sunDir: { value: SUN.clone() } },
    vertexShader: atmoVert,
    fragmentShader: atmoFrag,
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const earthGroup = new THREE.Group();
  // tilt so ~20°N sits on the visible cap, and turn India / South-East Asia toward us
  // (three's sphere UVs put longitude -90° on +z; 80°E faces us at rotation.y ≈ 3.32)
  earthGroup.rotation.set(-0.66, 0, 0.12);
  const spin = new THREE.Group();
  spin.rotation.y = 3.2;
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), earthMat);
  spin.add(earth);
  earthGroup.add(spin);
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.012, 128, 96), atmoMat);
  scene.add(earthGroup);
  scene.add(atmo);

  const stars: Star[] = [];
  {
    let s = 7;
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    for (let i = 0; i < 320; i++) {
      stars.push({ x: rand(), y: rand(), r: 0.3 + rand() * rand() * 1.3, a: 0.15 + rand() * 0.65, tw: rand() * 6.28 });
    }
  }

  let vw = 1;
  let vh = 1;
  let dpr = 1;
  let lastT = 0;
  let rendered = false;

  function resize(width: number, height: number) {
    vw = Math.max(1, width);
    vh = Math.max(1, height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    out.width = Math.round(vw * dpr);
    out.height = Math.round(vh * dpr);
    if (renderer) {
      renderer.setPixelRatio(Math.min(dpr, 1.25));
      renderer.setSize(vw, vh, false);
    }
    // pixel-space camera: x right, y down
    camera.left = 0;
    camera.right = vw;
    camera.top = 0;
    camera.bottom = -vh;
    camera.updateProjectionMatrix();
  }

  function render(f: SceneFrame) {
    const dt = Math.min(0.05, Math.max(0, f.t - lastT));
    lastT = f.t;
    const z = f.zoom;

    // A huge Earth: its horizon crosses the portal a little above the window's centre.
    const R0 = Math.max(vw * 0.62, vh * 0.75);
    const R = R0 * (1 + 5 * Math.pow(z, 2.2));
    const horizon0 = f.cy - f.diameter * 0.3;
    const horizon = horizon0 + (-vh * 0.6 - horizon0) * Math.pow(z, 1.4); // the dive: Earth rises to fill the screen
    const ex = f.cx + (vw / 2 - f.cx) * z;
    const ey = horizon + R;

    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.globalAlpha = 1;
    c.globalCompositeOperation = "source-over";

    // deep space
    const sky = c.createLinearGradient(0, 0, 0, vh);
    sky.addColorStop(0, "#02060d");
    sky.addColorStop(0.55, "#050f1d");
    sky.addColorStop(1, "#0a1b2e");
    c.fillStyle = sky;
    c.fillRect(0, 0, vw, vh);

    // stars (a faint milky band), rushing outward as we dive
    const spread = 1 + z * 2.5;
    c.fillStyle = "#e6f0f7";
    for (const s of stars) {
      const band = 0.55 + 0.45 * Math.exp(-Math.pow((s.y - s.x * 0.35 - 0.2) * 3, 2));
      const sx = vw / 2 + (s.x * vw - vw / 2) * spread;
      const sy = vh / 2 + (s.y * vh - vh / 2) * spread;
      const a = s.a * band * (0.75 + 0.25 * Math.sin(f.t * 1.3 + s.tw)) * (1 - z);
      if (a <= 0.01) continue;
      c.globalAlpha = a;
      c.beginPath();
      c.arc(sx, sy, s.r * (1 + z * 2), 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;

    if (renderer && texturesLoaded >= 2) {
      spin.rotation.y += dt * (0.012 + z * 0.06);
      earthGroup.position.set(ex, -ey, 0);
      earthGroup.scale.setScalar(R);
      atmo.position.set(ex, -ey, 0);
      atmo.scale.setScalar(R);
      renderer.render(scene, camera);
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.drawImage(renderer.domElement, 0, 0, out.width, out.height);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      rendered = true;
    } else if (!renderer) {
      // no WebGL: a painted horizon glow
      const g = c.createRadialGradient(ex, ey, R * 0.98, ex, ey, R * 1.04);
      g.addColorStop(0, "#0d2b45");
      g.addColorStop(0.5, "rgba(107,167,220,0.8)");
      g.addColorStop(1, "rgba(107,167,220,0)");
      c.fillStyle = g;
      c.beginPath();
      c.arc(ex, ey, R * 1.04, 0, Math.PI * 2);
      c.fill();
      rendered = true;
    }

    // the dive ends in exactly the gradient /journey starts from
    if (z > 0) {
      const a = smooth(0.35, 0.95, z);
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
  }

  return {
    canvas: out,
    resize,
    render,
    isReady: () => rendered,
    destroy: () => {
      earth.geometry.dispose();
      atmo.geometry.dispose();
      earthMat.dispose();
      atmoMat.dispose();
      dayMap.dispose();
      nightMap.dispose();
      renderer?.dispose();
    },
  };
}

export type EarthScene = NonNullable<ReturnType<typeof createEarthScene>>;

function smooth(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
