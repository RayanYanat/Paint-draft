"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitWords from "@/components/shared/SplitWords";
import type { CompanyData } from "@/lib/types";

const STATS = [
  { value: 14,   decimals: 0, suffix: "+",  label: "Years in business" },
  { value: 2500, decimals: 0, suffix: "+",  label: "Projects completed" },
  { value: 5.0,  decimals: 1, suffix: " ★", label: "Average rating" },
  { value: 24,   decimals: 0, suffix: "h",  label: "Response time" },
];

const fmt = (v: number, decimals: number) =>
  decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-US");

export default function StatsSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const nums = Array.from(ref.current!.querySelectorAll<HTMLElement>(".stat-num"));

      if (reduce) {
        nums.forEach((el, i) => (el.textContent = fmt(STATS[i].value, STATS[i].decimals)));
        gsap.set(".stat-item, .stats-phrase .split-word", { opacity: 1, clearProps: "transform" });
        return;
      }

      nums.forEach((el, i) => (el.textContent = fmt(0, STATS[i].decimals)));
      gsap.set(".stat-item", { opacity: 0, y: 20 });
      gsap.set(".stats-phrase .split-word", { yPercent: 110 });

      ScrollTrigger.create({
        trigger: ref.current, start: "top 75%", once: true,
        onEnter: () => {
          gsap.to(".stat-item", { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" });
          gsap.to(".stats-phrase .split-word", { yPercent: 0, duration: 0.7, stagger: 0.04, ease: "power4.out", delay: 0.25 });
          STATS.forEach((s, i) => {
            const el = nums[i];
            if (!el) return;
            const o = { v: 0 };
            gsap.to(o, {
              v: s.value, duration: 2, ease: "power2.out", delay: 0.15 + i * 0.1,
              onUpdate: () => { el.textContent = fmt(o.v, s.decimals); },
            });
          });
        },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="stats" className="section-pad" style={{ backgroundColor: "#211C17" }}>
      <div className="max-w-[92rem] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-12 lg:mb-16">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="flex items-baseline" style={{ color: "#F4F0E8" }}>
                <span className="stat-num font-display font-medium" style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", lineHeight: 1 }}>0</span>
                <span className="font-display" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>{s.suffix}</span>
              </div>
              <p className="kicker mt-3" style={{ color: "rgba(244,240,232,0.5)" }}>{s.label}</p>
            </div>
          ))}
        </div>
        <p className="stats-phrase font-display italic" style={{ fontSize: "clamp(1.3rem, 3vw, 2.2rem)", color: "rgba(244,240,232,0.72)", maxWidth: "42rem", lineHeight: 1.2 }}>
          <SplitWords text={`Fourteen years of clean lines across ${company.zone}.`} />
        </p>
      </div>
    </section>
  );
}
