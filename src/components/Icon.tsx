/** Thin line icons drawn to match the mockup (stroke uses currentColor). */
const P: Record<string, React.ReactNode> = {
  layers: <><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 12.5 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="13" width="4" height="6" rx="1.6" /><rect x="17" y="13" width="4" height="6" rx="1.6" /><path d="M19 19c0 1.5-2 2.5-5 2.5" /></>,
  bolt: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />,
  diamond: <><path d="M6 3h12l3 6-9 12L3 9l3-6Z" /><path d="M3 9h18M9 3 7.5 9 12 21l4.5-12L15 3" /></>,
  sparkle: <path d="M12 2c.6 4.8 2.6 7.6 8 10-5.4 2.4-7.4 5.2-8 10-.6-4.8-2.6-7.6-8-10 5.4-2.4 7.4-5.2 8-10Z" />,
  heart: <path d="M12 20.5s-8-4.7-8-10.6A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.9c0 5.9-8 10.6-8 10.6Z" />,
  infinity: <path d="M7 8.5c-2 0-3.5 1.6-3.5 3.5S5 15.5 7 15.5c3.5 0 6.5-7 10-7 2 0 3.5 1.6 3.5 3.5S19 15.5 17 15.5c-3.5 0-6.5-7-10-7Z" />,
  telegram: <path d="M21.5 4 2.8 11.3c-.9.4-.9 1.6.1 1.9l4.6 1.5 1.8 5.6c.3.8 1.3 1 1.9.4l2.6-2.5 4.9 3.6c.7.5 1.7.1 1.9-.8L22.9 5.3c.2-1-.6-1.7-1.4-1.3ZM8 14.5l10-6.6-7.8 7.6-.4 3.2L8 14.5Z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r=".9" fill="currentColor" /></>,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9 5 3-5 3V9Z" fill="currentColor" /></>,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  chat: <><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" /></>,
  play: <path d="M8 5.5v13l10-6.5-10-6.5Z" />,
};

export default function Icon({ name, size = 22, className }: { name: keyof typeof P | string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {P[name]}
    </svg>
  );
}
