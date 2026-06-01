"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { CompanyData } from "@/lib/types";

const PROJECTS = [
  {
    title: "Living Room Transformation",
    type: "Interior",
    image: "https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=600&h=400&fit=crop",
  },
  {
    title: "Full Exterior Repaint",
    type: "Exterior",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  },
  {
    title: "Kitchen Cabinet Refinish",
    type: "Cabinets",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
  {
    title: "Office Space Refresh",
    type: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
  },
];

export default function WorkSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".work-card", {
      scrollTrigger: {
        trigger: ref.current,
        start: "top 75%",
      },
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, { scope: ref });

  return (
    <section ref={ref} id="work" className="section-padding bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-data text-[10px] tracking-[0.3em] uppercase text-brand/50 block mb-4">
            Our Work
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Recent Projects
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm sm:text-base">
            A selection of recent painting projects completed in {company.zone}.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PROJECTS.map((project) => (
            <div
              key={project.title}
              className="work-card group relative overflow-hidden rounded-xl border border-subtle"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="font-data text-[10px] tracking-[0.2em] uppercase text-brand/70 block mb-1">
                  {project.type}
                </span>
                <h3 className="font-heading text-lg font-bold text-white">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
