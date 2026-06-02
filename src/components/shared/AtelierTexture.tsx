/**
 * AtelierTexture — makes the warm-paper background feel like real, textured
 * drawing paper instead of a flat digital fill.
 *
 *  • Layer 1 — fractal-noise grain (SVG turbulence), subliminal 0.032 opacity,
 *    nudged in steps every 0.6s for a faint paper shimmer.
 *  • Layer 2 — a 1px linen weave (desktop only), 0.018 opacity.
 *
 * Fixed, pointer-events-none, above all content. The grain animation is
 * disabled under prefers-reduced-motion by the global rule in globals.css.
 */
export default function AtelierTexture() {
  return (
    <>
      {/* Paper grain */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none grain-anim"
        style={{
          zIndex: 9000,
          opacity: 0.07,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='ag'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23ag)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Linen weave — desktop only */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none hidden lg:block"
        style={{
          zIndex: 9001,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(33,28,23,0.035) 3px, rgba(33,28,23,0.035) 4px)",
        }}
      />
    </>
  );
}
