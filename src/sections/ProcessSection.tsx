"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { PROCESS } from "@/lib/constants";
import SplitWords from "@/components/shared/SplitWords";

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(".proc-head, .proc-step, .proc-num", { opacity: 1, scale: 1, clearProps: "transform" });
        gsap.set(".proc-head .split-word", { yPercent: 0 });
        gsap.set(".proc-rail, .proc-line", { scaleX: 1 });
        gsap.set(".proc-dot", { scale: 1, yPercent: -50 });
        return;
      }

      gsap.set(".proc-head", { opacity: 0 });
      gsap.set(".proc-head .split-word", { yPercent: 100 });
      gsap.set(".proc-step", { opacity: 0, y: 24 });
      // #7 — the big numbers pop in with a little overshoot
      gsap.set(".proc-num", { opacity: 0, scale: 0, transformOrigin: "left center" });
      gsap.set(".proc-line", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".proc-dot",  { scale: 0, yPercent: -50 });

      // The desktop rail draws continuously, tied to scroll position — a quiet
      // "process unfolding" that gives the section the life the rest of the page has.
      gsap.set(".proc-rail", { scaleX: 0, transformOrigin: "left center" });
      gsap.to(".proc-rail", {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 80%", end: "top 32%", scrub: 0.6 },
      });

      // Content + per-step lines/dots reveal once on enter.
      ScrollTrigger.create({
        trigger: ref.current, start: "top 75%", once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".proc-head", { opacity: 1, duration: 0.5 })
            .to(".proc-head .split-word", { yPercent: 0, duration: 0.7, stagger: 0.04, ease: "power4.out" }, "-=0.2")
            .to(".proc-step", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, clearProps: "transform" }, "-=0.3")
            .to(".proc-line", { scaleX: 1, duration: 0.7, stagger: 0.1, ease: "power2.out" }, "-=0.5")
            .to(".proc-dot",  { scale: 1, duration: 0.45, stagger: 0.1, ease: "back.out(2)" }, "-=0.6")
            .to(".proc-num",  { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.4)" }, "-=0.55");
        },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="process" className="section-pad bg-paper-deep">
      <div className="max-w-[92rem] mx-auto px-5 lg:px-10">

        {/* Header */}
        <div className="proc-head flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 lg:mb-20">
          <div className="max-w-xl">
            <span className="kicker block mb-5">The Process</span>
            <h2 className="font-display text-ink font-medium"
              style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.8rem)", lineHeight: 1.04 }}>
              <SplitWords text="No surprises," />
              <br /><span className="italic"><SplitWords text="just a clean finish." /></span>
            </h2>
          </div>
          <p className="text-ink-soft leading-relaxed max-w-xs lg:text-right" style={{ fontSize: "0.95rem" }}>
            Five steps from first walk-through to the moment you sign off. Same
            crew, start to finish.
          </p>
        </div>

        {/* Steps — stations on a rail that draws as you scroll */}
        <div className="relative">
          {/* Continuous rail across the desktop row */}
          <div aria-hidden className="proc-rail hidden lg:block absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(to right, rgba(176,85,47,0.6) 0%, rgba(176,85,47,0.14) 100%)" }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-12">
            {PROCESS.map((step) => (
              <div key={step.num}
                className="proc-step group relative pt-5 transition-transform duration-300 hover:-translate-y-1">
                {/* Per-step line for stacked / two-column layouts */}
                <span aria-hidden className="proc-line lg:hidden absolute top-0 left-0 h-px w-full pointer-events-none"
                  style={{ background: "linear-gradient(to right, rgba(176,85,47,0.5) 0%, rgba(176,85,47,0.1) 100%)" }} />
                {/* Node on the rail */}
                <span aria-hidden className="proc-dot absolute top-0 left-0 w-2 h-2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{ backgroundColor: "#B0552F", boxShadow: "0 0 0 4px var(--paper-deep)" }} />

                <span className="proc-num font-display block mb-4 text-[#B0552F] group-hover:text-[#8A3F22] transition-colors duration-300"
                  style={{ fontSize: "2.6rem", lineHeight: 1 }}>
                  {step.num}
                </span>
                <h3 className="font-display text-ink font-medium mb-2" style={{ fontSize: "1.25rem" }}>
                  {step.title}
                </h3>
                <p className="text-ink-soft leading-relaxed" style={{ fontSize: "0.9rem" }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
