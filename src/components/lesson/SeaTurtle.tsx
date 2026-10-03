// An original, cute little sea turtle in the ocean palette — placeholder NFT animal art.
import m from "./motion.module.css";

export function SeaTurtle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 200" className={className} role="img" aria-label="A smiling little sea turtle">
      <g className={m.float}>
        {/* bubbles */}
        <g fill="none" stroke="#f6fafc" strokeWidth="3" opacity="0.9">
          <circle cx="232" cy="64" r="6" />
          <circle cx="242" cy="40" r="4" />
          <circle cx="230" cy="22" r="2.6" />
        </g>
        {/* back flipper */}
        <path d="M70 128c-18 6-34 18-40 32 16 2 34-4 48-16z" fill="#7fb8b0" />
        {/* tail */}
        <path d="M48 122l-16 8 18 4z" fill="#7fb8b0" />
        {/* neck + head */}
        <path d="M168 104c10-6 22-8 32-4l-6 30c-10 2-20 0-30-6z" fill="#8fc3bb" />
        <circle cx="204" cy="104" r="27" fill="#8fc3bb" />
        <ellipse cx="200" cy="118" rx="8" ry="5" fill="#dcc8aa" opacity="0.9" />
        <circle cx="210" cy="98" r="6.5" fill="#0d2b45" />
        <circle cx="212.4" cy="95.6" r="2.3" fill="#fff" />
        <path d="M214 114q6 5 12-1" stroke="#0d2b45" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* shell */}
        <path d="M44 126c0-50 34-80 74-80s68 30 68 80z" fill="#1e5a6e" />
        <path d="M92 64c8-8 18-11 28-11s20 3 27 10l-8 22H99z" fill="#6ba7a0" />
        <path d="M58 116c2-18 10-34 22-46l14 20-6 26z" fill="#6ba7a0" />
        <path d="M172 116c-2-18-9-33-20-44l-13 18 6 26z" fill="#6ba7a0" />
        <path d="M100 92h40l6 24H94z" fill="#6ba7a0" />
        <path d="M70 72c10-14 26-22 44-24" stroke="#b7d4e6" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
        {/* shell rim */}
        <rect x="36" y="118" width="158" height="18" rx="9" fill="#dcc8aa" />
        {/* front flipper */}
        <path d="M150 132c10 14 28 24 46 26-4-14-18-28-36-34z" fill="#7fb8b0" />
        <path d="M70 132c-4 10-4 20 2 28 8-6 12-16 12-26z" fill="#7fb8b0" />
      </g>
    </svg>
  );
}
