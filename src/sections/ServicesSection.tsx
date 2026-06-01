"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Paintbrush, Home, Building2, PaintBucket, Palette, SprayCan, Hammer } from "lucide-react";
import type { CompanyData } from "@/lib/types";

const SERVICES = [
  {
    icon: Home,
    title: "Interior Painting",
    desc: "Walls, ceilings, trim, and accent features. Clean lines and lasting finishes for every room.",
  },
  {
    icon: Paintbrush,
    title: "Exterior Painting",
    desc: "Siding, shutters, doors, and fascia. Weather-resistant coatings that protect and beautify.",
  },
  {
    icon: Building2,
    title: "Commercial Painting",
    desc: "Offices, retail spaces, and multi-unit properties. Minimal disruption, professional results.",
  },
  {
    icon: PaintBucket,
    title: "Cabinet Refinishing",
    desc: "Kitchen and bathroom cabinets transformed with expert prep and durable factory-quality finish.",
  },
  {
    icon: Palette,
    title: "Color Consultation",
    desc: "Free color matching and palette advice to complement your space and personal style.",
  },
  {
    icon: Hammer,
    title: "Drywall Repair",
    desc: "Patch, skim-coat, and texture matching before paint. Seamless prep for a flawless result.",
  },
];

export default function ServicesSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".svc-card", {
      scrollTrigger: {
        trigger: ref.current,
        start: "top 75%",
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: ref });

  return (
    <section ref={ref} id="services" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-data text-[10px] tracking-[0.3em] uppercase text-brand/50 block mb-4">
            What We Do
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Services
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm sm:text-base">
            Full-service painting solutions for {company.zone}. From a single
            room to an entire commercial property.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((svc) => (
            <div
              key={svc.title}
              className="svc-card group relative p-6 rounded-xl border border-subtle bg-surface hover:border-brand/20 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-brand/10">
                  <svc.icon className="size-5 text-brand" />
                </div>
                <h3 className="font-heading text-base font-semibold text-white">
                  {svc.title}
                </h3>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">
                {svc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
