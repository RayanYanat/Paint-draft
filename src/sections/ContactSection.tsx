"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import SplitWords from "@/components/shared/SplitWords";
import type { CompanyData } from "@/lib/types";

const NEEDS = [
  { value: "",             label: "Select a project" },
  { value: "interior",     label: "Interior Painting" },
  { value: "exterior",     label: "Exterior Painting" },
  { value: "cabinets",     label: "Cabinet Refinishing" },
  { value: "color",        label: "Color Consultation" },
  { value: "commercial",   label: "Commercial Painting" },
  { value: "other",        label: "Something else" },
];

export default function ContactSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", need: "", message: "" });

  const DETAILS = [
    ...(company.phone ? [{ icon: Phone, label: "Phone", value: company.phone, href: `tel:${company.phone}` }] : []),
    ...(company.email ? [{ icon: Mail,  label: "Email", value: company.email, href: `mailto:${company.email}` }] : []),
    ...(company.address ? [{ icon: MapPin, label: "Studio", value: company.address, href: `https://maps.google.com/?q=${encodeURIComponent(company.address)}` }] : []),
    { icon: Clock, label: "Hours", value: company.opening_hours ?? "Mon–Sat, 7am–6pm", href: null },
  ];

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(".ct-left, .ct-row", { opacity: 1, clearProps: "transform" });
        gsap.set(".ct-left .split-word", { yPercent: 0 });
        return;
      }

      gsap.set(".ct-left", { opacity: 0 });
      gsap.set(".ct-left .split-word", { yPercent: 100 });
      gsap.set(".ct-row",  { opacity: 0, y: 18 });

      ScrollTrigger.create({
        trigger: ref.current, start: "top 78%", once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".ct-left", { opacity: 1, duration: 0.5 })
            .to(".ct-left .split-word", { yPercent: 0, duration: 0.7, stagger: 0.04, ease: "power4.out" }, "-=0.2")
            .to(".ct-row",  { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, "-=0.3");
        },
      });
    },
    { scope: ref }
  );

  const inputBase = {
    backgroundColor: "#FBF9F4",
    border: "1px solid rgba(33,28,23,0.16)",
    color: "#211C17",
  };
  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.borderColor = "#B0552F";
    (e.target as HTMLElement).style.boxShadow = "0 0 0 1px rgba(176,85,47,0.35)";
  };
  const onBlur = (e: React.FocusEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.borderColor = "rgba(33,28,23,0.16)";
    (e.target as HTMLElement).style.boxShadow = "none";
  };

  return (
    <section ref={ref} id="contact" className="section-pad bg-paper-deep">
      <div className="max-w-[92rem] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Invitation + details */}
          <div className="ct-left">
            <span className="kicker block mb-5">Contact</span>
            <h2 className="font-display text-ink font-medium mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)", lineHeight: 1.02 }}>
              <SplitWords text="Let's talk about" />
              <br /><span className="italic"><SplitWords text="your space." /></span>
            </h2>
            <p className="text-ink-soft leading-relaxed max-w-md mb-10" style={{ fontSize: "1.0625rem" }}>
              Tell us what you have in mind. We&apos;ll follow up within{" "}
              <span className="text-ink">24 hours</span> with a clear estimate and a
              color conversation — across {company.zone}.
            </p>

            <div className="border-t border-line">
              {DETAILS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4 py-4 border-b border-line">
                  <Icon size={16} className="text-sienna flex-shrink-0" />
                  <span className="kicker w-20 flex-shrink-0" style={{ color: "rgba(107,98,88,0.8)" }}>{label}</span>
                  {href ? (
                    <a href={href} className="text-ink link-underline" style={{ fontSize: "0.95rem" }}>{value}</a>
                  ) : (
                    <span className="text-ink" style={{ fontSize: "0.95rem" }}>{value}</span>
                  )}
                </div>
              ))}
            </div>

            <p className="kicker mt-8" style={{ color: "#B0552F" }}>
              Now booking — free estimates within 24h
            </p>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="h-full flex flex-col items-start justify-center p-10 rounded-sm bg-paper-card border border-line">
                <h3 className="font-display text-ink font-medium mb-3" style={{ fontSize: "1.9rem" }}>
                  Thank you.
                </h3>
                <p className="text-ink-soft leading-relaxed mb-6" style={{ fontSize: "1rem" }}>
                  Your request is in. We&apos;ll be in touch within 24 hours to schedule
                  your estimate and talk through colors.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: "", phone: "", need: "", message: "" }); }}
                  className="kicker text-sienna link-underline">
                  ← Send another
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                <div className="ct-row grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="kicker block mb-2.5" style={{ color: "rgba(107,98,88,0.9)" }}>Name</label>
                    <input required type="text" placeholder="Jane Smith"
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={onFocus} onBlur={onBlur}
                      className="w-full text-sm px-4 py-3.5 rounded-sm outline-none transition-all duration-200 placeholder:text-ink-soft/50"
                      style={inputBase} />
                  </div>
                  <div>
                    <label className="kicker block mb-2.5" style={{ color: "rgba(107,98,88,0.9)" }}>Phone</label>
                    <input required type="tel" placeholder="(555) 123-4567"
                      value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      onFocus={onFocus} onBlur={onBlur}
                      className="w-full text-sm px-4 py-3.5 rounded-sm outline-none transition-all duration-200 placeholder:text-ink-soft/50"
                      style={inputBase} />
                  </div>
                </div>

                <div className="ct-row">
                  <label className="kicker block mb-2.5" style={{ color: "rgba(107,98,88,0.9)" }}>Project</label>
                  <div className="relative">
                    <select required aria-label="Project" value={form.need}
                      onChange={(e) => setForm({ ...form, need: e.target.value })}
                      onFocus={onFocus} onBlur={onBlur}
                      className="w-full appearance-none text-sm px-4 py-3.5 rounded-sm outline-none cursor-pointer transition-all duration-200"
                      style={inputBase}>
                      {NEEDS.map((n) => (
                        <option key={n.value} value={n.value} disabled={n.value === ""}>{n.label}</option>
                      ))}
                    </select>
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="11" height="7" viewBox="0 0 11 7" fill="none">
                      <path d="M1 1L5.5 5.5L10 1" stroke="#B0552F" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                <div className="ct-row">
                  <label className="kicker block mb-2.5" style={{ color: "rgba(107,98,88,0.9)" }}>Details <span className="normal-case tracking-normal lowercase">(optional)</span></label>
                  <textarea rows={4}
                    placeholder="Rooms or surfaces, approximate size, timeline, color ideas…"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={onFocus} onBlur={onBlur}
                    className="w-full text-sm px-4 py-3.5 rounded-sm outline-none resize-none transition-all duration-200 placeholder:text-ink-soft/50"
                    style={inputBase} />
                </div>

                <button type="submit"
                  className="ct-row cta-breathe group inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-wide rounded-sm transition-colors duration-300"
                  style={{ backgroundColor: "#B0552F", color: "#F7F4EE" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#8A3F22")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#B0552F")}>
                  Request an estimate
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="ct-row text-ink-soft" style={{ fontSize: "0.8rem" }}>
                  No spam, no pressure — your details stay private.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
