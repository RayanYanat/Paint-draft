"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { REVIEWS } from "@/lib/constants";
import type { CompanyData } from "@/lib/types";

export default function ReviewsSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);
  const [featured, ...rest] = REVIEWS;

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(".rev-top, .rev-mark, .rev-text, .rev-attr", { opacity: 1, clearProps: "transform,clipPath,scale" });
        return;
      }

      gsap.set(".rev-top",  { opacity: 0, y: 20 });
      gsap.set(".rev-mark", { opacity: 0, scale: 0, transformOrigin: "center bottom" });
      gsap.set(".rev-text", { opacity: 0, clipPath: "inset(0 0 100% 0)" });
      gsap.set(".rev-attr", { opacity: 0, y: 10 });

      ScrollTrigger.create({
        trigger: ref.current, start: "top 75%", once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".rev-top",  { opacity: 1, y: 0, duration: 0.7 })
            .to(".rev-mark", { opacity: 1, scale: 1, duration: 0.4, stagger: 0.18, ease: "back.out(1.6)" }, "-=0.3")
            .to(".rev-text", { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.7, stagger: 0.18 }, "-=0.85")
            .to(".rev-attr", { opacity: 1, y: 0, duration: 0.5, stagger: 0.18 }, "-=0.7");
        },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="reviews" className="section-pad bg-paper fade-to-deep">
      <div className="max-w-[92rem] mx-auto px-5 lg:px-10">

        {/* Top */}
        <div className="rev-top text-center mb-14 lg:mb-20">
          <span className="kicker block mb-5">Kind Words</span>
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} style={{ color: "#B0552F", fill: "#B0552F" }} />
            ))}
          </div>
          <p className="kicker" style={{ color: "rgba(107,98,88,0.8)" }}>Rated 5.0 — based on 120+ reviews</p>
        </div>

        {/* Featured review — full width, large */}
        <div className="rev-feature relative max-w-4xl mx-auto text-center mb-16 lg:mb-24">
          <span className="rev-mark block font-display" aria-hidden
            style={{ fontSize: "clamp(5rem, 12vw, 10rem)", lineHeight: 0.5, color: "rgba(176,85,47,0.2)" }}>
            &ldquo;
          </span>
          <blockquote className="rev-text font-display italic text-ink -mt-3 lg:-mt-6"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", lineHeight: 1.22 }}>
            {featured.quote}
          </blockquote>
          <div className="rev-attr mt-7 flex flex-col items-center gap-1">
            <span className="font-display not-italic text-ink" style={{ fontSize: "1.1rem" }}>{featured.name}</span>
            <span className="kicker" style={{ color: "rgba(107,98,88,0.8)" }}>{featured.project} · {company.city}</span>
          </div>
        </div>

        {/* Reviews 2 & 3 — side by side with a divider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {rest.map((r, idx) => (
            <div key={r.name} className={`rev-quote ${idx === 1 ? "md:pl-12 md:border-l border-line" : "md:pr-12"}`}>
              <span className="rev-mark block font-display mb-1" aria-hidden
                style={{ fontSize: "3rem", lineHeight: 0.5, color: "rgba(176,85,47,0.25)" }}>
                &ldquo;
              </span>
              <blockquote className="rev-text font-display italic text-ink"
                style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.9rem)", lineHeight: 1.3 }}>
                {r.quote}
              </blockquote>
              <div className="rev-attr mt-5">
                <span className="font-display not-italic text-ink block" style={{ fontSize: "1rem" }}>{r.name}</span>
                <span className="kicker" style={{ color: "rgba(107,98,88,0.8)" }}>{r.project} · {company.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
