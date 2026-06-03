"use client";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Phone } from "lucide-react";
import BeforeAfter from "@/components/shared/BeforeAfter";
import SplitWords from "@/components/shared/SplitWords";
import MagneticButton from "@/components/shared/MagneticButton";
import type { CompanyData } from "@/lib/types";

const HERO_AFTER  = "/hero-after.webp";   // same house, freshly painted blue
const HERO_BEFORE = "/hero-before.webp";  // same house, faded/unpainted — true matched pair

export default function HeroSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null); // slider — moves opposite cursor
  const layer2Ref = useRef<HTMLDivElement>(null); // text — moves with cursor

  /* Opening sequence — image in, name rises word-by-word, then chrome */
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(".mh-stage, .mh-kicker, .mh-sub, .mh-cta, .mh-scroll, .hero-name .split-word",
          { opacity: 1, clearProps: "transform" });
        return;
      }

      gsap.set(".mh-stage",  { opacity: 0, scale: 1.05, transformOrigin: "center center" });
      gsap.set(".mh-kicker", { opacity: 0, y: 12 });
      gsap.set(".hero-name .split-word", { yPercent: 110 });
      gsap.set(".mh-sub",    { opacity: 0 });
      gsap.set(".mh-cta",    { opacity: 0, y: 16 });
      gsap.set(".mh-scroll", { opacity: 0 });

      // Hold the opener until BOTH hero photos are decoded — otherwise the
      // before/after flashes the vibrant "after" through the not-yet-painted
      // "before" for a beat. Fallback timer so a stalled decode never blocks it.
      let played = false;
      const play = () => {
        if (played || !ref.current) return;
        played = true;
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(".mh-stage",  { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" })
          .to(".mh-kicker", { opacity: 1, y: 0, duration: 0.5 }, "-=0.5")
          .to(".hero-name .split-word", { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "power4.out" }, "-=0.25")
          .to(".mh-sub",    { opacity: 1, duration: 0.6 }, "-=0.4")
          .to(".mh-cta",    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.3")
          .to(".mh-scroll", { opacity: 1, duration: 0.6 }, "-=0.1");
      };

      Promise.all(
        [HERO_AFTER, HERO_BEFORE].map((s) => {
          const img = new window.Image();
          img.src = s;
          return img.decode().catch(() => {});
        })
      ).then(play);
      gsap.delayedCall(0.8, play);
    },
    { scope: ref }
  );

  /* Mouse parallax — desktop, fine pointers only */
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      gsap.to(layer1Ref.current, { x: dx * -12, y: dy * -8, duration: 2,   ease: "power2.out" });
      gsap.to(layer2Ref.current, { x: dx * 5,   y: dy * 3,  duration: 1.6, ease: "power2.out" });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={ref} className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: "600px" }}>

      {/* Layer 1 — full-bleed before/after + warm glow */}
      <div ref={layer1Ref} className="mh-stage absolute inset-0 will-change-transform">
        <BeforeAfter
          src={HERO_AFTER}
          beforeSrc={HERO_BEFORE}
          alt={`${company.name} — interior transformation in ${company.city}`}
          overlay
          priority
          sweepFrom={75}
          sweepTo={35}
          sizes="100vw"
          className="w-full h-full"
        />
        <div
          aria-hidden
          className="absolute pointer-events-none hero-glow-anim"
          style={{
            left: "50%", top: "62%", width: "760px", height: "520px",
            background: "radial-gradient(ellipse at center, rgba(176,85,47,0.85) 0%, rgba(176,85,47,0.3) 40%, transparent 72%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Layer 2 — text, anchored bottom, over the slider */}
      <div ref={layer2Ref} className="absolute inset-x-0 bottom-0 z-20 will-change-transform pointer-events-none">
        <div className="max-w-[92rem] mx-auto px-5 lg:px-10 pb-14 lg:pb-20">
          <span className="mh-kicker kicker block mb-5" style={{ color: "rgba(255,255,255,0.72)" }}>
            Painting Atelier · {company.city}
          </span>
          <h1 className="hero-name font-display font-extrabold text-white"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", lineHeight: 0.98, letterSpacing: "-0.02em" }}>
            <SplitWords text={company.name} />
          </h1>
          <p className="mh-sub font-display italic mt-3" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)", color: "rgba(255,255,255,0.82)" }}>
            Interior &amp; exterior painting in {company.city}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-8 pointer-events-auto">
            <MagneticButton
              href="#contact"
              className="mh-cta inline-flex items-center px-8 py-4 text-sm font-medium tracking-wide rounded-sm backdrop-blur-sm transition-colors duration-300"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.25)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.15)")}
            >
              Request an estimate
            </MagneticButton>
            {company.phone && (
              <a href={`tel:${company.phone}`}
                className="mh-cta inline-flex items-center gap-2 text-sm text-white link-underline">
                <Phone size={15} />
                {company.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mh-scroll absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
        <span className="kicker" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.6rem" }}>Scroll</span>
        <div className="w-px h-8 overflow-hidden">
          <div className="w-px h-full" style={{ backgroundColor: "rgba(255,255,255,0.45)", animation: "scroll-line 1.8s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}
