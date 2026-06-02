"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import SplitWords from "@/components/shared/SplitWords";
import type { CompanyData } from "@/lib/types";

export default function ServicesSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(".svc-head, .svc-art, .svc-row", { opacity: 1, clearProps: "transform,clipPath,scale" });
        gsap.set(".svc-head .split-word", { yPercent: 0 });
        return;
      }

      gsap.set(".svc-head", { opacity: 0 });
      gsap.set(".svc-head .split-word", { yPercent: 100 });
      // #7 — sticky art scales in; index rows wipe in from the bottom edge
      gsap.set(".svc-art",  { opacity: 0, scale: 1.08, transformOrigin: "center center" });
      gsap.set(".svc-row",  { opacity: 0, clipPath: "inset(100% 0 0 0)" });

      ScrollTrigger.create({
        trigger: ref.current, start: "top 72%", once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".svc-head", { opacity: 1, duration: 0.5 })
            .to(".svc-head .split-word", { yPercent: 0, duration: 0.7, stagger: 0.04, ease: "power4.out" }, "-=0.2")
            .to(".svc-art",  { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }, "-=0.5")
            .to(".svc-row",  { opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.6, stagger: 0.06 }, "-=0.6");
        },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="services" className="section-pad bg-paper">
      <div className="max-w-[92rem] mx-auto px-5 lg:px-10">

        {/* Header */}
        <div className="svc-head max-w-2xl mb-14 lg:mb-20">
          <span className="kicker block mb-5">Services</span>
          <h2 className="font-display text-ink font-medium mb-5"
            style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.8rem)", lineHeight: 1.04 }}>
            <SplitWords text="Everything we touch," />
            <br /><span className="italic"><SplitWords text="finished by hand." /></span>
          </h2>
          <p className="text-ink-soft leading-relaxed" style={{ fontSize: "1.0625rem" }}>
            Six services, one standard. From a single accent wall to a full
            exterior, the same crew sees it through across {company.zone}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">

          {/* Index list */}
          <div className="border-t border-line">
            {SERVICES.map((s, i) => {
              const on = active === i;
              return (
                <a
                  key={s.num}
                  href="#contact"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="svc-row group block border-b border-line py-7 lg:py-8 transition-colors duration-300"
                >
                  {/* Mobile image */}
                  <div className="lg:hidden relative w-full aspect-[16/10] rounded-sm overflow-hidden mb-5 frame-shadow">
                    <Image src={s.img} alt={s.title} fill sizes="100vw" className="object-cover" />
                  </div>

                  <div className="flex items-baseline gap-5 lg:gap-7">
                    <span className="font-display text-sm tabular-nums pt-1 transition-colors duration-300"
                      style={{ color: on ? "#B0552F" : "#6B6258" }}>
                      {s.num}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-display font-medium transition-colors duration-300"
                          style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.15rem)", lineHeight: 1.1, color: on ? "#B0552F" : "#211C17" }}>
                          {s.title}
                        </h3>
                        <ArrowUpRight size={20} className="flex-shrink-0 transition-all duration-300"
                          style={{ color: "#B0552F", opacity: on ? 1 : 0, transform: on ? "none" : "translate(-6px,6px)" }} />
                      </div>
                      <p className="text-ink-soft leading-relaxed mt-2 max-w-md" style={{ fontSize: "0.95rem" }}>
                        {s.blurb}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Sticky image (desktop) */}
          <div className="hidden lg:block">
            <div className="svc-art sticky top-28 relative w-full aspect-[4/5] rounded-sm overflow-hidden bg-paper-deep frame-shadow">
              {SERVICES.map((s, i) => (
                <Image
                  key={s.num}
                  src={s.img}
                  alt={s.title}
                  fill
                  sizes="46vw"
                  className="object-cover transition-opacity duration-700 ease-out"
                  style={{ opacity: active === i ? 1 : 0 }}
                />
              ))}
              <div className="absolute bottom-4 left-4 z-10">
                <span className="kicker px-2.5 py-1 rounded-sm"
                  style={{ backgroundColor: "rgba(244,240,232,0.85)", color: "#211C17" }}>
                  {SERVICES[active].title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
