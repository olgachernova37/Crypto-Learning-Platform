// A small, soft, top-down sailboat pointing right (+x). Drawn for this project.
// Size is set by the parent (width); the SVG keeps a 2:1 ratio.

export function Boat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true" focusable="false">
      <defs>
        <filter id="boat-shadow" x="-30%" y="-50%" width="160%" height="200%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
        <linearGradient id="boat-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eef3f6" />
        </linearGradient>
        <linearGradient id="boat-deck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8d8bf" />
          <stop offset="1" stopColor="#d6c09e" />
        </linearGradient>
        <linearGradient id="boat-sail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbe9f2" />
        </linearGradient>
      </defs>

      {/* soft shadow on the water */}
      <path
        d="M16,33 C16,20 31,15 54,15 L80,15 C97,15 109,24 113,33 C109,43 97,51 80,51 L54,51 C31,51 16,46 16,33 Z"
        fill="#02101c"
        opacity="0.45"
        filter="url(#boat-shadow)"
      />

      {/* hull */}
      <path
        d="M12,30 C12,17 28,11 52,11 L78,11 C96,11 108,20 113,30 C108,40 96,49 78,49 L52,49 C28,49 12,43 12,30 Z"
        fill="url(#boat-hull)"
      />
      {/* seafoam rub-rail */}
      <path
        d="M12,30 C12,17 28,11 52,11 L78,11 C96,11 108,20 113,30 C108,40 96,49 78,49 L52,49 C28,49 12,43 12,30 Z"
        fill="none"
        stroke="#6ba7a0"
        strokeWidth="1.6"
        opacity="0.9"
      />
      {/* wooden deck */}
      <path
        d="M19,30 C19,21 31,16.5 52,16.5 L77,16.5 C91,16.5 100,22 104,30 C100,38 91,43.5 77,43.5 L52,43.5 C31,43.5 19,39 19,30 Z"
        fill="url(#boat-deck)"
      />
      <g stroke="#c9b18c" strokeWidth="0.7" opacity="0.7">
        <path d="M24,24.5 H98" />
        <path d="M21,30 H103" />
        <path d="M24,35.5 H98" />
      </g>

      {/* cosy cabin with a rounded roof */}
      <rect x="27" y="19.5" width="27" height="21" rx="8" fill="#1e5a6e" />
      <rect x="29.5" y="21.5" width="22" height="17" rx="6.5" fill="#2a6f84" />
      <circle cx="35" cy="30" r="2" fill="#b7d4e6" />
      <circle cx="42" cy="30" r="2" fill="#b7d4e6" />

      {/* little lifebuoy */}
      <circle cx="92" cy="36" r="4" fill="none" stroke="#ffffff" strokeWidth="2.4" />
      <circle cx="92" cy="36" r="4" fill="none" stroke="#e98f7a" strokeWidth="2.4" strokeDasharray="3.1 3.2" />

      {/* sail, seen from above, bellied to one side */}
      <path d="M71,30 C63,13 46,6 29,9 C44,15 58,21 71,30 Z" fill="url(#boat-sail)" />
      <path d="M71,30 C63,13 46,6 29,9" fill="none" stroke="#b7d4e6" strokeWidth="0.9" />
      <path d="M71,30 L30,10" stroke="#9b8466" strokeWidth="1.4" strokeLinecap="round" />

      {/* mast + pennant */}
      <circle cx="71" cy="30" r="3.2" fill="#ffffff" stroke="#9b8466" strokeWidth="1" />
      <path d="M71,30 L62,33.5 L71,35 Z" fill="#dcc8aa" />
    </svg>
  );
}
