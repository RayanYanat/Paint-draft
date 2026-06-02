"use client";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Global GSAP + Lenis smooth-scroll setup. Mounts once, no DOM output.
 *
 * Lenis smooths the mouse wheel on desktop and stays on native momentum for
 * touch (lighter, less laggy on phones). It is disabled entirely under
 * prefers-reduced-motion. ScrollTrigger is driven from Lenis's RAF loop so
 * every scroll-linked animation (reveals, parallax, count-ups) stays in sync.
 *
 * All browser work lives inside useEffect — "use client" module code still
 * runs on the server during SSR, and ScrollTrigger/Lenis touch browser-only
 * APIs that don't exist in Node.
 */
export default function GSAPConfig() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Respect reduced-motion: no smooth scroll, just reset to top.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      syncTouch: false, // keep native momentum scrolling on touch devices
      touchMultiplier: 1.6,
    });

    // Keep ScrollTrigger perfectly in sync with Lenis.
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // In-page anchor links (#services, #contact…) → smooth scroll with a
    // navbar-height offset, instead of a native jump.
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", onAnchorClick);

    lenis.scrollTo(0, { immediate: true });

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
