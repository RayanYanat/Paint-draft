import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Lazy Supabase client — created on first call, not at module load time.
 *
 * Why lazy?
 * Next.js imports every page module at build time to collect route config
 * (revalidate, dynamicParams, generateStaticParams). If the client were
 * instantiated at module level, createClient() would throw "supabaseUrl is
 * required" whenever NEXT_PUBLIC_SUPABASE_URL is not in the environment
 * (CI, cold builds without .env.local). Lazy init defers the check until an
 * actual DB call is made, so the build succeeds even without env vars as long
 * as no data is fetched at build time — which is exactly our setup
 * (generateStaticParams returns []).
 */
let _client:      SupabaseClient | null = null;
let _adminClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        "Supabase env vars are missing.\n" +
        "Add the following to your .env.local:\n" +
        "  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co\n" +
        "  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci..."
      );
    }

    _client = createClient(url, key);
  }

  return _client;
}

/**
 * Admin client using the service_role key — bypasses RLS entirely.
 * ONLY used server-side (API routes). Never import in "use client" files.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is missing.\n" +
        "Add it to .env.local and Netlify environment variables."
      );
    }

    _adminClient = createClient(url, key, {
      auth: { persistSession: false },
    });
  }

  return _adminClient;
}
