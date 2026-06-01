"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import type { CompanyData } from "@/lib/types";

const REVIEWS = [
  {
    name: "Sarah M.",
    text: "They painted our entire first floor and the results are incredible. Clean, fast, and professional from start to finish.",
    rating: 5,
  },
  {
    name: "James R.",
    text: "Best painting crew we've ever hired. They took the time to prep everything properly and the finish is flawless.",
    rating: 5,
  },
  {
    name: "Linda K.",
    text: "Had our exterior done before listing. Multiple buyers commented on how great the house looked. Worth every penny.",
    rating: 5,
  },
];

export default function ReviewsSection({ company }: { company: CompanyData }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".review-card", {
      scrollTrigger: {
        trigger: ref.current,
        start: "top 75%",
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, { scope: ref });

  return (
    <section ref={ref} id="reviews" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-data text-[10px] tracking-[0.3em] uppercase text-brand/50 block mb-4">
            Testimonials
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm sm:text-base">
            Real feedback from homeowners and businesses in {company.zone}.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="review-card p-6 rounded-xl border border-subtle bg-surface"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-brand text-brand" />
                ))}
              </div>

              <p className="text-sm text-white/50 leading-relaxed mb-5">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-brand">
                    {review.name[0]}
                  </span>
                </div>
                <span className="text-sm font-medium text-white/70">
                  {review.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
