"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Phone, ChevronDown } from "lucide-react";
import type { CompanyData } from "@/lib/types";

export default function HeroSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.set(".hero-badge",      { opacity: 0, y: 14 });
    gsap.set(".hero-title-1",    { opacity: 1, clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(".hero-title-2",    { opacity: 1, clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(".hero-divider",    { opacity: 0, scaleX: 0 });
    gsap.set(".hero-sub",        { opacity: 0, y: 14 });
    gsap.set(".hero-cta",        { opacity: 0, y: 14 });
    gsap.set(".hero-scroll",     { opacity: 0 });
    gsap.set(".hero-data-strip", { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".hero-badge",      { opacity: 1, y: 0, duration: 0.6 })
      .to(".hero-title-1",    { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.out" }, "-=0.2")
      .to(".hero-title-2",    { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.out" }, "-=0.65")
      .to(".hero-divider",    { opacity: 1, scaleX: 1, duration: 0.8, ease: "expo.out" }, "-=0.4")
      .to(".hero-sub",        { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      .to(".hero-cta",        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.2")
      .to(".hero-scroll",     { opacity: 1, duration: 0.5 }, "-=0.1")
      .to(".hero-data-strip", { opacity: 1, duration: 0.5 }, "-=0.3");
  }, { scope: ref });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(99,164,255,0.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2 mb-8">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping bg-brand" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          <span className="font-data text-[10px] tracking-[0.25em] uppercase text-brand/60">
            Professional Painting Services
          </span>
        </div>

        {/* Title */}
        <div className="overflow-hidden">
          <h1
            className="hero-title-1 font-heading font-extrabold text-white"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", lineHeight: 0.95 }}
          >
            {company.name}
          </h1>
        </div>
        <div className="overflow-hidden mb-8">
          <h2
            className="hero-title-2 font-heading font-bold text-brand"
            style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)", lineHeight: 1.2 }}
          >
            Interior &amp; Exterior Painting in {company.city}
          </h2>
        </div>

        {/* Divider */}
        <div className="hero-divider w-16 h-px bg-brand mx-auto mb-8 origin-left" />

        {/* Subtitle */}
        <p className="hero-sub text-base sm:text-lg text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
          Transforming homes and businesses in {company.zone} with precision,
          quality materials, and expert craftsmanship. Licensed, insured, and
          committed to your satisfaction.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#contact"
            className="hero-cta inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-background font-medium text-sm hover:bg-brand/90 transition-colors"
          >
            Get a Free Estimate
          </a>
          {company.phone && (
            <a
              href={`tel:${company.phone}`}
              className="hero-cta inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-subtle text-white/70 font-medium text-sm hover:text-white hover:border-white/20 transition-colors"
            >
              <Phone className="size-4" />
              {company.phone}
            </a>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll flex flex-col items-center gap-2 text-white/20">
          <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
          <ChevronDown className="size-4 animate-bounce" />
        </div>
      </div>

      {/* Data strip */}
      <div className="hero-data-strip absolute bottom-0 left-0 right-0 border-t border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <span className="font-data text-[10px] text-white/20 tracking-wider uppercase">
            {company.city}
          </span>
          <span className="font-data text-[10px] text-white/20 tracking-wider uppercase">
            Licensed & Insured
          </span>
          <span className="font-data text-[10px] text-white/20 tracking-wider uppercase">
            Free Estimates
          </span>
        </div>
      </div>
    </section>
  );
}
