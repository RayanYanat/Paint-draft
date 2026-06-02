"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Root-route screen, shown when a visitor drops the personalized slug.
 * Light editorial treatment — initial states live in globals.css (.lk-*).
 */
export default function LockedScreen() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(".lk-rule,.lk-kicker,.lk-title,.lk-meta,.lk-lede", { opacity: 1, clearProps: "transform" });
      return;
    }
    gsap.set(".lk-rule",   { opacity: 1, scaleX: 0, transformOrigin: "center" });
    gsap.set(".lk-kicker", { opacity: 0, y: 12 });
    gsap.set(".lk-title",  { opacity: 0, y: 36 });
    gsap.set(".lk-lede",   { opacity: 0, y: 14 });
    gsap.set(".lk-meta",   { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".lk-rule",   { scaleX: 1, duration: 0.9, ease: "expo.out" })
      .to(".lk-kicker", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
      .to(".lk-title",  { opacity: 1, y: 0, duration: 1.0, ease: "power3.out", stagger: 0.12 }, "-=0.3")
      .to(".lk-lede",   { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, "-=0.5")
      .to(".lk-meta",   { opacity: 1, duration: 0.6 }, "-=0.3");
  }, { scope: ref });

  return (
    <div ref={ref} className="relative min-h-screen flex items-center justify-center bg-paper overflow-hidden">
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center">

        <div className="lk-rule rule w-16 mx-auto mb-7" />
        <span className="lk-kicker kicker block mb-10">Private Preview</span>

        <h1 className="lk-title font-display font-extrabold text-ink"
          style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          A preview,
        </h1>
        <h1 className="lk-title font-display italic font-medium text-sienna"
          style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)", lineHeight: 1.12 }}>
          made for you.
        </h1>

        <p className="lk-lede text-ink-soft leading-relaxed mt-9 max-w-md mx-auto" style={{ fontSize: "1.0625rem" }}>
          This link was configured for a specific recipient.
        </p>
        <p className="lk-lede text-ink-soft leading-relaxed max-w-md mx-auto" style={{ fontSize: "1.0625rem" }}>
          Please use the personalized URL provided to you.
        </p>

        <div className="lk-meta mt-14 flex items-center justify-center gap-4">
          <span className="inline-block w-8 h-px" style={{ backgroundColor: "rgba(33,28,23,0.2)" }} />
          <span className="kicker" style={{ color: "rgba(107,98,88,0.7)" }}>Personalized link required</span>
          <span className="inline-block w-8 h-px" style={{ backgroundColor: "rgba(33,28,23,0.2)" }} />
        </div>
      </div>
    </div>
  );
}
