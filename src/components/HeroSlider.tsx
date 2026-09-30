"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Banner = {
  id: number;
  desktopImageUrl: string;
  mobileImageUrl: string | null;
  buttonUrl: string | null;
  title: string | null;
  subtitle: string | null;
};

function parseLang(value: string | null | undefined, lang = "fr"): string {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed[lang] || parsed["fr"] || parsed["ar"] || "";
    }
    return value;
  } catch {
    return value;
  }
}

const DEFAULT_BANNER_URL =
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop";

export function HeroSlider({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = banners.length > 0 ? banners : [null];
  const total = slides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  // Auto-advance every 5s unless paused
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, total, isPaused]);

  const getSlideImage = (banner: Banner | null, mobile = false) => {
    if (!banner) return DEFAULT_BANNER_URL;
    return mobile && banner.mobileImageUrl ? banner.mobileImageUrl : banner.desktopImageUrl;
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((banner, idx) => {
          const href = banner?.buttonUrl || null;
          const title = parseLang(banner?.title);
          const imageUrl = getSlideImage(banner);

          const slideContent = (
            <div className="relative w-full shrink-0" style={{ width: "100%" }}>
              {/* Desktop image */}
              <img
                src={imageUrl}
                alt={title || `Bannière Veloria ${idx + 1}`}
                className="w-full h-[40vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh] object-cover block"
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Click hint on hover */}
              {href && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2">
                    <span>Découvrir →</span>
                  </div>
                </div>
              )}
            </div>
          );

          return (
            <div key={banner?.id ?? "default"} className="w-full shrink-0">
              {href ? (
                <Link href={href} className="block cursor-pointer group">
                  {slideContent}
                </Link>
              ) : (
                <div className="block">{slideContent}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prev / Next arrows — only when multiple slides */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Bannière précédente"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Bannière suivante"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Aller à la bannière ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
