"use client";
import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

/**
 * Cal.com inline booking. Rendered ONLY when its tab is opened, so the Cal.com
 * script never touches the initial page load. A single Cal account serves every
 * mockup; swap NEXT_PUBLIC_CAL_LINK for the client's calendar when sold.
 */
export default function BookingEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: { light: { "cal-brand": "#B0552F" }, dark: { "cal-brand": "#B0552F" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div
      data-lenis-prevent
      className="rounded-sm overflow-hidden"
      style={{ minHeight: 560, overscrollBehavior: "contain" }}
    >
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "560px", overflow: "scroll", overscrollBehavior: "contain" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
