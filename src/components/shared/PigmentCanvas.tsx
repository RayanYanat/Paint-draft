"use client";
import { useEffect, useRef } from "react";

/**
 * PigmentCanvas — pigment dust suspended in the air of the room.
 *
 * Soft radial blobs in five earth/pigment tints drift slowly in ALL
 * directions (not rising like heat — settling like dust). Each keeps its
 * tint for life (no scroll color-shift). A paper-toned ghost trail keeps the
 * motion soft and avoids full redraws.
 *
 * Sits fixed behind <main>; the translucent section backgrounds let it read
 * as a faint living atmosphere. Disabled entirely under reduced-motion.
 */
interface Mote {
  x: number; y: number;
  angle: number; speed: number;
  size: number;
  life: number; maxLife: number;
  phase: number;
  r: number; g: number; b: number;
}

const PIGMENTS = [
  [176, 85, 47],   // sienna (dominant)
  [196, 128, 61],  // yellow ochre
  [138, 110, 75],  // raw umber
  [107, 98, 88],   // warm grey
  [122, 128, 104], // light olive
];

function rnd(a: number, b: number) { return a + Math.random() * (b - a); }

function spawn(vw: number, vh: number, mobile: boolean, atEdge = false): Mote {
  const [r, g, b] = PIGMENTS[Math.floor(Math.random() * PIGMENTS.length)];
  return {
    x: Math.random() * vw,
    y: atEdge ? vh + 60 : Math.random() * vh,
    angle: Math.random() * Math.PI * 2,
    speed: rnd(0.15, 0.4),
    size: mobile ? rnd(40, 120) : rnd(120, 340),
    life: atEdge ? 0 : Math.random() * 400,
    maxLife: rnd(620, 1100),
    phase: Math.random() * Math.PI * 2,
    r, g, b,
  };
}

export default function PigmentCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Desktop-only: a full-screen canvas redrawn every frame is wasted battery
    // on phones/tablets, where the faint dust barely reads anyway. The warm
    // paper + static grain keep the atmosphere.
    if (window.innerWidth < 1024) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let time = 0;
    const isMobile   = window.innerWidth < 768;
    const N          = isMobile ? 5 : 14;
    const ghostAlpha = isMobile ? 0.25 : 0.08;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();

    let motes: Mote[] = Array.from({ length: N }, () => spawn(window.innerWidth, window.innerHeight, isMobile));

    const frame = () => {
      time += 0.005;
      const vw = window.innerWidth, vh = window.innerHeight;

      // Paper-toned ghost trail (soft persistence, never a hard clear)
      ctx.fillStyle = `rgba(244,240,232,${ghostAlpha})`;
      ctx.fillRect(0, 0, vw, vh);

      for (let i = 0; i < motes.length; i++) {
        const p = motes[i];
        p.life += 1;
        if (p.life >= p.maxLife) { motes[i] = spawn(vw, vh, isMobile, true); continue; }

        // Slow drift in the mote's own direction + gentle sinusoidal wander
        p.x += Math.cos(p.angle) * p.speed + Math.cos(time * 0.3 + p.phase) * 0.16;
        p.y += Math.sin(p.angle) * p.speed + Math.sin(time * 0.4 + p.phase * 1.3) * 0.16;

        // Wrap softly around the viewport
        if (p.x < -p.size) p.x = vw + p.size;
        if (p.x > vw + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = vh + p.size;
        if (p.y > vh + p.size) p.y = -p.size;

        const prog = p.life / p.maxLife;
        const env  = prog < 0.15 ? prog / 0.15 : prog > 0.70 ? 1 - (prog - 0.70) / 0.30 : 1;
        const alpha = env * 0.38;
        if (alpha < 0.004) continue;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0,    `rgba(${p.r},${p.g},${p.b},${alpha})`);
        grad.addColorStop(0.45, `rgba(${p.r},${p.g},${p.b},${alpha * 0.32})`);
        grad.addColorStop(1,    `rgba(${p.r},${p.g},${p.b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    frame();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={ref} aria-hidden className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
  );
}
