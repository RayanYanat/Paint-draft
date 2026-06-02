import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strip artifacts that leak in from scraped lead data — control characters,
 * Private-Use-Area glyphs (e.g. Google Maps icon codepoints like U+E0E8 that
 * otherwise render as a "tofu" box before an address), and zero-width chars.
 */
export function cleanText<T extends string | null | undefined>(value: T): T {
  if (typeof value !== "string") return value;
  let out = "";
  for (const ch of value) {
    const c = ch.codePointAt(0)!;
    const junk =
      c <= 0x1f ||                     // C0 control chars
      (c >= 0x7f && c <= 0x9f) ||      // DEL + C1 control chars
      (c >= 0xe000 && c <= 0xf8ff) ||  // Private Use Area (scraped icon glyphs)
      c === 0x200b || c === 0x200c || c === 0x200d || c === 0xfeff; // zero-width
    if (!junk) out += ch;
  }
  return out.trim() as T;
}
