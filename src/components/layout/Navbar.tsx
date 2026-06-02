"use client";
import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import MagneticButton from "@/components/shared/MagneticButton";
import type { CompanyData } from "@/lib/types";

export default function Navbar({ company }: { company: CompanyData }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        });
        // Highlight the topmost in-view section, or nothing over the hero/stats.
        const current = NAV_LINKS.find((l) => visible.has(l.href.slice(1)));
        setActive(current ? current.href : "");
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 }
    );
    NAV_LINKS.forEach((l) => {
      const el = document.getElementById(l.href.slice(1));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* Over the dark full-bleed hero (not scrolled) → white. Scrolled → paper + ink. */
  const onDark      = !scrolled;
  const strong      = onDark ? "#FFFFFF" : "#211C17";
  const soft        = onDark ? "rgba(255,255,255,0.78)" : "#6B6258";
  const SIENNA      = "#B0552F";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor:      scrolled ? "rgba(244,240,232,0.88)" : "transparent",
        backdropFilter:       scrolled ? "blur(10px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom:         scrolled ? "1px solid rgba(33,28,23,0.12)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[92rem] mx-auto px-5 lg:px-10 h-[68px] lg:h-[76px] flex items-center justify-between gap-8">

        {/* Wordmark */}
        <a href="#" className="font-display font-semibold leading-none truncate min-w-0 max-w-[55%] lg:max-w-[26rem] transition-colors duration-300"
          style={{ fontSize: "1.3rem", letterSpacing: "-0.01em", color: strong }}>
          {company.name}
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((l) => {
            const on = active === l.href;
            return (
              <a key={l.href} href={l.href}
                className="text-sm transition-colors duration-200"
                style={{ color: on ? SIENNA : soft }}
                onMouseEnter={(e) => { if (!on) (e.currentTarget as HTMLElement).style.color = strong; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = on ? SIENNA : soft; }}>
                {l.label}
              </a>
            );
          })}
        </nav>

        {/* Right */}
        <div className="hidden lg:flex items-center gap-6">
          {company.phone && (
            <a href={`tel:${company.phone}`} className="flex items-center gap-2 text-sm link-underline transition-colors duration-300"
              style={{ color: strong }}>
              <Phone size={14} style={{ color: SIENNA }} />
              {company.phone}
            </a>
          )}
          <MagneticButton href="#contact"
            className="cta-breathe px-5 py-2.5 text-sm font-medium rounded-sm transition-colors duration-300"
            style={
              scrolled
                ? { backgroundColor: SIENNA, color: "#F7F4EE", border: "1px solid transparent" }
                : { backgroundColor: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(4px)" }
            }
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = scrolled ? "#8A3F22" : "rgba(255,255,255,0.22)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = scrolled ? SIENNA : "rgba(255,255,255,0.12)")}>
            Request an estimate
          </MagneticButton>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center gap-4">
          {company.phone && (
            <a href={`tel:${company.phone}`} style={{ color: SIENNA }} aria-label="Call us"><Phone size={18} /></a>
          )}
          <button onClick={() => setMenuOpen((v) => !v)} style={{ color: strong }} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden px-5 py-6 flex flex-col gap-5"
          style={{ backgroundColor: "rgba(244,240,232,0.98)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(33,28,23,0.12)" }}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="font-display text-2xl text-ink">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)}
            className="mt-2 px-5 py-3 text-sm font-medium rounded-sm text-center"
            style={{ backgroundColor: SIENNA, color: "#F7F4EE" }}>
            Request an estimate
          </a>
        </div>
      )}
    </header>
  );
}
