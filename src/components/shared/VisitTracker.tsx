"use client";
import { useEffect } from "react";

/**
 * Fires a single POST to /api/track when the page mounts.
 * Renders nothing — purely a side-effect component.
 */
export default function VisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
