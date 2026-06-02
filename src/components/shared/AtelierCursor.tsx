"use client";
import { useEffect, useRef } from "react";

/**
 * AtelierCursor — a quiet paint-dot pointer (desktop, fine pointers only).
 *
 *  • Dot  — 4px sienna, tracks the cursor exactly (no lag).
 *  • Ring — 26px outline, lerps toward the cursor (factor 0.10) for elegant weight.
 *
 * Over interactive elements the ring grows to 40px, brightens, and gains a
 * soft glow. Event delegation keeps it working for anything React renders.
 * Never runs on touch or under reduced-motion.
 */
export default function AtelierCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (dotRef.current)  dotRef.current.style.opacity  = "1";
    if (ringRef.current) ringRef.current.style.opacity = "1";

    const root = document.documentElement;
    root.style.cursor = "none";

    let mx = -100, my = -100, rx = -100, ry = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const SEL = "a, button, [role=button], input, textarea, select, label";
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest?.(SEL)) {
        const r = ringRef.current;
        if (r) {
          r.style.width = "40px"; r.style.height = "40px";
          r.style.borderColor = "rgba(176,85,47,0.7)";
          r.style.boxShadow = "0 0 12px rgba(176,85,47,0.15)";
        }
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest?.(SEL)) {
        const r = ringRef.current;
        if (r) {
          r.style.width = "26px"; r.style.height = "26px";
          r.style.borderColor = "rgba(176,85,47,0.4)";
          r.style.boxShadow = "none";
        }
      }
    };
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout",  onOut,  { passive: true });
    const onLeave = () => { mx = -100; my = -100; };
    document.addEventListener("mouseleave", onLeave);

    return () => {
      root.style.cursor = "";
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} aria-hidden className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{ width: "4px", height: "4px", backgroundColor: "#B0552F", opacity: 0, willChange: "transform" }} />
      <div ref={ringRef} aria-hidden className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: "26px", height: "26px", border: "1px solid rgba(176,85,47,0.4)",
          opacity: 0, willChange: "transform",
          transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
        }} />
    </>
  );
}
