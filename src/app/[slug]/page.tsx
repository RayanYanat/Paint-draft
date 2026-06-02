import { notFound }   from "next/navigation";
import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import { cleanText } from "@/lib/utils";
import type { CompanyData } from "@/lib/types";

import VisitTracker    from "@/components/shared/VisitTracker";
import GSAPConfig      from "@/components/shared/GSAPConfig";
import PigmentCanvas   from "@/components/shared/PigmentCanvas";
import PaletteNarrative from "@/components/shared/PaletteNarrative";
import Navbar          from "@/components/layout/Navbar";
import Footer          from "@/components/layout/Footer";
import HeroSection     from "@/sections/HeroSection";
import ServicesSection from "@/sections/ServicesSection";
import StatsSection    from "@/sections/StatsSection";
import WorkSection     from "@/sections/WorkSection";
import ProcessSection  from "@/sections/ProcessSection";
import ReviewsSection  from "@/sections/ReviewsSection";
import ContactSection  from "@/sections/ContactSection";

/* ── ISR config ────────────────────────────────────────────────────────── */
export const dynamicParams = true;
export const revalidate    = 86400;

export async function generateStaticParams() {
  return [];
}

/* ── Data fetcher ─────────────────────────────────────────────────────── */
async function getCompany(slug: string): Promise<CompanyData | null> {
  const { data, error } = await getSupabase()
    .from("leads")
    .select("slug, name, city, phone, email, address, opening_hours")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  const row = data as Omit<CompanyData, "zone">;
  const city = cleanText(row.city);
  return {
    slug:          cleanText(row.slug),
    name:          cleanText(row.name),
    city,
    phone:         cleanText(row.phone),
    email:         cleanText(row.email),
    address:       cleanText(row.address),
    opening_hours: cleanText(row.opening_hours),
    zone:          `${city} & surrounding areas`,
  };
}

/* ── Dynamic metadata ─────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company  = await getCompany(slug);

  if (!company) {
    return {
      title:       "Professional Painting Contractor",
      description: "Interior & exterior house painting, cabinet refinishing, and color consultation. Free estimates.",
    };
  }

  return {
    title:       `${company.name} — Painters in ${company.city}`,
    description: `${company.name} — interior & exterior house painting, cabinet refinishing, and color consultation in ${company.city}. Free estimates. Call ${company.phone}.`,
  };
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company  = await getCompany(slug);

  if (!company) return notFound();

  return (
    <>
      <VisitTracker slug={slug} />
      <PigmentCanvas />
      <Navbar company={company} />

      <main className="relative z-[1]">
        <GSAPConfig />
        <PaletteNarrative />
        <HeroSection     company={company} />
        <ServicesSection company={company} />
        <StatsSection    company={company} />
        <WorkSection     company={company} />
        <ProcessSection />
        <ReviewsSection  company={company} />
        <ContactSection  company={company} />
        <Footer          company={company} />
      </main>
    </>
  );
}
