/**
 * PaletteNarrative — a subliminal color arc spanning the whole page.
 *
 * Warm sienna and ochre at the top (artisan warmth), a neutral pause through
 * the middle (the work), settling into olive earth tones toward the bottom
 * (calm, grounded). Max opacity 0.04 — felt, never seen. Sits behind the
 * translucent sections inside <main>.
 */
export default function PaletteNarrative() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: -1,
        background:
          "linear-gradient(to bottom," +
          " rgba(176, 85, 47, 0.10) 0%," +
          " rgba(196, 128, 61, 0.07) 25%," +
          " transparent 45%," +
          " transparent 55%," +
          " rgba(122, 128, 104, 0.07) 75%," +
          " rgba(74, 80, 64, 0.10) 100%)",
      }}
    />
  );
}
