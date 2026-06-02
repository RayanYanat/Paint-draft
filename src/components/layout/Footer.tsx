import { Phone, Mail, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import type { CompanyData } from "@/lib/types";

const CERTIFS = ["Licensed", "Insured", "EPA Lead-Safe", "5.0 ★"];

export default function Footer({ company }: { company: CompanyData }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-paper-deep border-t border-line">
      <div className="max-w-[92rem] mx-auto px-5 lg:px-10 py-16 lg:py-24">

        {/* Big wordmark + invite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-line">
          <div className="lg:col-span-7">
            <h2 className="font-display text-ink font-medium" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.02 }}>
              {company.name}
            </h2>
            <p className="font-display italic text-ink-soft mt-3" style={{ fontSize: "clamp(1.05rem, 2vw, 1.4rem)" }}>
              Painting, finished by hand — {company.zone}.
            </p>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end lg:items-end">
            <a href="#contact" className="cta-breathe inline-flex items-center px-7 py-3.5 text-sm font-medium rounded-sm"
              style={{ backgroundColor: "#B0552F", color: "#F7F4EE" }}>
              Request an estimate
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-14">
          <div>
            <p className="kicker mb-5" style={{ color: "rgba(107,98,88,0.8)" }}>Explore</p>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-ink link-underline" style={{ fontSize: "0.95rem" }}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker mb-5" style={{ color: "rgba(107,98,88,0.8)" }}>Contact</p>
            <ul className="space-y-3" style={{ fontSize: "0.95rem" }}>
              {company.phone && (
                <li><a href={`tel:${company.phone}`} className="flex items-center gap-2.5 text-ink link-underline">
                  <Phone size={13} className="text-sienna" />{company.phone}</a></li>
              )}
              {company.email && (
                <li><a href={`mailto:${company.email}`} className="flex items-center gap-2.5 text-ink link-underline">
                  <Mail size={13} className="text-sienna" />{company.email}</a></li>
              )}
              <li className="flex items-start gap-2.5 text-ink-soft">
                <MapPin size={13} className="text-sienna flex-shrink-0 mt-1" />{company.address ?? company.zone}</li>
            </ul>
          </div>
          <div>
            <p className="kicker mb-5" style={{ color: "rgba(107,98,88,0.8)" }}>Credentials</p>
            <div className="flex flex-wrap gap-2">
              {CERTIFS.map((c) => (
                <span key={c} className="text-xs px-3 py-1.5 rounded-sm border border-line text-ink-soft">{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ink-soft" style={{ fontSize: "0.8rem" }}>© {year} {company.name}. All rights reserved.</p>
          <p className="kicker" style={{ color: "rgba(107,98,88,0.7)" }}>Serving {company.zone}</p>
        </div>
      </div>
    </footer>
  );
}
