// Soft, flat ocean illustration for the lesson "chapter" intro and the finale.
// Pure SVG in palette colours; decorative only.
import m from "./motion.module.css";

// deterministic pseudo-random so server and client render the same
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rnd = seeded(7);
const SPARKLES = Array.from({ length: 64 }, () => ({
  x: rnd() * 1440,
  y: 120 + rnd() * 780,
  w: 10 + rnd() * 22,
  o: 0.12 + rnd() * 0.32,
  d: rnd() * 3,
}));
const STARS = Array.from({ length: 46 }, () => ({
  x: rnd() * 1440,
  y: rnd() * 520,
  r: 0.8 + rnd() * 1.8,
  d: rnd() * 3,
}));

export function SeaScene({ variant = "intro", className = "" }: { variant?: "intro" | "finale"; className?: string }) {
  const finale = variant === "finale";
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`sea-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={finale ? "#081c2e" : "#0d2b45"} />
          <stop offset="1" stopColor={finale ? "#0d2b45" : "#081c2e"} />
        </linearGradient>
        <radialGradient id={`glow-${variant}`} cx={finale ? "0.5" : "0.72"} cy={finale ? "0.95" : "0.28"} r="0.6">
          <stop offset="0" stopColor="#1e5a6e" stopOpacity="0.85" />
          <stop offset="1" stopColor="#1e5a6e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="globe" cx="0.45" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#2b7187" />
          <stop offset="0.6" stopColor="#1e5a6e" />
          <stop offset="1" stopColor="#0d2b45" />
        </radialGradient>
        <clipPath id="globe-clip">
          <circle cx="720" cy="1520" r="860" />
        </clipPath>
        <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor="#081c2e" stopOpacity="0" />
          <stop offset="1" stopColor="#081c2e" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      <rect width="1440" height="900" fill={`url(#sea-${variant})`} />
      <rect width="1440" height="900" fill={`url(#glow-${variant})`} />
      <rect width="1440" height="900" fill="url(#vignette)" opacity={finale ? 0.4 : 1} />

      {finale ? (
        <>
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={i % 5 === 0 ? "#dcc8aa" : "#b7d4e6"}
              className={m.twinkle}
              style={{ animationDelay: `${s.d}s` }}
            />
          ))}
          {/* the globe, seen from space */}
          <circle cx="720" cy="1520" r="900" fill="#b7d4e6" opacity="0.08" />
          <circle cx="720" cy="1520" r="875" fill="#b7d4e6" opacity="0.1" />
          <circle cx="720" cy="1520" r="860" fill="url(#globe)" />
          <g clipPath="url(#globe-clip)" fill="#6ba7a0" opacity="0.55">
            <path d="M380 760c60-40 150-30 190 10s20 90-40 110-120 10-160-20-50-70 10-100z" />
            <path d="M880 700c80-30 190-10 230 40s0 100-70 110-150-20-180-60 0-70 20-90z" />
            <path d="M620 860c30-20 80-15 95 10s-10 45-45 45-60-30-50-55z" />
          </g>
          <g clipPath="url(#globe-clip)" fill="none" stroke="#b7d4e6" strokeOpacity="0.18" strokeWidth="2">
            <ellipse cx="720" cy="1520" rx="860" ry="300" />
            <ellipse cx="720" cy="1520" rx="420" ry="860" />
          </g>
        </>
      ) : (
        <>
          <g className={m.drift}>
            {SPARKLES.slice(0, 32).map((s, i) => (
              <path
                key={i}
                d={`M${s.x} ${s.y}q${s.w / 2} -${s.w / 4} ${s.w} 0`}
                stroke="#fff"
                strokeOpacity={s.o}
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
            ))}
          </g>
          <g className={m.driftSlow}>
            {SPARKLES.slice(32).map((s, i) => (
              <path
                key={i}
                d={`M${s.x} ${s.y}q${s.w / 2} -${s.w / 4} ${s.w} 0`}
                stroke="#b7d4e6"
                strokeOpacity={s.o}
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
            ))}
          </g>

          {/* little island, bottom-left */}
          <g transform="translate(90 660) scale(0.72)">
            <path
              d="M10 170c-30-60 10-130 90-150s170-10 230 30 90 110 40 150-170 40-250 30-90-20-110-60z"
              fill="#b7d4e6"
              opacity="0.22"
            />
            <path
              d="M40 160c-20-50 20-110 90-125s150-5 195 30 60 90 20 115-150 30-220 20-70-10-85-40z"
              fill="#dcc8aa"
            />
            <path d="M120 120c30-30 90-40 140-20s40 60-10 70-120 10-130-50z" fill="#6ba7a0" opacity="0.85" />
            {/* palm */}
            <path d="M205 110c-2-30 4-55 14-75" stroke="#8a6f4e" strokeOpacity="0.8" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M219 35c-25-10-45-2-55 12 20-4 38 0 55-12zM219 35c22-14 46-10 58 4-20-2-40 2-58-4zM219 35c-6-22 4-38 18-44-4 18-6 30-18 44z" fill="#6ba7a0" />
          </g>

          {/* a soft, cute boat with its wake */}
          <g transform="translate(660 230)">
            <g opacity="0.55" stroke="#fff" strokeLinecap="round" fill="none">
              <path d="M-10 78c-60 4-120 14-190 34" strokeWidth="5" strokeOpacity="0.5" />
              <path d="M-10 92c-50 14-100 34-150 64" strokeWidth="4" strokeOpacity="0.35" />
              <path d="M-14 84c-90 10-170 22-260 44" strokeWidth="2.5" strokeOpacity="0.25" />
            </g>
            <g className={m.bob}>
              <ellipse cx="62" cy="86" rx="82" ry="10" fill="#081c2e" opacity="0.45" />
              <path d="M58 -64v128" stroke="#f6fafc" strokeWidth="5" strokeLinecap="round" />
              <path d="M64 -58c34 30 50 70 50 116H64z" fill="#f6fafc" />
              <path d="M52 -44c-22 26-34 58-36 102h36z" fill="#b7d4e6" />
              <path d="M58 -64l22 8-22 8z" fill="#6ba7a0" />
              <path d="M-6 62h136c-6 18-22 30-42 30H30C12 92 0 80-6 62z" fill="#dcc8aa" />
              <path d="M2 74h120" stroke="#1e5a6e" strokeWidth="5" strokeLinecap="round" />
            </g>
          </g>
        </>
      )}

    </svg>
  );
}
