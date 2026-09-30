import React from "react";
import { getSiteSettings } from "@/lib/settings";
import { PublicPageWrapper } from "@/components/PublicPageWrapper";
import { SheinWizard } from "./SheinWizard";

export const revalidate = 60;

export default async function SheinConciergePage() {
  const settings = await getSiteSettings();

  return (
    <PublicPageWrapper settings={settings}>
      <div className="py-12 bg-gradient-to-b from-[var(--color-powder-pink)]/20 to-[var(--color-ivory)] min-h-[80vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rose-gold)]">
              Service VIP sur Mesure
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-rose-brown)]">
              Shein Concierge by Veloria
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-rose-brown)]/80 max-w-xl mx-auto">
              Ton panier Shein ? Envoie-nous simplement le lien, on s'occupe de tout l'achat & de la livraison chez toi en Tunisie !
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/80 border border-[var(--color-blush-pink)] text-[11px] font-medium text-[var(--color-rose-gold)] shadow-2xs">
              {settings.shein_notice?.fr || "Service indépendant, non affilié à Shein."}
            </div>
          </div>

          {/* Interactive Multi-step Wizard */}
          <SheinWizard exchangeRate={settings.exchange_rate_eur_tnd} />
        </div>
      </div>
    </PublicPageWrapper>
  );
}
