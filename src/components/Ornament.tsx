/** Gold divider: line · crescent · four-point star · crescent · line. */
export default function Ornament() {
  return (
    <div className="ornament reveal" aria-hidden>
      <svg viewBox="0 0 520 60" role="presentation">
        <defs>
          <linearGradient id="og" x1="0" x2="1"><stop offset="0" stopColor="#d4af37" stopOpacity="0" /><stop offset=".5" stopColor="#ffd86b" /><stop offset="1" stopColor="#d4af37" stopOpacity="0" /></linearGradient>
          <radialGradient id="ostar"><stop offset="0" stopColor="#fff6d6" /><stop offset=".6" stopColor="#ffd86b" /><stop offset="1" stopColor="#c8932c" /></radialGradient>
        </defs>
        <path d="M20 30 H196 M324 30 H500" stroke="url(#og)" strokeWidth="1.6" />
        <path d="M190 30 l6 -4 l6 4 l-6 4z M318 30 l6 -4 l6 4 l-6 4z" fill="#ffd86b" />
        <circle cx="150" cy="30" r="2" fill="#ffd86b" /><circle cx="370" cy="30" r="2" fill="#ffd86b" />
        <path d="M226 17 A13 13 0 1 0 226 43 A10 13 0 1 1 226 17 Z" fill="#ffd86b" />
        <path d="M294 17 A13 13 0 1 1 294 43 A10 13 0 1 0 294 17 Z" fill="#ffd86b" />
        <path d="M260 2 L265 25 L288 30 L265 35 L260 58 L255 35 L232 30 L255 25 Z" fill="url(#ostar)" className="ornament-star" />
        <circle cx="260" cy="30" r="3" fill="#a370ff" />
      </svg>
    </div>
  );
}
