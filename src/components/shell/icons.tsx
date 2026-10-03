// Small inline SVG icons for the app chrome. Stroke-based, rounded caps, inherit currentColor.

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

/** Our wave mark: a soft circle with two waves. */
export function WaveLogo({ size = 28, ...rest }: IconProps) {
  return (
    <svg {...base({ size, ...rest })} viewBox="0 0 32 32" strokeWidth={1.6}>
      <circle cx="16" cy="16" r="14" />
      <path d="M6.5 14.5c2.2-2.4 4.4-2.4 6.6 0s4.4 2.4 6.6 0 4.4-2.4 6.6 0" />
      <path d="M8.5 20c1.8-1.9 3.7-1.9 5.5 0s3.7 1.9 5.5 0 3.7-1.9 5.5 0" opacity="0.6" />
    </svg>
  );
}

/** Journey: a little sailboat. */
export function BoatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v12" />
      <path d="M12 4.5 18 13h-6" />
      <path d="M12 7 7.5 13H12" />
      <path d="M3.5 16h17l-2.2 3.2a2 2 0 0 1-1.6.8H7.3a2 2 0 0 1-1.6-.8Z" />
    </svg>
  );
}

/** Lessons: an open book. */
export function BookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 6.5C10.3 5 8 4.5 4.5 4.8v13.4c3.5-.3 5.8.2 7.5 1.8 1.7-1.6 4-2.1 7.5-1.8V4.8C16 4.5 13.7 5 12 6.5Z" />
      <path d="M12 6.5V20" />
    </svg>
  );
}

/** Progress: a rising path with a star. */
export function ProgressIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 19.5h16" />
      <path d="M6.5 16v-3" />
      <path d="M11 16V10" />
      <path d="M15.5 16V7.5" />
      <path d="m18.6 3.4.5 1.2 1.3.1-1 .9.3 1.3-1.1-.7-1.1.7.3-1.3-1-.9 1.3-.1Z" fill="currentColor" strokeWidth={1} />
    </svg>
  );
}

/** Partners: a heart inside a soft speech bubble ("we recommend"). */
export function PartnersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20.5s-7.5-4.3-7.5-10A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.5c0 5.7-7.5 10-7.5 10Z" />
    </svg>
  );
}

/** A gentle flame for the streak. Filled, two tones. */
export function FlameIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable={false} {...rest}>
      <path
        d="M12 2.5c.6 3.1 4.2 5 5.6 8.4 1.7 4.1-.8 9.6-5.6 9.6s-7.6-4.6-6.1-8.6c.6-1.6 1.7-2.6 2.6-3.3-.1 1.6.4 2.9 1.5 3.6C9.6 9 10.4 5.4 12 2.5Z"
        fill="#dcc8aa"
      />
      <path
        d="M12 12.2c1.3 1.5 2.6 2.7 2.6 4.4a2.6 2.6 0 0 1-5.2 0c0-1.5.9-2.3 1.7-3.1.4-.4.7-.8.9-1.3Z"
        fill="#e9a77b"
      />
    </svg>
  );
}

/** Tiny sparkle/star for XP. */
export function XpIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable={false} {...rest}>
      <path
        d="M12 3.2c.5 3.9 2.4 6.3 6.6 7.3.5.1.5.9 0 1-4.2 1-6.1 3.4-6.6 7.3-.1.6-.9.6-1 0-.5-3.9-2.4-6.3-6.6-7.3-.5-.1-.5-.9 0-1 4.2-1 6.1-3.4 6.6-7.3.1-.6.9-.6 1 0Z"
        fill="#6ba7a0"
      />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 8h14M5 12h14M5 16h14" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={2.4}>
      <path d="m5.5 12.5 4 4 9-9.5" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 16 16.5 7.5M9.5 7.5h7v7" />
    </svg>
  );
}
