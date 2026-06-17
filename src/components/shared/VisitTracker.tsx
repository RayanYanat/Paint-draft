"use client";
import { useEffect } from "react";

/**
 * Two-phase visit tracking that separates a real prospect from an email
 * security scanner (Microsoft Safe Links, Proofpoint, Mimecast…), which
 * "detonate" the link from a datacenter the instant the mail is delivered —
 * long before the human ever sees it.
 *
 *  • phase "open"    — fired on mount with device/automation signals. The
 *                      server classifies it; a scanner is recorded but never
 *                      raises a hot-lead alert.
 *  • phase "engaged" — fired ONCE the visitor proves they're human: real
 *                      foreground dwell + a genuine interaction (move / scroll
 *                      / tap / key), or a long quiet read. Scanners load-and-
 *                      leave, so this never fires for them. THIS is what earns
 *                      the Slack alert.
 *
 * Renders nothing.
 */
export default function VisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const signals = (() => {
      try {
        return {
          wd:    (navigator as unknown as { webdriver?: boolean }).webdriver === true,
          langs: navigator.languages?.length ?? 0,
          cores: navigator.hardwareConcurrency ?? 0,
          touch: navigator.maxTouchPoints ?? 0,
          vis:   document.visibilityState,
          w:     screen.width,
          h:     screen.height,
          dpr:   Math.round((window.devicePixelRatio ?? 1) * 100) / 100,
          tz:    Intl.DateTimeFormat().resolvedOptions().timeZone || null,
          ref:   document.referrer || null,
        };
      } catch {
        return {};
      }
    })();

    const send = (phase: "open" | "engaged") => {
      fetch("/api/track", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ slug, phase, signals }),
        keepalive: true, // survive a quick tab close
      }).catch(() => {});
    };

    send("open");

    /* ── Engagement gate ──────────────────────────────────────────────
       Human = a genuine interaction AND ≥3s of foreground time, OR a long
       quiet read (≥12s visible). Only visible (foreground) time is counted,
       so a scanner that renders the page hidden never accrues dwell. */
    const INTERACT_DWELL = 3_000;
    const PURE_DWELL     = 12_000;
    const MAX_LIFETIME   = 60_000;

    let engaged   = false;
    let interacted = false;
    let visibleMs = 0;
    let lastTick  = document.visibilityState === "visible" ? Date.now() : 0;

    const accrue = () => {
      if (lastTick) { visibleMs += Date.now() - lastTick; lastTick = Date.now(); }
    };
    const maybeEngage = () => {
      accrue();
      if (engaged) return;
      if ((interacted && visibleMs >= INTERACT_DWELL) || visibleMs >= PURE_DWELL) {
        engaged = true;
        cleanup();
        send("engaged");
      }
    };

    const interactEvents = ["pointermove", "pointerdown", "scroll", "keydown", "touchstart", "wheel"] as const;
    const onInteract = () => {
      interacted = true;
      interactEvents.forEach((e) => window.removeEventListener(e, onInteract)); // one is enough
      maybeEngage();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") lastTick = Date.now();
      else { accrue(); lastTick = 0; }
    };

    interactEvents.forEach((e) => window.addEventListener(e, onInteract, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);
    const poll = window.setInterval(maybeEngage, 1_000);
    const stop = window.setTimeout(() => cleanup(), MAX_LIFETIME);

    function cleanup() {
      interactEvents.forEach((e) => window.removeEventListener(e, onInteract));
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(poll);
      window.clearTimeout(stop);
    }

    return cleanup;
  }, [slug]);

  return null;
}
