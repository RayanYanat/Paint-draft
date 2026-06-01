import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json() as { slug: string };
    if (!slug) return NextResponse.json({ ok: false }, { status: 400 });

    const userAgent = req.headers.get("user-agent") ?? "";

    /* ── Ignore bots ───────────────────────────────────────────────── */
    if (/bot|crawl|spider|slurp|baidu|bytespider|GPTBot/i.test(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    /* ── Geo: try Netlify header first, fallback to IP lookup ─────── */
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
            ?? req.headers.get("x-real-ip")
            ?? "";

    let city: string | null = null;
    let region: string | null = null;
    let country: string | null = null;

    const nfGeo = req.headers.get("x-nf-geo");
    if (nfGeo) {
      try {
        const geo = JSON.parse(nfGeo);
        city = geo.city ?? null;
        region = geo.subdivision?.name ?? null;
        country = geo.country?.code ?? null;
      } catch {}
    }

    if (!city && ip && !ip.startsWith("127.") && !ip.startsWith("192.168.")) {
      try {
        const geo = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName,countryCode`, { signal: AbortSignal.timeout(2000) });
        if (geo.ok) {
          const data = await geo.json();
          city = data.city ?? null;
          region = data.regionName ?? null;
          country = data.countryCode ?? null;
        }
      } catch {}
    }

    const supabase = getSupabase();

    /* ── Fetch current lead state ──────────────────────────────────── */
    const { data: lead } = await supabase
      .from("leads")
      .select("name, visit_count, first_visited_at")
      .eq("slug", slug)
      .single();

    if (!lead) return NextResponse.json({ ok: false, reason: "lead not found" }, { status: 404 });

    const isFirstVisit = !lead.first_visited_at;
    const newCount     = (lead.visit_count ?? 0) + 1;
    const now          = new Date().toISOString();

    /* ── Update lead — admin client bypasses RLS ──────────────────── */
    await getSupabaseAdmin()
      .from("leads")
      .update({
        visit_count:      newCount,
        first_visited_at: isFirstVisit ? now : lead.first_visited_at,
        last_visited_at:  now,
      })
      .eq("slug", slug)
      .select("visit_count");

    /* ── Slack notification ───────────────────────────────────────── */
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      const isMobile   = /mobile|android|iphone|ipad/i.test(userAgent);
      const emoji      = isFirstVisit ? "🔥" : "🔄";
      const visitLabel = isFirstVisit ? "First visit" : `Visit #${newCount}`;
      const device     = isMobile ? "📱 Mobile" : "🖥️ Desktop";
      const location   = [city, region, country].filter(Boolean).join(", ") || "Unknown";
      const time       = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit",
        timeZone: "America/Chicago",
      });

      try {
        await fetch(slackUrl, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: [
                    `${emoji} *${lead.name}* is on their site`,
                    `📍 ${location}  ·  ${visitLabel}  ·  ${device}  ·  🕐 ${time}`,
                  ].join("\n"),
                },
              },
            ],
          }),
        });
      } catch {}
    }

    return NextResponse.json({ ok: true });

  } catch (e) {
    return NextResponse.json({ ok: false, caught: String(e) });
  }
}
