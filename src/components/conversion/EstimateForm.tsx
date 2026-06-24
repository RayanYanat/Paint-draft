"use client";
import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Minus, Plus, Check, CheckCircle2, ImagePlus, X } from "lucide-react";
import type { NicheConfig, Step, ContactField } from "@/lib/niche";

/* Paint atelier palette */
const SIENNA = "#B0552F";
const SIENNA_DARK = "#8A3F22";
const SIENNA_SOFT = "rgba(176,85,47,0.07)";
const INK = "#211C17";
const INK_SOFT = "#6B6258";
const INK_FAINT = "rgba(107,98,88,0.7)";
const PAPER = "#FBF9F4";
const PAPER_WARM = "#EFE9DD";
const LINE = "rgba(33,28,23,0.16)";
const LINE_STRONG = "rgba(33,28,23,0.30)";

type Answers = Record<string, string | number | Record<string, string>>;
type Photo = { url: string; name: string };
type ResolvedStep = Exclude<Step, { type: "adaptive" }>;

function resolveStep(raw: Step, answers: Answers): ResolvedStep {
  if (raw.type !== "adaptive") return raw;
  const key = answers[raw.dependsOn] as string | undefined;
  const body = (key && raw.branches[key]) || raw.fallback;
  return { id: raw.id, ...body };
}

const CONTACT_META: Record<ContactField, { label: string; placeholder: string; type: string; required: boolean }> = {
  name:    { label: "Name",    placeholder: "Jane Smith",        type: "text",  required: true },
  phone:   { label: "Phone",   placeholder: "(555) 123-4567",    type: "tel",   required: true },
  email:   { label: "Email",   placeholder: "jane@email.com",    type: "email", required: true },
  address: { label: "Address", placeholder: "Street, city",      type: "text",  required: true },
};

