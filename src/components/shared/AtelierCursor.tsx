"use client";
import { useEffect, useRef } from "react";

/**
 * AtelierCursor — a quiet paint-dot pointer (desktop, fine pointers only).
 *
 *  • Dot   — 4px sienna, tracks the cursor exactly.
 *  • Ring  — 26px outline, lerps toward the cursor for elegant weight.
 *  • Label — over elements tagged `data-cursor="…"` the ring swells into a
 *            filled sienna disc carrying that word ("Drag", "View"), turning
 *            the pointer into a contextual affordance.
 *
 * Over plain interactive elements the ring just grows and brightens. Never runs
 * on touch or under reduced-motion.
 */
export default function AtelierCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

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
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (dotRef.current)   dotRef.current.style.transform   = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (ringRef.current)  ringRef.current.style.transform  = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      if (labelRef.current) labelRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const SEL = "a, button, [role=button], input, textarea, select, label";
    const setRing = (s: Record<string, string>) => {
      if (ringRef.current) Object.assign(ringRef.current.style, s);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element;
      const tagged = el.closest?.("[data-cursor]") as HTMLElement | null;
      if (tagged) {
        if (labelRef.current) {
          labelRef.current.textContent = tagged.dataset.cursor || "";
          labelRef.current.style.opacity = "1";
        }
        if (dotRef.current) dotRef.current.style.opacity = "0";
        setRing({
          width: "58px", height: "58px",
          backgroundColor: "rgba(176,85,47,0.95)",
          borderColor: "rgba(176,85,47,0.95)",
          boxShadow: "0 8px 24px rgba(176,85,47,0.3)",
        });
        return;
      }
      if (el.closest?.(SEL)) {
        setRing({
          width: "40px", height: "40px",
          borderColor: "rgba(176,85,47,0.7)",
          boxShadow: "0 0 12px rgba(176,85,47,0.15)",
        });
      }
    };

    const reset = () => {
      if (labelRef.current) labelRef.current.style.opacity = "0";
      if (dotRef.current)   dotRef.current.style.opacity   = "1";
      setRing({
        width: "26px", height: "26px",
        backgroundColor: "transparent",
        borderColor: "rgba(176,85,47,0.4)",
        boxShadow: "none",
      });
    };
    const onOut = (e: MouseEvent) => {
      const el = e.target as Element;
      if (el.closest?.("[data-cursor]") || el.closest?.(SEL)) reset();
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
        style={{ width: "4px", height: "4px", backgroundColor: "#B0552F", opacity: 0, willChange: "transform", transition: "opacity 0.2s ease" }} />
      <div ref={ringRef} aria-hidden className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: "26px", height: "26px", border: "1px solid rgba(176,85,47,0.4)",
          opacity: 0, willChange: "transform",
          transition: "width 0.3s cubic-bezier(0.22,1,0.36,1), height 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease",
        }} />
      <div ref={labelRef} aria-hidden className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center"
        style={{
          opacity: 0, willChange: "transform", transition: "opacity 0.25s ease",
          color: "#F7F4EE", fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        }} />
    </>
  );
}
