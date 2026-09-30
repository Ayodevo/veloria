import React from "react";
import { getSiteSettings } from "@/lib/settings";
import { PublicPageWrapper } from "@/components/PublicPageWrapper";
import { TrackingView } from "./TrackingView";

export const revalidate = 0; // Dynamic tracking page

export default async function TrackingPage() {
  const settings = await getSiteSettings();

  return (
    <PublicPageWrapper settings={settings}>
      <div className="py-12 bg-gradient-to-b from-[var(--color-powder-pink)]/20 to-[var(--color-ivory)] min-h-[80vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rose-gold)]">
              Espace Client & Suivi
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-rose-brown)]">
              Suivi de Commande
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-rose-brown)]/80 max-w-md mx-auto">
              Entre ton numéro de référence et ton téléphone pour suivre l'avancement de ton colis en temps réel.
            </p>
          </div>

          <TrackingView />
        </div>
      </div>
    </PublicPageWrapper>
  );
}
