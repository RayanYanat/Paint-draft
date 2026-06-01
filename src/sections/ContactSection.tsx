"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { CompanyData } from "@/lib/types";

export default function ContactSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".contact-block", {
      scrollTrigger: {
        trigger: ref.current,
        start: "top 75%",
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: ref });

  return (
    <section ref={ref} id="contact" className="section-padding bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-data text-[10px] tracking-[0.3em] uppercase text-brand/50 block mb-4">
            Get In Touch
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Free Estimate
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm sm:text-base">
            Ready to transform your space? Contact us today for a free,
            no-obligation estimate.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {company.phone && (
            <a
              href={`tel:${company.phone}`}
              className="contact-block flex items-center gap-4 p-5 rounded-xl border border-subtle bg-background hover:border-brand/20 transition-colors"
            >
              <div className="p-3 rounded-lg bg-brand/10">
                <Phone className="size-5 text-brand" />
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Call Us</p>
                <p className="text-sm font-medium text-white">{company.phone}</p>
              </div>
            </a>
          )}

          {company.email && (
            <a
              href={`mailto:${company.email}`}
              className="contact-block flex items-center gap-4 p-5 rounded-xl border border-subtle bg-background hover:border-brand/20 transition-colors"
            >
              <div className="p-3 rounded-lg bg-brand/10">
                <Mail className="size-5 text-brand" />
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Email Us</p>
                <p className="text-sm font-medium text-white">{company.email}</p>
              </div>
            </a>
          )}

          {company.address && (
            <div className="contact-block flex items-center gap-4 p-5 rounded-xl border border-subtle bg-background">
              <div className="p-3 rounded-lg bg-brand/10">
                <MapPin className="size-5 text-brand" />
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Location</p>
                <p className="text-sm font-medium text-white">{company.address}</p>
              </div>
            </div>
          )}

          <div className="contact-block flex items-center gap-4 p-5 rounded-xl border border-subtle bg-background">
            <div className="p-3 rounded-lg bg-brand/10">
              <Clock className="size-5 text-brand" />
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Service Area</p>
              <p className="text-sm font-medium text-white">{company.zone}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          {company.phone && (
            <a
              href={`tel:${company.phone}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-brand text-background font-medium text-sm hover:bg-brand/90 transition-colors"
            >
              <Phone className="size-4" />
              Call for a Free Estimate
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
