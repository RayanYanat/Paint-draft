"use client";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * Global GSAP configuration — mounts once, no DOM output.
 *
 * Everything lives inside useEffect (browser-only).
 * Module-level GSAP calls crash Next.js static generation because
 * "use client" module code still runs on the server during SSR —
 * ScrollTrigger.config() hits browser APIs that don't exist in Node.js,
 * corrupting GSAP state before the client ever loads.
 *
 * ignoreMobileResize: true
 *   Prevents ScrollTrigger from recalculating trigger positions every time
 *   the iOS browser chrome shows/hides during scroll (which fires a resize
 *   event). Without this, triggers can fire at wrong positions on iPhone.
 */
export default function GSAPConfig() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return null;
}
