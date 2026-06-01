/**
 * Data shape for a single prospect/client row in Supabase `leads` table.
 * All sections receive a CompanyData prop injected by the [slug]/page.tsx Server Component.
 */
export interface CompanyData {
  slug:     string;
  name:     string;
  city:     string;      // raw DB column — e.g. "Dallas"
  zone:     string;      // computed in page.tsx — e.g. "Dallas & surrounding areas"
  phone:    string;
  email:         string | null;
  address:       string | null;
  opening_hours: string | null;
}
