import {
  Home, Building2, Layers, PaintRoller, Hammer, Brush,
  Wrench, Zap, Settings, Flame, CalendarClock, CalendarCheck,
  type LucideIcon,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * Niche configuration — one data file drives the conversion features
 * (booking wording + multi-step estimate form) for every category. Add a niche
 * by adding one entry here; no new components needed.
 * ──────────────────────────────────────────────────────────────────────────── */

export type NicheKey = "painter" | "hvac" | "default";

export type ContactField = "name" | "phone" | "email" | "address";

type SingleBody  = { type: "single"; question: string; hint?: string;
  options: { value: string; label: string; desc?: string; icon?: LucideIcon }[] };
type CounterBody = { type: "counter"; question: string; hint?: string;
  min: number; max: number; unit: string; default: number };

/** Steps that an adaptive step can resolve to (no nesting). */
export type BranchBody = SingleBody | CounterBody;

export type Step =
  | ({ id: string } & SingleBody)
  | ({ id: string } & CounterBody)
  | { id: string; type: "contact"; question: string; hint?: string;
      fields: ContactField[]; photos?: boolean }
  // Resolves at runtime to the branch matching answers[dependsOn].
  | { id: string; type: "adaptive"; dependsOn: string;
      branches: Record<string, BranchBody>; fallback: BranchBody };

export interface NicheConfig {
  /** Primary booking CTA label used in hero + CTA band */
  bookingCta: string;
  booking: { title: string; subtitle: string };
  form: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: Step[];
    confirmation: { title: string; body: string };
  };
  /** Side panel "reassurance" card */
  aside: { badge: string; text: string };
}

/* Resolve a raw Supabase category string to a niche key. Space-separated so
   "Painting contractor", "Air conditioning contractor"… all map correctly. */
export function resolveNiche(category: string | null | undefined): NicheKey {
  const c = (category ?? "").toLowerCase();
  if (/paint/.test(c)) return "painter";
  if (/hvac|heat|cool|air.?condition|furnace|ventilat|climate/.test(c)) return "hvac";
  return "default";
}

