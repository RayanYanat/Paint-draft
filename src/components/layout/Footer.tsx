import { Phone, Mail, MapPin } from "lucide-react";
import type { CompanyData } from "@/lib/types";

export default function Footer({ company }: { company: CompanyData }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-subtle bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-3">
              {company.name}
            </h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Professional painting services for residential and commercial
              properties in {company.zone}.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-mono text-brand/60 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="space-y-2.5">
              {company.phone && (
                <a href={`tel:${company.phone}`} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                  <Phone className="size-3.5 text-brand/50" />
                  {company.phone}
                </a>
              )}
              {company.email && (
                <a href={`mailto:${company.email}`} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                  <Mail className="size-3.5 text-brand/50" />
                  {company.email}
                </a>
              )}
              {company.address && (
                <div className="flex items-start gap-2 text-sm text-white/50">
                  <MapPin className="size-3.5 text-brand/50 mt-0.5" />
                  {company.address}
                </div>
              )}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs font-mono text-brand/60 uppercase tracking-wider mb-4">
              Service Area
            </h4>
            <p className="text-sm text-white/50">
              Serving {company.zone}
            </p>
            {company.opening_hours && (
              <p className="text-sm text-white/40 mt-2">
                {company.opening_hours}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-subtle flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/25">
            &copy; {year} {company.name}. All rights reserved.
          </p>
          <p className="text-xs text-white/25">
            Licensed & Insured
          </p>
        </div>
      </div>
    </footer>
  );
}
