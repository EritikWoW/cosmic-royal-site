/** Bright white-gold four-point sparkle used as the logo (matches the mockup). */
export default function LogoStar({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`logo-sparkle ${className}`} aria-hidden>
      <defs>
        <radialGradient id="ls-core" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".35" stopColor="#fff4d6" />
          <stop offset="1" stopColor="#f2c463" />
        </radialGradient>
        <linearGradient id="ls-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d27a" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff6dd" />
          <stop offset="1" stopColor="#f6d27a" stopOpacity="0" />
        </linearGradient>
        <filter id="ls-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#ls-glow)">
        <path d="M50 2 L53.2 46.8 L98 50 L53.2 53.2 L50 98 L46.8 53.2 L2 50 L46.8 46.8 Z" fill="url(#ls-core)" />
        <path d="M50 22 L52 48 L78 50 L52 52 L50 78 L48 52 L22 50 L48 48 Z" fill="#fff" transform="rotate(45 50 50)" opacity=".75" />
        <circle cx="50" cy="50" r="4.5" fill="#fff" />
      </g>
    </svg>
  );
}
