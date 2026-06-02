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
        return;
      }

      gsap.set(".proc-head", { opacity: 0 });
      gsap.set(".proc-head .split-word", { yPercent: 100 });
      gsap.set(".proc-step", { opacity: 0, y: 24 });
      // #7 — the big numbers pop in with a little overshoot
      gsap.set(".proc-num", { opacity: 0, scale: 0, transformOrigin: "left center" });

      ScrollTrigger.create({
        trigger: ref.current, start: "top 75%", once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".proc-head", { opacity: 1, duration: 0.5 })
            .to(".proc-head .split-word", { yPercent: 0, duration: 0.7, stagger: 0.04, ease: "power4.out" }, "-=0.2")
            .to(".proc-step", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.3")
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

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10">
          {PROCESS.map((step) => (
            <div key={step.num} className="proc-step border-t pt-5" style={{ borderColor: "rgba(33,28,23,0.18)" }}>
              <span className="proc-num font-display block mb-4" style={{ fontSize: "2.6rem", lineHeight: 1, color: "#B0552F" }}>
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
    </section>
  );
}
