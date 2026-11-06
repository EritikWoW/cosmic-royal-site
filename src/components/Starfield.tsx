"use client";
import { useEffect, useRef } from "react";

/** Animated twinkling star field with occasional shooting stars, fixed behind the page. */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type Star = { x: number; y: number; r: number; p: number; s: number; gold: boolean };
    let stars: Star[] = [];
    let shooting: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 9000);
      stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.3 + 0.2, p: Math.random() * Math.PI * 2, s: 0.4 + Math.random() * 1.6, gold: Math.random() < 0.18 }));
    };
    resize();
    window.addEventListener("resize", resize);
    let scrollY = window.scrollY;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = reduce ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 1000 * s.s + s.p));
        const y = ((s.y - scrollY * 0.05 * s.r) % h + h) % h;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold ? `rgba(255,216,107,${a})` : `rgba(215,179,255,${a})`;
        ctx.fill();
      }
      if (!reduce) {
        if (!shooting && Math.random() < 0.004) shooting = { x: Math.random() * w * 0.8, y: Math.random() * h * 0.4, vx: 7 + Math.random() * 4, vy: 3 + Math.random() * 2, life: 1 };
        if (shooting) {
          const g = ctx.createLinearGradient(shooting.x, shooting.y, shooting.x - shooting.vx * 14, shooting.y - shooting.vy * 14);
          g.addColorStop(0, `rgba(255,236,180,${shooting.life})`); g.addColorStop(1, "rgba(255,236,180,0)");
          ctx.strokeStyle = g; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(shooting.x, shooting.y); ctx.lineTo(shooting.x - shooting.vx * 14, shooting.y - shooting.vy * 14); ctx.stroke();
          shooting.x += shooting.vx; shooting.y += shooting.vy; shooting.life -= 0.015;
          if (shooting.life <= 0) shooting = null;
        }
        raf = requestAnimationFrame(draw);
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("scroll", onScroll); };
  }, []);
  return <canvas ref={ref} aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }} />;
}