export const NICHE_CONFIG: Record<NicheKey, NicheConfig> = {
  /* ── Painter ──────────────────────────────────────────────────────────── */
  painter: {
    bookingCta: "Book a free estimate",
    booking: {
      title: "Book your free on-site estimate",
      subtitle: "Pick a time that suits you. We come measure, discuss colours, and hand you a clear quote — no obligation.",
    },
    form: {
      eyebrow: "Free estimate",
      title: "Get your free estimate",
      subtitle: "Answer a few quick questions and we'll send a tailored quote within 24 hours.",
      steps: [
        {
          id: "area", type: "single", question: "What needs painting?",
          options: [
            { value: "interior", label: "Interior", desc: "Rooms, walls, ceilings", icon: Home },
            { value: "exterior", label: "Exterior", desc: "Facade, siding, trim", icon: Building2 },
            { value: "both",     label: "Both",     desc: "Inside & outside", icon: Layers },
          ],
        },
        {
          // Adapts to the Interior / Exterior / Both choice above.
          id: "size", type: "adaptive", dependsOn: "area",
          branches: {
            interior: {
              type: "counter", question: "Roughly how many rooms?",
              hint: "An estimate is fine — we'll confirm on site.",
              min: 1, max: 15, unit: "rooms", default: 3,
            },
            exterior: {
              type: "single", question: "What's the exterior scope?",
              options: [
                { value: "facade", label: "Facade / walls", desc: "Siding, render, masonry", icon: Building2 },
                { value: "trim",   label: "Trim & doors",   desc: "Fascias, frames, shutters", icon: Brush },
                { value: "full",   label: "Full exterior",  desc: "Everything outside", icon: Layers },
              ],
            },
            both: {
              type: "counter", question: "Roughly how many rooms inside?",
              hint: "We'll assess the exterior on site.",
              min: 1, max: 15, unit: "rooms", default: 3,
            },
          },
          fallback: {
            type: "counter", question: "Roughly how many rooms?",
            min: 1, max: 15, unit: "rooms", default: 3,
          },
        },
        {
          id: "work", type: "single", question: "What kind of work?",
          options: [
            { value: "painting",   label: "Fresh paint",        desc: "Repaint walls & ceilings", icon: PaintRoller },
            { value: "renovation", label: "Repaint + repairs",  desc: "Patch, prep, then paint", icon: Hammer },
            { value: "woodwork",   label: "Trim & woodwork",    desc: "Doors, frames, mouldings", icon: Brush },
          ],
        },
        {
          id: "contact", type: "contact", question: "Your details",
          hint: "Add a few photos to get a faster, more accurate quote.",
          fields: ["name", "phone", "email", "address"], photos: true,
        },
      ],
      confirmation: {
        title: "Your estimate is on its way",
        body: "Thanks! We'll review your project and send a free, tailored estimate within 24 hours.",
      },
    },
    aside: {
      badge: "Free, no-obligation quote",
      text: "Tell us about your project and we'll come measure and quote on site — at no cost.",
    },
  },

  /* ── HVAC ─────────────────────────────────────────────────────────────── */
  hvac: {
    bookingCta: "Book a service visit",
    booking: {
      title: "Book your service visit",
      subtitle: "Pick a time and we'll come diagnose, advise, and hand you a clear quote — no obligation.",
    },
    form: {
      eyebrow: "Free estimate",
      title: "Get your free estimate",
      subtitle: "Answer 4 quick questions and we'll get back to you within 24 hours.",
      steps: [
        {
          id: "service", type: "single", question: "What do you need?",
          options: [
            { value: "install",     label: "Installation", desc: "New system or replacement", icon: Wrench },
            { value: "repair",      label: "Repair",       desc: "Something's not working", icon: Zap },
            { value: "maintenance", label: "Maintenance",  desc: "Tune-up or service plan", icon: Settings },
          ],
        },
        {
          id: "system", type: "single", question: "What kind of system?",
          options: [
            { value: "central",   label: "Central AC / furnace" },
            { value: "minisplit", label: "Mini-split / heat pump" },
            { value: "unsure",    label: "Not sure" },
          ],
        },
        {
          id: "urgency", type: "single", question: "How soon do you need it?",
          options: [
            { value: "urgent",   label: "Urgent — ASAP", icon: Flame },
            { value: "week",     label: "This week", icon: CalendarClock },
            { value: "flexible", label: "I'm flexible", icon: CalendarCheck },
          ],
        },
        {
          id: "contact", type: "contact", question: "Your details",
          hint: "Add a photo of the unit or the issue to speed things up.",
          fields: ["name", "phone", "email", "address"], photos: true,
        },
      ],
      confirmation: {
        title: "Request received",
        body: "Thanks! A technician will reach out within 24 hours to schedule your visit.",
      },
    },
    aside: {
      badge: "Emergency available now",
      text: "Heating or cooling emergency? We dispatch fast — call us and we'll be on our way.",
    },
  },

  /* ── Default fallback (any other niche) ───────────────────────────────── */
  default: {
    bookingCta: "Book a free estimate",
    booking: {
      title: "Book your free estimate",
      subtitle: "Pick a time that works and we'll come take a look — no obligation.",
    },
    form: {
      eyebrow: "Free estimate",
      title: "Get your free estimate",
      subtitle: "Answer a few quick questions and we'll get back to you within 24 hours.",
      steps: [
        {
          id: "service", type: "single", question: "How can we help?",
          options: [
            { value: "quote",   label: "Get a quote", icon: Layers },
            { value: "repair",  label: "Fix a problem", icon: Wrench },
            { value: "advice",  label: "Just some advice", icon: Settings },
          ],
        },
        {
          id: "contact", type: "contact", question: "Where should we reach you?",
          fields: ["name", "phone", "email", "address"],
        },
      ],
      confirmation: {
        title: "Request received",
        body: "Thanks! We'll get back to you within 24 hours.",
      },
    },
    aside: {
      badge: "Free, no-obligation quote",
      text: "Tell us what you need and we'll get back to you with a clear, free estimate.",
    },
  },
};

export function getNiche(category: string | null | undefined): NicheConfig {
  return NICHE_CONFIG[resolveNiche(category)];
}

/* This template is single-niche by design — its visuals are fixed, so the
   conversion features lock to the template's niche regardless of a lead's
   scraped category (which stays a fallback only, e.g. for shared components). */
export const TEMPLATE_NICHE: NicheKey = "painter";
export const getTemplateNiche = (): NicheConfig => NICHE_CONFIG[TEMPLATE_NICHE];
