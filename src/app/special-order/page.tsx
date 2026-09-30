import React from "react";
import { getSiteSettings } from "@/lib/settings";
import { PublicPageWrapper } from "@/components/PublicPageWrapper";
import { SpecialOrderForm } from "./SpecialOrderForm";

export const revalidate = 60;

export default async function SpecialOrderPage() {
  const settings = await getSiteSettings();

  return (
    <PublicPageWrapper settings={settings}>
      <div className="py-12 bg-gradient-to-b from-[var(--color-powder-pink)]/20 to-[var(--color-ivory)] min-h-[80vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rose-gold)]">
              Achats sur Mesure en Allemagne
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-rose-brown)]">
              Special Order Germany
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-rose-brown)]/80 max-w-xl mx-auto">
              DM, Douglas, Sephora, Rossmann... dis-nous ce que tu veux acheter en Allemagne, on se charge de le trouver et te le livrer !
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/80 border border-[var(--color-blush-pink)] text-[11px] font-medium text-[var(--color-rose-gold)] shadow-2xs">
              {settings.special_order_notice?.fr || "Sous réserve de disponibilité et conditions de transport."}
            </div>
          </div>

          {/* Interactive Multi-item Form */}
          <SpecialOrderForm />
        </div>
      </div>
    </PublicPageWrapper>
  );
}
