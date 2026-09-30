"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Clock } from "lucide-react";

interface ShipmentBannerProps {
  nextShipment?: {
    date: string; // YYYY-MM-DD
    deadline: string;
    isCountdownEnabled: boolean;
    textFr: string;
    textAr: string;
  };
}

export function ShipmentBanner({ nextShipment }: ShipmentBannerProps) {
  const { locale, getTrans } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!nextShipment?.date || !nextShipment.isCountdownEnabled) return;

    const targetDate = new Date(`${nextShipment.date}T23:59:59`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextShipment]);

  if (!nextShipment) return null;

  const text =
    locale === "ar"
      ? nextShipment.textAr || "الدفعة القادمة قريباً!"
      : nextShipment.textFr || "Prochain envoi vers la Tunisie bientôt !";

  return (
    <div className="bg-gradient-to-r from-[var(--color-rose-gold)] via-[var(--color-deep-rose-gold)] to-[var(--color-rose-gold)] text-white text-xs sm:text-sm py-2 px-4 shadow-sm relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 font-medium tracking-wide">
          <Sparkles className="w-4 h-4 text-[var(--color-soft-gold)] animate-pulse" />
          <span>{text}</span>
        </div>

        {nextShipment.isCountdownEnabled && (
          <div className="flex items-center gap-1.5 font-mono text-[11px] bg-black/15 px-3 py-1 rounded-full border border-white/20">
            <Clock className="w-3.5 h-3.5 text-[var(--color-powder-pink)]" />
            <span className="font-semibold">{timeLeft.days}d</span>
            <span>:</span>
            <span className="font-semibold">{String(timeLeft.hours).padStart(2, "0")}h</span>
            <span>:</span>
            <span className="font-semibold">{String(timeLeft.minutes).padStart(2, "0")}m</span>
            <span>:</span>
            <span className="font-semibold">{String(timeLeft.seconds).padStart(2, "0")}s</span>
          </div>
        )}
      </div>
    </div>
  );
}
