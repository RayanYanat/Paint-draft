"use client";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import BeforeAfter from "@/components/shared/BeforeAfter";
import SplitWords from "@/components/shared/SplitWords";
import type { CompanyData } from "@/lib/types";

const FIGS = [
  { kind: "photo", type: "Interior",            img: "/work-interior.webp", cls: "lg:col-span-7",                        aspect: "aspect-[4/3]" },
  { kind: "photo", type: "Cabinet Refinishing", img: "/work-cabinet.webp", cls: "lg:col-span-5 lg:mt-24",               aspect: "aspect-[4/5]" },
  { kind: "ba",    type: "Before / After",      img: "/work-after.webp", cls: "lg:col-span-12",                       aspect: "aspect-[16/10] sm:aspect-[2/1]" },
  { kind: "photo", type: "Supplies",            img: "/work-supplies.webp", cls: "sm:col-span-6 lg:col-span-4",        aspect: "aspect-[3/4]" },
  { kind: "photo", type: "At Work",             img: "/work-atwork.webp", cls: "sm:col-span-6 lg:col-span-4 lg:mt-16", aspect: "aspect-[3/4]" },
  { kind: "photo", type: "Exterior",            img: "/work-exterior.webp", cls: "sm:col-span-6 lg:col-span-4",        aspect: "aspect-[3/4]" },
] as const;

export default function WorkSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.set(".work-head, .work-fig", { opacity: 1, scale: 1, rotation: 0 });
        gsap.set(".work-head .split-word", { yPercent: 0 });
        return;
      }

      gsap.set(".work-head", { opacity: 0 });
      gsap.set(".work-head .split-word", { yPercent: 100 });
      // Entrance uses scale + rotationZ only — y is reserved for column parallax
      gsap.set(".work-fig", {
        opacity: 0, scale: 0.96,
        rotation: (i) => (i % 2 === 1 ? -1 : 0),
        transformOrigin: "center center",
      });

      ScrollTrigger.create({
        trigger: ref.current, start: "top 75%", once: true,
        onEnter: () => {
          gsap.timeline({ defaults: { ease: "power3.out" } })
            .to(".work-head", { opacity: 1, duration: 0.5 })
            .to(".work-head .split-word", { yPercent: 0, duration: 0.7, stagger: 0.04, ease: "power4.out" }, "-=0.2");
        },
      });

      ScrollTrigger.batch(".work-fig", {
        start: "top 88%",
        onEnter: (els) => gsap.to(els, {
          opacity: 1, scale: 1, rotation: 0,
          duration: 0.9, stagger: 0.12, ease: "power3.out",
        }),
      });

      // Bottom-row column parallax — col1 rises, col3 sinks (desktop only)
      if (window.innerWidth >= 1024) {
        const figs = gsap.utils.toArray<HTMLElement>(".work-fig");
        const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1.5 };
        if (figs[3]) gsap.to(figs[3], { y: -60, ease: "none", scrollTrigger: st });
        if (figs[5]) gsap.to(figs[5], { y: 40,  ease: "none", scrollTrigger: st });
      }
    },
    { scope: ref }
  );

  /* 3D hover tilt on photo figures — desktop / fine pointer, custom listeners */
  useEffect(() => {
    if (window.innerWidth < 1024) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tiles = Array.from(ref.current?.querySelectorAll<HTMLElement>(".work-tilt") ?? []);
    const cleanups: Array<() => void> = [];
    tiles.forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(el, { rotateY: x * 6, rotateX: -y * 6, duration: 0.6, ease: "power2.out" });
      };
      const onLeave = () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power2.out" });
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); });
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section ref={ref} id="work" className="section-pad bg-paper fade-to-deep">
      <div className="max-w-[92rem] mx-auto px-5 lg:px-10">

        {/* Header */}
        <div className="work-head flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 lg:mb-20">
          <div className="max-w-xl">
            <span className="kicker block mb-5">Selected Work</span>
            <h2 className="font-display text-ink font-medium" style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.8rem)", lineHeight: 1.04 }}>
              <SplitWords text="A few rooms we've" />
              <br /><span className="italic"><SplitWords text="stood back from." /></span>
            </h2>
          </div>
          <p className="text-ink-soft leading-relaxed max-w-xs lg:text-right" style={{ fontSize: "0.95rem" }}>
            Recent interior, exterior, and cabinet projects across {company.zone}.
            Drag the middle figure to see a transformation.
          </p>
        </div>

        {/* Editorial photo-essay grid */}
        <div className="grid grid-cols-12 gap-x-5 lg:gap-x-6 gap-y-12 lg:gap-y-24">
          {FIGS.map((f, i) => (
            <figure key={i} className={`work-fig col-span-12 ${f.cls}`} style={f.kind === "photo" ? { perspective: "800px" } : undefined}>
              {f.kind === "ba" ? (
                <BeforeAfter
                  src={f.img}
                  beforeSrc="/work-before.webp"
                  alt={`Before and after — ${company.name}, ${company.city}`}
                  className={`w-full ${f.aspect} rounded-sm frame-shadow`}
                  sizes="(max-width: 1024px) 100vw, 88rem"
                />
              ) : (
                <div className={`work-tilt group relative w-full ${f.aspect} rounded-sm overflow-hidden bg-paper-deep frame-shadow`} style={{ transformStyle: "preserve-3d" }}>
                  <Image src={f.img} alt={`${f.type} project in ${company.city}`} fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover" />
                </div>
              )}
              <figcaption className="flex items-center justify-between gap-4 mt-3">
                <span className="kicker">Fig. {String(i + 1).padStart(2, "0")} — {f.type}</span>
                <span className="kicker" style={{ color: "rgba(107,98,88,0.7)" }}>{company.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
