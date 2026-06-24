import { notFound }   from "next/navigation";
import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import { cleanText } from "@/lib/utils";
import type { CompanyData } from "@/lib/types";

import VisitTracker    from "@/components/shared/VisitTracker";
import ConceptBanner   from "@/components/shared/ConceptBanner";
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
import EstimateSection from "@/sections/EstimateSection";

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
    .select("slug, name, city, phone, email, address, opening_hours, category")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  const row = data as Omit<CompanyData, "zone">;

  // Scraped lead data is uneven — a row may be missing its city, or (rarely)
  // its name. Fall back gracefully so a personalized draft never renders a
  // broken token like "Painters in " or "across  & surrounding areas".
  const cleanCity = cleanText(row.city);
  const city = cleanCity || "your area";
  return {
    slug:          cleanText(row.slug),
    name:          cleanText(row.name) || "Our Painting Studio",
    city,
    phone:         cleanText(row.phone),
    email:         cleanText(row.email),
    address:       cleanText(row.address),
    opening_hours: cleanText(row.opening_hours),
    category:      row.category ?? null,
    zone:          cleanCity ? `${cleanCity} & surrounding areas` : "your area",
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

  // Personalized drafts carry a prospect's brand name — keep them out of
  // search indexes (still lets social crawlers read the link unfurl).
  const robots = { index: false, follow: false };

  if (!company) {
    return {
      title:       "Professional Painting Contractor",
      description: "Interior & exterior house painting, cabinet refinishing, and color consultation. Free estimates.",
      robots,
    };
  }

  const callLine = company.phone ? ` Call ${company.phone}.` : "";
  return {
    title:       `${company.name} — Painters in ${company.city}`,
    description: `${company.name} — interior & exterior house painting, cabinet refinishing, and color consultation in ${company.city}. Free estimates.${callLine}`,
    robots,
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
        <EstimateSection company={company} />
        <Footer          company={company} />
      </main>

      <ConceptBanner name={company.name} />
    </>
  );
}
