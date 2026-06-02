"use client";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

/**
 * Before / After reveal — the signature interaction.
 *
 * One photograph, drawn twice. The bottom copy is the vibrant "after"; the
 * top copy carries a dull, faded filter (the "before") and is clipped by a
 * draggable divider. Drag the handle to wipe the tired coat away and reveal
 * the fresh one. On scroll-in it sweeps once on its own to teach the gesture.
 *
 * Position is written straight to the DOM via refs (no per-move re-render).
 */
interface Props {
  src: string;
  beforeSrc?: string;       // optional separate "before" photo; else src is filtered
  alt: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  overlay?: boolean;        // dark legibility gradient (hero full-bleed)
  beforeFilter?: string;    // override the "before" CSS filter
  sweepFrom?: number;       // auto-sweep start %
  sweepTo?: number;         // auto-sweep end %
}

const DEFAULT_BEFORE_FILTER = "grayscale(0.85) brightness(0.72) contrast(0.85) sepia(0.35) saturate(0.4)";

export default function BeforeAfter({
  src, beforeSrc, alt,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
  priority = false,
  sizes = "100vw",
  overlay = false,
  beforeFilter = DEFAULT_BEFORE_FILTER,
  sweepFrom = 70,
  sweepTo = 44,
}: Props) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const knobRef   = useRef<HTMLDivElement>(null);
  const posRef    = useRef(50);
  const draggingRef = useRef(false);
  const touchedRef  = useRef(false);

  const apply = (p: number) => {
    const c = Math.max(0, Math.min(100, p));
    posRef.current = c;
    if (beforeRef.current) beforeRef.current.style.clipPath = `inset(0 ${100 - c}% 0 0)`;
    if (handleRef.current) handleRef.current.style.left = `${c}%`;
    if (knobRef.current) knobRef.current.setAttribute("aria-valuenow", String(Math.round(c)));
  };

  /* Pointer drag (mouse + touch via pointer events) */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const toPct = (clientX: number) => {
      const r = wrap.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    };
    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      touchedRef.current = true;
      try { wrap.setPointerCapture(e.pointerId); } catch {}
      apply(toPct(e.clientX));
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      apply(toPct(e.clientX));
    };
    const onUp = () => { draggingRef.current = false; };

    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  /* Scroll-in self-demo sweep (teaches the gesture). Yields to user input. */
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { apply(50); return; }
      apply(sweepFrom);
      gsap.registerPlugin(ScrollTrigger);
      const o = { p: sweepFrom };
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top 80%",
        once: true,
        onEnter: () =>
          gsap.to(o, {
            p: sweepTo, duration: 1.8, ease: "power2.inOut",
            onUpdate: () => { if (!touchedRef.current) apply(o.p); },
          }),
      });
    },
    { scope: wrapRef }
  );

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft")  { touchedRef.current = true; apply(posRef.current - 4); e.preventDefault(); }
    if (e.key === "ArrowRight") { touchedRef.current = true; apply(posRef.current + 4); e.preventDefault(); }
  };

  // In overlay (full-bleed hero) mode the corner labels sit under the fixed
  // navbar — drop them below it so they don't collide with the wordmark/menu.
  const labelTop = overlay ? "top-20 lg:top-24" : "top-4";

  return (
    <div
      ref={wrapRef}
      data-cursor="Drag"
      className={`relative overflow-hidden select-none cursor-ew-resize bg-paper-deep ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      {/* AFTER — vibrant, full */}
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      {/* fresh-paint light sheen */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(244,240,232,0.06) 0%, transparent 60%)" }} />
      <span className={`absolute ${labelTop} right-4 z-20 kicker px-2.5 py-1 rounded-sm`}
        style={{ backgroundColor: "rgba(244,240,232,0.85)", color: "#211C17" }}>
        {afterLabel}
      </span>

      {/* BEFORE — dull, clipped */}
      <div ref={beforeRef} className="absolute inset-0 z-10" style={{ clipPath: "inset(0 50% 0 0)" }}>
        <Image src={beforeSrc ?? src} alt="" fill sizes={sizes} className="object-cover" style={{ filter: beforeSrc ? undefined : beforeFilter }} />
        {/* aged / yellowed-wall cast */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(139,119,90,0.18) 0%, rgba(90,75,58,0.12) 100%)" }} />
        <span className={`absolute ${labelTop} left-4 kicker px-2.5 py-1 rounded-sm`}
          style={{ backgroundColor: "rgba(33,28,23,0.6)", color: "#F4F0E8" }}>
          {beforeLabel}
        </span>
      </div>

      {/* Dark legibility overlay (hero full-bleed) */}
      {overlay && (
        <div className="absolute inset-0 z-[15] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)" }} />
      )}

      {/* Divider + handle */}
      <div ref={handleRef} className="absolute top-0 bottom-0 z-30 pointer-events-none" style={{ left: "50%" }}>
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5"
          style={{ backgroundColor: "rgba(244,240,232,0.92)", boxShadow: "0 0 0 1px rgba(33,28,23,0.18)" }} />
        <div
          ref={knobRef}
          role="slider"
          aria-label="Drag to compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          tabIndex={0}
          onKeyDown={onKey}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center pointer-events-auto cursor-ew-resize outline-none focus-visible:ring-2"
          style={{ backgroundColor: "#F4F0E8", color: "#211C17", boxShadow: "0 6px 20px rgba(33,28,23,0.28), 0 0 0 1px rgba(33,28,23,0.1)" }}
        >
          <MoveHorizontal size={17} />
        </div>
      </div>

      {/* Drag hint */}
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 kicker px-2.5 py-1 rounded-sm pointer-events-none"
        style={{ backgroundColor: "rgba(244,240,232,0.82)", color: "#6B6258", fontSize: "0.625rem" }}>
        Drag to reveal
      </span>
    </div>
  );
}
