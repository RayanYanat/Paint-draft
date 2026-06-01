"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function LockedScreen() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(".ls-bracket",  { opacity: 0 });
    gsap.set(".ls-badge",    { opacity: 0, y: 14 });
    gsap.set(".ls-mark",     { opacity: 0, scale: 0.65 });
    gsap.set(".ls-divider",  { scaleX: 0 });
    gsap.set(".ls-sub",      { opacity: 0, y: 14 });
    gsap.set(".ls-strip",    { opacity: 0 });
    gsap.set(".ls-title-1",  { opacity: 1, clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(".ls-title-2",  { opacity: 1, clipPath: "inset(0% 100% 0% 0%)" });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".ls-bracket",  { opacity: 1, duration: 1.1, stagger: 0.09 })
      .to(".ls-badge",    { opacity: 1, y: 0, duration: 0.55 }, "-=0.75")
      .to(".ls-mark",     { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.5)" }, "-=0.25")
      .to(".ls-title-1",  { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power4.out" }, "-=0.05")
      .to(".ls-title-2",  { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power4.out" }, "-=0.62")
      .to(".ls-divider",  { scaleX: 1, duration: 0.9, ease: "expo.out" }, "-=0.4")
      .to(".ls-sub",      { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 }, "-=0.45")
      .to(".ls-strip",    { opacity: 1, duration: 0.55 }, "-=0.25");
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0B0D10" }}
    >
      {/* Fine grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,164,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,164,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Ambient glows */}
      <div
        className="absolute top-0 left-0 w-[700px] h-[550px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(99,164,255,0.10) 0%, transparent 60%)",
          animation: "breathe 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom right, rgba(99,164,255,0.07) 0%, transparent 60%)",
          animation: "breathe 12s ease-in-out infinite reverse",
          animationDelay: "3s",
        }}
      />

      {/* Corner brackets */}
      <div className="absolute inset-7 pointer-events-none">
        <div className="ls-bracket absolute top-0 left-0 w-12 h-12"
          style={{ borderTop: "1px solid rgba(99,164,255,0.45)", borderLeft: "1px solid rgba(99,164,255,0.45)" }} />
        <div className="ls-bracket absolute top-0 right-0 w-12 h-12"
          style={{ borderTop: "1px solid rgba(99,164,255,0.45)", borderRight: "1px solid rgba(99,164,255,0.45)" }} />
        <div className="ls-bracket absolute bottom-0 left-0 w-12 h-12"
          style={{ borderBottom: "1px solid rgba(99,164,255,0.45)", borderLeft: "1px solid rgba(99,164,255,0.45)" }} />
        <div className="ls-bracket absolute bottom-0 right-0 w-12 h-12"
          style={{ borderBottom: "1px solid rgba(99,164,255,0.45)", borderRight: "1px solid rgba(99,164,255,0.45)" }} />
      </div>

      {/* Scan line */}
      <div
        className="absolute left-7 right-7 pointer-events-none"
        style={{
          top: "50%",
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(99,164,255,0.07) 20%, rgba(99,164,255,0.07) 80%, transparent)",
        }}
      />

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        <div className="ls-badge flex items-center gap-2.5 mb-10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: "#63A4FF" }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#63A4FF" }} />
          </span>
          <span className="font-data text-[10px] tracking-[0.32em] uppercase"
            style={{ color: "rgba(99,164,255,0.55)" }}>
            Secure Access Terminal
          </span>
        </div>

        <div className="ls-mark mb-7">
          <span className="font-heading text-[3.5rem] font-extrabold leading-none"
            style={{ color: "#63A4FF", textShadow: "0 0 60px rgba(99,164,255,0.5), 0 0 120px rgba(99,164,255,0.2)" }}>
            ▸
          </span>
        </div>

        <div className="overflow-x-hidden">
          <h1 className="ls-title-1 font-heading font-extrabold text-white"
            style={{ fontSize: "clamp(3rem,9.5vw,8.5rem)", lineHeight: 0.9 }}>
            PERSONALIZED
          </h1>
        </div>
        <div className="overflow-x-hidden mb-9">
          <h1 className="ls-title-2 font-heading font-extrabold"
            style={{ fontSize: "clamp(3rem,9.5vw,8.5rem)", lineHeight: 0.9, color: "#63A4FF", textShadow: "0 0 40px rgba(99,164,255,0.35)" }}>
            ACCESS
          </h1>
        </div>

        <div className="ls-divider w-14 h-px bg-brand origin-left mb-9" />

        <p className="ls-sub text-sm leading-relaxed mb-2"
          style={{ color: "rgba(255,255,255,0.45)", maxWidth: "26rem" }}>
          This link is configured for a specific recipient.
        </p>
        <p className="ls-sub text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.45)", maxWidth: "26rem" }}>
          Please use the personalized URL provided for you.
        </p>

        <div className="ls-strip mt-14 flex items-center gap-4">
          <div className="w-8 h-px" style={{ backgroundColor: "rgba(99,164,255,0.2)" }} />
          <span className="font-data text-[9px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(255,255,255,0.28)" }}>
            AUTHENTICATED ACCESS ONLY
          </span>
          <div className="w-8 h-px" style={{ backgroundColor: "rgba(99,164,255,0.2)" }} />
        </div>
      </div>
    </div>
  );
}
