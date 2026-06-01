import { notFound }   from "next/navigation";
import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import type { CompanyData } from "@/lib/types";

import VisitTracker     from "@/components/shared/VisitTracker";
import GSAPConfig       from "@/components/shared/GSAPConfig";
import Navbar           from "@/components/layout/Navbar";
import Footer           from "@/components/layout/Footer";
import HeroSection      from "@/sections/HeroSection";
import ServicesSection  from "@/sections/ServicesSection";
import WorkSection      from "@/sections/WorkSection";
import ReviewsSection   from "@/sections/ReviewsSection";
import ContactSection   from "@/sections/ContactSection";

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
  return { ...row, zone: `${row.city} & surrounding areas` };
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
      description: "Licensed painting contractor. Interior & exterior. Free estimates.",
    };
  }

  return {
    title:       `${company.name} — Professional Painters in ${company.city}`,
    description: `${company.name} — Licensed painting contractor in ${company.city}. Interior & exterior residential and commercial painting. Free estimates. Call ${company.phone}.`,
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
      <Navbar company={company} />

      <main style={{ position: "relative", zIndex: 1 }}>
        <GSAPConfig />
        <HeroSection      company={company} />
        <ServicesSection  company={company} />
        <WorkSection      company={company} />
        <ReviewsSection   company={company} />
        <ContactSection   company={company} />
        <Footer           company={company} />
      </main>
    </>
  );
}