export default function EstimateForm({ form }: { form: NicheConfig["form"] }) {
  const steps = form.steps;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => {
    const seed: Answers = {};
    steps.forEach((s) => { if (s.type === "counter") seed[s.id] = s.default; });
    return seed;
  });
  const [submitted, setSubmitted] = useState(false);
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({});

  const step = resolveStep(steps[current], answers);
  const isLast = current === steps.length - 1;
  const progress = Math.round(((current + 1) / steps.length) * 100);

  const setAnswer = (id: string, val: Answers[string]) => setAnswers((a) => ({ ...a, [id]: val }));

  useEffect(() => () => { Object.values(photos).flat().forEach((p) => URL.revokeObjectURL(p.url)); }, [photos]);

  const stepValid = (s: ResolvedStep): boolean => {
    if (s.type === "single") return typeof answers[s.id] === "string" && !!answers[s.id];
    if (s.type === "counter") return true;
    if (s.type === "contact") {
      const c = (answers[s.id] as Record<string, string>) ?? {};
      return s.fields.every((f) => !CONTACT_META[f].required || (c[f] ?? "").trim().length > 0);
    }
    return true;
  };

  const next = () => {
    if (!stepValid(step)) return;
    if (step.type === "counter" && typeof answers[step.id] !== "number") setAnswer(step.id, step.default);
    if (isLast) { submitEstimate(); setSubmitted(true); return; }
    setCurrent((c) => c + 1);
  };
  const back = () => setCurrent((c) => Math.max(0, c - 1));

  /* Integration seam — mockup: client-only. Later: POST /api/estimate. */
  const submitEstimate = () => {
    if (process.env.NODE_ENV !== "production") console.log("[estimate]", { answers, photos });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-5 py-8 px-1">
        <span className="flex items-center justify-center w-14 h-14 rounded-full" style={{ backgroundColor: SIENNA_SOFT }}>
          <CheckCircle2 size={30} style={{ color: SIENNA }} />
        </span>
        <div>
          <h3 className="font-display font-medium mb-2" style={{ color: INK, fontSize: "1.9rem" }}>{form.confirmation.title}</h3>
          <p className="leading-relaxed max-w-md" style={{ color: INK_SOFT, fontSize: "1rem" }}>{form.confirmation.body}</p>
        </div>
        <button onClick={() => { setSubmitted(false); setCurrent(0); }} className="kicker text-sienna link-underline">
          ← Start another estimate
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="kicker" style={{ color: INK_SOFT }}>Step {current + 1} of {steps.length}</span>
        <span className="kicker" style={{ color: INK_FAINT, fontVariantNumeric: "tabular-nums" }}>{progress}%</span>
      </div>
      <div className="h-px w-full mb-7" style={{ backgroundColor: LINE }}>
        <div className="h-px transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: SIENNA }} />
      </div>

      {/* Question */}
      <h3 className="font-display font-medium leading-tight mb-1.5" style={{ color: INK, fontSize: "clamp(1.4rem,3vw,1.8rem)" }}>{step.question}</h3>
      {step.hint ? <p className="mb-6" style={{ color: INK_SOFT, fontSize: "0.92rem" }}>{step.hint}</p> : <div className="mb-6" />}

      <div className="min-h-[180px]">
        {step.type === "single" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {step.options.map((opt) => {
              const Icon = opt.icon;
              const active = answers[step.id] === opt.value;
              return (
                <button key={opt.value}
                  onClick={() => { setAnswer(step.id, opt.value); if (!isLast) setTimeout(() => setCurrent((c) => c + 1), 180); }}
                  className="text-left p-4 rounded-sm transition-all duration-200 active:scale-[0.985]"
                  style={{ backgroundColor: active ? SIENNA_SOFT : PAPER, border: `1px solid ${active ? SIENNA : LINE}` }}>
                  <div className="flex items-center justify-between mb-2">
                    {Icon ? <Icon size={22} style={{ color: active ? SIENNA : INK_SOFT }} /> : <span />}
                    {active && <Check size={16} style={{ color: SIENNA }} />}
                  </div>
                  <div className="font-medium" style={{ color: INK, fontSize: "0.98rem" }}>{opt.label}</div>
                  {opt.desc && <div className="mt-0.5" style={{ color: INK_SOFT, fontSize: "0.8rem" }}>{opt.desc}</div>}
                </button>
              );
            })}
          </div>
        )}

        {step.type === "counter" && (() => {
          const val = (answers[step.id] as number) ?? step.default;
          const set = (v: number) => setAnswer(step.id, Math.min(step.max, Math.max(step.min, v)));
          return (
            <div className="flex items-center justify-center gap-6 py-6 rounded-sm" style={{ backgroundColor: PAPER, border: `1px solid ${LINE}` }}>
              <button onClick={() => set(val - 1)} disabled={val <= step.min}
                className="flex items-center justify-center w-12 h-12 rounded-full disabled:opacity-30 active:scale-95 transition-transform"
                style={{ border: `1px solid ${LINE_STRONG}`, color: INK }} aria-label="Decrease"><Minus size={18} /></button>
              <div className="text-center min-w-[90px]">
                <div className="font-display font-medium leading-none" style={{ color: INK, fontSize: "3rem", fontVariantNumeric: "tabular-nums" }}>{val}</div>
                <div className="mt-1" style={{ color: INK_SOFT, fontSize: "0.82rem" }}>{step.unit}{val >= step.max ? "+" : ""}</div>
              </div>
              <button onClick={() => set(val + 1)} disabled={val >= step.max}
                className="flex items-center justify-center w-12 h-12 rounded-full disabled:opacity-30 active:scale-95 transition-transform"
                style={{ border: `1px solid ${LINE_STRONG}`, color: INK }} aria-label="Increase"><Plus size={18} /></button>
            </div>
          );
        })()}

        {step.type === "contact" && (() => {
          const c = (answers[step.id] as Record<string, string>) ?? {};
          const setField = (f: string, v: string) =>
            setAnswers((a) => ({ ...a, [step.id]: { ...((a[step.id] as Record<string, string>) ?? {}), [f]: v } }));
          const list = photos[step.id] ?? [];
          const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files ?? []).slice(0, 8);
            const added = files.map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
            setPhotos((p) => ({ ...p, [step.id]: [...(p[step.id] ?? []), ...added].slice(0, 8) }));
            e.target.value = "";
          };
          const removePhoto = (i: number) => setPhotos((p) => {
            const nx = [...(p[step.id] ?? [])]; const [rm] = nx.splice(i, 1);
            if (rm) URL.revokeObjectURL(rm.url);
            return { ...p, [step.id]: nx };
          });
          const onFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = SIENNA; e.target.style.boxShadow = "0 0 0 1px rgba(176,85,47,0.35)"; };
          const onBlur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = LINE; e.target.style.boxShadow = "none"; };
          return (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {step.fields.map((f) => {
                  const meta = CONTACT_META[f];
                  return (
                    <div key={f} className={f === "address" ? "sm:col-span-2" : ""}>
                      <label className="kicker block mb-2.5" style={{ color: "rgba(107,98,88,0.9)" }}>
                        {meta.label} {meta.required && <span style={{ color: SIENNA }}>*</span>}
                      </label>
                      <input type={meta.type} placeholder={meta.placeholder} value={c[f] ?? ""}
                        onChange={(e) => setField(f, e.target.value)} onFocus={onFocus} onBlur={onBlur}
                        className="w-full text-sm px-4 py-3.5 rounded-sm outline-none transition-all duration-200 placeholder:text-ink-soft/50"
                        style={{ backgroundColor: PAPER, border: `1px solid ${LINE}`, color: INK }} />
                    </div>
                  );
                })}
              </div>

              {step.photos && (
                <div className="mt-4">
                  <label className="kicker block mb-2.5" style={{ color: "rgba(107,98,88,0.9)" }}>
                    Photos <span className="lowercase tracking-normal">(optional — helps us quote)</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {list.map((ph, i) => (
                      <div key={ph.url} className="relative w-16 h-16 rounded-sm overflow-hidden" style={{ border: `1px solid ${LINE}` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ph.url} alt={ph.name} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removePhoto(i)} aria-label="Remove photo"
                          className="absolute top-0.5 right-0.5 flex items-center justify-center w-5 h-5 rounded-full"
                          style={{ backgroundColor: "rgba(33,28,23,0.78)", color: "#fff" }}><X size={12} /></button>
                      </div>
                    ))}
                    {list.length < 8 && (
                      <label className="flex flex-col items-center justify-center w-16 h-16 rounded-sm cursor-pointer transition-colors duration-200"
                        style={{ border: `1.5px dashed ${LINE_STRONG}`, color: INK_SOFT }}>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
                        <ImagePlus size={18} /><span className="mt-0.5" style={{ fontSize: "0.62rem" }}>Add</span>
                      </label>
                    )}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between mt-8">
        <button onClick={back} disabled={current === 0}
          className="inline-flex items-center gap-2 text-sm font-medium disabled:opacity-0 transition-opacity" style={{ color: INK_SOFT }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={next} disabled={!stepValid(step)}
          className="cta-breathe inline-flex items-center gap-3 px-7 py-3.5 text-sm font-medium tracking-wide rounded-sm transition-colors duration-300 disabled:opacity-40"
          style={{ backgroundColor: SIENNA, color: "#F7F4EE" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = SIENNA_DARK)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = SIENNA)}>
          {isLast ? "Get my estimate" : "Continue"}
          <ArrowRight size={16} />
        </button>
      </div>

      <p className="mt-5" style={{ color: INK_FAINT, fontSize: "0.8rem" }}>No spam, no pressure — your details stay private.</p>
    </div>
  );
}
