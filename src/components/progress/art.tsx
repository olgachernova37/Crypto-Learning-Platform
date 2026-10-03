// Small flat illustrations for the progress page. Palette colours only.
// The turtle is a placeholder until the mascot is designed.

type ArtProps = { size?: number; muted?: boolean };

export function TurtleArt({ size = 64, muted = false }: ArtProps) {
  const shell = muted ? "#c9d6de" : "#6ba7a0";
  const shellDark = muted ? "#b3c3cd" : "#1e5a6e";
  const skin = muted ? "#dde6ec" : "#dcc8aa";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden focusable={false}>
      <ellipse cx="14" cy="44" rx="6" ry="4" fill={skin} transform="rotate(-25 14 44)" />
      <ellipse cx="46" cy="47" rx="6" ry="4" fill={skin} transform="rotate(25 46 47)" />
      <ellipse cx="14" cy="26" rx="6" ry="3.6" fill={skin} transform="rotate(25 14 26)" />
      <circle cx="51" cy="29" r="8" fill={skin} />
      <circle cx="53.5" cy="27" r="1.6" fill="#0d2b45" opacity={muted ? 0.25 : 1} />
      <path d="M52 32.2c1.2.8 2.6.8 3.6-.2" stroke="#0d2b45" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity={muted ? 0.25 : 0.8} />
      <path d="M8 38c0-12 9.5-20 22-20s19 8 19 18c0 4-2 6-6 6H13c-3.4 0-5-1.4-5-4Z" fill={shell} />
      <path
        d="M20 24.5 26 30l-2 8M38 23l-4 7 5 8M26 30h8"
        stroke={shellDark}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.55"
      />
    </svg>
  );
}

export function SailboatArt({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden focusable={false}>
      <path d="M48 14v46" stroke="#0d2b45" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 16c12 10 18 24 18 40H50Z" fill="#ffffff" />
      <path d="M46 24C38 32 32 44 31 56h15Z" fill="#dcc8aa" />
      <path d="M50 10l9 3-9 3Z" fill="#6ba7a0" />
      <path d="M20 62h56l-6 10a6 6 0 0 1-5 3H31a6 6 0 0 1-5-3Z" fill="#1e5a6e" />
      <path
        d="M10 82c5-4 10-4 15 0s10 4 15 0 10-4 15 0 10 4 15 0 10-4 15 0"
        stroke="#6ba7a0"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
