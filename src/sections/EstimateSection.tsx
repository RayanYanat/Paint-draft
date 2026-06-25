"use client";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Clock, FileText, CalendarDays } from "lucide-react";
import type { CompanyData } from "@/lib/types";
import { getTemplateNiche } from "@/lib/niche";
import EstimateForm from "@/components/conversion/EstimateForm";
import BookingEmbed from "@/components/conversion/BookingEmbed";

const SIENNA = "#B0552F";
const INK = "#211C17";
const INK_SOFT = "#6B6258";
const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "your-cal-username/estimate";

export default function EstimateSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);
  const niche = getTemplateNiche();
  const [tab, setTab] = useState<"form" | "booking">("form");

  /* Open the booking tab when a "#book" CTA is used. The smooth-scroll handler
     preventDefaults anchor clicks (so the hash never changes) — so we listen to
     BOTH the hash (direct URL) and clicks on any #book link (the hero/CTA). */
  useEffect(() => {
    const openBooking = () => setTab("booking");
    const onHash = () => { if (window.location.hash === "#book") openBooking(); };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.('a[href="#book"]')) openBooking();
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

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
      if (reduce) { gsap.set(".est-left, .est-card", { opacity: 1, y: 0 }); return; }
      gsap.set(".est-left", { opacity: 0, y: 18 });
      gsap.set(".est-card", { opacity: 0, y: 22 });
      ScrollTrigger.create({
        trigger: ref.current, start: "top 78%", once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(".est-left", { opacity: 1, y: 0, duration: 0.6 })
            .to(".est-card", { opacity: 1, y: 0, duration: 0.6 }, "-=0.35");
        },
      });
    },
    { scope: ref }
  );

  const TabButton = ({ id, icon: Icon, label }: { id: "form" | "booking"; icon: typeof FileText; label: string }) => {
    const active = tab === id;
    return (
      <button onClick={() => setTab(id)}
        className="inline-flex items-center gap-2.5 px-5 py-3 rounded-sm text-sm font-medium transition-all duration-200"
        style={{
          backgroundColor: active ? SIENNA : "#FBF9F4",
          color: active ? "#F7F4EE" : INK_SOFT,
          border: `1px solid ${active ? SIENNA : "rgba(33,28,23,0.16)"}`,
        }}>
        <Icon size={17} /> {label}
      </button>
    );
  };

  return (
    <section ref={ref} id="contact" className="relative section-pad bg-paper-deep">
      <span id="book" className="absolute" style={{ top: 0 }} aria-hidden />
      <div id="estimate" className="max-w-[92rem] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Invitation + details */}
          <div className="est-left">
            <span className="kicker block mb-5">{niche.form.eyebrow}</span>
            <h2 className="font-display font-medium mb-6" style={{ color: INK, fontSize: "clamp(2.2rem, 5vw, 4.2rem)", lineHeight: 1.02 }}>
              Let&apos;s talk about <span className="italic">your space.</span>
            </h2>
            <p className="leading-relaxed max-w-md mb-10" style={{ color: INK_SOFT, fontSize: "1.0625rem" }}>
              {niche.form.subtitle}
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

            <p className="kicker mt-8" style={{ color: SIENNA }}>{niche.aside.badge}</p>
          </div>

          {/* Conversion card with tabs */}
          <div className="est-card">
            <div className="flex gap-2.5 mb-6">
              <TabButton id="form" icon={FileText} label="Request an estimate" />
              <TabButton id="booking" icon={CalendarDays} label="Book a visit" />
            </div>

            <div className="p-6 lg:p-8 rounded-sm bg-paper-card border border-line">
              {tab === "form" ? (
                <EstimateForm form={niche.form} />
              ) : (
                <div>
                  <h3 className="font-display font-medium leading-tight mb-1.5" style={{ color: INK, fontSize: "clamp(1.4rem,3vw,1.8rem)" }}>
                    {niche.booking.title}
                  </h3>
                  <p className="leading-relaxed mb-6 max-w-md" style={{ color: INK_SOFT, fontSize: "0.95rem" }}>
                    {niche.booking.subtitle}
                  </p>
                  <BookingEmbed calLink={CAL_LINK} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
