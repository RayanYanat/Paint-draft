import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

type Signals = {
  wd?: boolean; langs?: number; cores?: number; touch?: number;
  vis?: string; w?: number; h?: number; dpr?: number; tz?: string | null; ref?: string | null;
};

/* Automation / email-gateway scanners that announce themselves in the UA.
   NOTE: Microsoft Safe Links usually spoofs a real Chrome UA, so the UA list
   alone is not enough — datacenter-IP detection (below) is what catches it. */
const UA_BOT = /bot|crawl|spider|slurp|baidu|bytespider|gptbot|headless|phantom|puppeteer|playwright|selenium|python-requests|curl|wget|libwww|java\/|go-http|axios|okhttp|apache-httpclient|proofpoint|mimecast|barracuda|forcepoint|messagelabs|fireeye|cloudmark|bankguard|vade/i;

/* Email-security vendors whose org/AS name is unambiguous (no residential ISP
   is called "Proofpoint"). Generic cloud datacenters — Azure, AWS, GCP, OVH… —
   are caught by ip-api's `hosting` flag instead, which (unlike a name match)
   won't misfire on a real prospect using Google Fiber or Amazon corp wifi. */
const ORG_DC = /proofpoint|mimecast|barracuda|forcepoint|symantec|broadcom|zscaler|netskope|messagelabs|cloudmark|vade|fireeye|trustwave|agari/i;

export async function POST(req: NextRequest) {
  try {
    const { slug, phase = "open", signals = {} } =
      (await req.json()) as { slug: string; phase?: "open" | "engaged"; signals?: Signals };
    if (!slug) return NextResponse.json({ ok: false }, { status: 400 });

    const ua = req.headers.get("user-agent") ?? "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
            ?? req.headers.get("x-real-ip") ?? "";

    /* ── Geo + datacenter lookup (ip-api free: hosting flag + org/as) ──── */
    let city: string | null = null, region: string | null = null, country: string | null = null;
    let hosting = false, org = "";

    const nfGeo = req.headers.get("x-nf-geo");
    if (nfGeo) {
      try {
        const g = JSON.parse(nfGeo);
        city = g.city ?? null; region = g.subdivision?.name ?? null; country = g.country?.code ?? null;
      } catch {}
    }

    const isLocal = !ip || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.");
    if (!isLocal) {
      try {
        const r = await fetch(
          `http://ip-api.com/json/${ip}?fields=status,city,regionName,countryCode,org,as,hosting`,
          { signal: AbortSignal.timeout(2000) }
        );
        if (r.ok) {
          const d = await r.json();
          if (d.status === "success") {
            city ??= d.city ?? null; region ??= d.regionName ?? null; country ??= d.countryCode ?? null;
            hosting = !!d.hosting;
            org = `${d.org ?? ""} ${d.as ?? ""}`.trim();
          }
        }
      } catch {}
    }

    /* ── Classify ──────────────────────────────────────────────────────────
       Filter scanners by BEHAVIOUR (the engagement gate), not by IP. The old
       hosting/org checks also flagged real visitors on corporate, VPN or some
       residential/mobile networks — the exact people we want to hear about.
       hosting/dcOrg are still recorded for context but no longer block. */
    const uaBot     = UA_BOT.test(ua) || ua.trim() === "";
    const clientBot = signals.wd === true || (signals.langs === 0 && (signals.cores ?? 0) === 0);
    const dcOrg     = ORG_DC.test(org);
    const isScanner = uaBot || clientBot;
    const reason    = uaBot ? "UA" : clientBot ? "automation" : (hosting || dcOrg) ? "datacenter" : "";

    const supabase = getSupabase();
    const { data: lead } = await supabase.from("leads").select("*").eq("slug", slug).single();
    if (!lead) return NextResponse.json({ ok: false, reason: "lead not found" }, { status: 404 });

    const has   = (c: string) => Object.prototype.hasOwnProperty.call(lead, c);
    const now   = new Date().toISOString();
    const admin = getSupabaseAdmin();
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    const location = [city, region, country].filter(Boolean).join(", ") || "Unknown";

    const slack = async (text: string) => {
      if (!slackUrl) return;
      try {
        await fetch(slackUrl, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blocks: [{ type: "section", text: { type: "mrkdwn", text } }] }),
        });
      } catch {}
    };

    /* ── Scanner: record the detonation, never raise a hot-lead alert ──── */
    if (isScanner) {
      if (has("scanner_count")) {
        const firstScan = !lead.scanner_count;
        const upd: Record<string, unknown> = { scanner_count: (lead.scanner_count ?? 0) + 1 };
        if (has("last_scanned_at")) upd.last_scanned_at = now;
        await admin.from("leads").update(upd).eq("slug", slug);
        // One muted confirmation per lead: the email cleared their gateway.
        if (firstScan) {
          await slack(`🛡️ *${lead.name}* — link scanned by a security gateway${reason ? ` (${reason})` : ""} · ${location}. Delivered; not a real visit.`);
        }
      }
      return NextResponse.json({ ok: true, kind: "scanner", reason });
    }

    /* ── Human, but only "opened" (no engagement yet): record softly ──── */
    if (phase !== "engaged") {
      if (has("last_opened_at")) await admin.from("leads").update({ last_opened_at: now }).eq("slug", slug);
      return NextResponse.json({ ok: true, kind: "open" });
    }

    /* ── Human + engaged = a real prospect actively on the page ────────── */
    const isFirst  = !lead.first_visited_at;
    const newCount = (lead.visit_count ?? 0) + 1;
    const upd: Record<string, unknown> = {
      visit_count:      newCount,
      first_visited_at: isFirst ? now : lead.first_visited_at,
      last_visited_at:  now,
    };
    if (has("first_engaged_at") && !lead.first_engaged_at) upd.first_engaged_at = now;
    await admin.from("leads").update(upd).eq("slug", slug);

    const isMobile   = /mobile|android|iphone|ipad/i.test(ua);
    const emoji      = isFirst ? "🔥" : "🔄";
    const visitLabel = isFirst ? "First real visit" : `Visit #${newCount}`;
    const device     = isMobile ? "📱 Mobile" : "🖥️ Desktop";
    const time       = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", timeZone: "America/Chicago",
    });
    await slack([
      `${emoji} *${lead.name}* is actively on their site`,
      `📍 ${location}  ·  ${visitLabel}  ·  ${device}  ·  🕐 ${time}`,
    ].join("\n"));

    return NextResponse.json({ ok: true, kind: "engaged" });

  } catch (e) {
    return NextResponse.json({ ok: false, caught: String(e) });
  }
}
