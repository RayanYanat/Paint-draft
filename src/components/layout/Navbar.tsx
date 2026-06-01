"use client";
import { useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import type { CompanyData } from "@/lib/types";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar({ company }: { company: CompanyData }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo / Company name */}
          <a href="#" className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold text-foreground tracking-tight">
              {company.name}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            {company.phone && (
              <a
                href={`tel:${company.phone}`}
                className="flex items-center gap-2 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
              >
                <Phone className="size-4" />
                {company.phone}
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="lg:hidden pb-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-white/50 hover:text-white transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
            {company.phone && (
              <a
                href={`tel:${company.phone}`}
                className="flex items-center gap-2 text-sm font-medium text-brand pt-2"
              >
                <Phone className="size-4" />
                {company.phone}
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
