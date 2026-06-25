"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

/* Owner sales-call CTA — a dedicated Cal event (separate from the demo's
   customer booking). Set NEXT_PUBLIC_OWNER_CAL_LINK to "username/event-slug". */
const OWNER_CAL = process.env.NEXT_PUBLIC_OWNER_CAL_LINK ?? "your-cal-username/quick-call";

/**
 * ConceptBanner — shown ONLY on personalized drafts (the [slug] route).
 *
 * Frames the page as a design DIRECTION so the templated visuals read as
 * intentional ("a concept made for you"), not as a generic template. This
 * removes the "he didn't look at my business" reaction when the demo's
 * imagery/branding doesn't match the prospect exactly.
 *
 * UX rules:
 *  - Appears AFTER the hero has had its moment (delay), so the wow is intact.
 *  - Anchored to the bottom, never overlaps the hero.
 *  - Subtle, on-palette (Atelier), dismissible. Respects reduced-motion.
 */
export default function ConceptBanner({ name }: { name: string }) {
  const [shown, setShown] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setShown(true), reduce ? 600 : 3000); // let the hero land first
    return () => clearTimeout(t);
  }, []);

  if (closed) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 flex justify-center sm:inset-x-0 sm:bottom-5 pointer-events-none">
      <div
        className="pointer-events-auto w-full sm:w-auto sm:max-w-lg"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(125%)",
          transition: "opacity 700ms ease, transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="relative flex items-start gap-3 rounded-md border px-4 py-3"
          style={{
            background: "#FBF9F4",
            borderColor: "rgba(33,28,23,0.14)",
            boxShadow: "0 14px 44px -14px rgba(33,28,23,0.40)",
          }}
        >
          <span
            className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: "#B0552F" }}
            aria-hidden
          />

          <div className="min-w-0">
            <p
              className="font-semibold uppercase"
              style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#B0552F" }}
            >
              A design draft · for {name}
            </p>
            <p className="mt-1 leading-snug" style={{ fontSize: "12.5px", color: "#211C17" }}>
              Fully mobile-ready, with free estimates and online booking built in. Your services, branding and photos come in the final build.
            </p>

            {/* Owner conversion CTA — book a quick call with me */}
            <a
              href={`https://cal.com/${OWNER_CAL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-medium transition-opacity hover:opacity-90"
              style={{ fontSize: "12px", backgroundColor: "#B0552F", color: "#F7F4EE" }}
            >
              Book a quick call with me
              <ArrowUpRight size={14} />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setClosed(true)}
            aria-label="Dismiss"
            className="-mr-1 -mt-1 ml-1 shrink-0 rounded p-1 text-base leading-none transition-opacity hover:opacity-60"
            style={{ color: "#6B6258" }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
