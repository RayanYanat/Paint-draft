"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * MagneticButton — an <a> that drifts toward the cursor when it comes within
 * range, then springs back. Desktop / fine-pointer only; inert under
 * reduced-motion. All anchor props (href, className, style, handlers) pass through.
 */
export default function MagneticButton({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const range = 120;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < range) {
        const pull = 1 - dist / range;
        gsap.to(el, { x: dx * pull * 0.35, y: dy * pull * 0.35, duration: 0.4, ease: "power2.out" });
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      }
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <a ref={ref} {...props}>
      {children}
    </a>
  );
}
