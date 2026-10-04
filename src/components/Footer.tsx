"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Heart, Send, Check } from "lucide-react";

interface FooterProps {
  siteName?: string;
  logoUrl?: string;
  tagline?: { fr: string; ar: string };
  slogan?: { fr: string; ar: string };
  sheinNotice?: { fr: string; ar: string };
}

export function Footer({
  siteName = "VELORIA",
  logoUrl = "/logo.png",
  tagline,
  slogan,
  sheinNotice,
}: FooterProps) {
  const { t, getTrans } = useLanguage();
  const [subscriberInput, setSubscriberInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberInput) return;
    setSubscribed(true);
    setSubscriberInput("");
  };

  return (
    <footer className="bg-[var(--color-ivory)] border-t border-[var(--color-powder-pink)] pt-16 pb-24 md:pb-12 text-[var(--color-rose-brown)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block group">
              <img
                src={logoUrl || "/logo.png"}
                alt={siteName || "VELORIA"}
                className="h-20 sm:h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                style={{
                  filter: "brightness(1.15) contrast(1.05) drop-shadow(0 2px 12px rgba(180,80,110,0.35))",
                }}
              />
            </Link>
            <p className="text-xs font-serif italic text-[var(--color-rose-gold)]">
              "{slogan ? getTrans(slogan) : "Un petit luxe, rien que pour toi."}"
            </p>
            <p className="text-[11px] text-[var(--color-rose-brown)]/70 leading-relaxed">
              {sheinNotice
                ? getTrans(sheinNotice)
                : "Service indépendant, non affilié à Shein."}
            </p>
          </div>

          {/* Navigation Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-deep-rose-gold)]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[var(--color-rose-gold)] transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/select" className="hover:text-[var(--color-rose-gold)] transition-colors">
                  {t("nav.select")}
                </Link>
              </li>
              <li>
                <Link href="/shein-concierge" className="hover:text-[var(--color-rose-gold)] transition-colors">
                  {t("nav.shein")}
                </Link>
              </li>
              <li>
                <Link href="/special-order" className="hover:text-[var(--color-rose-gold)] transition-colors">
                  {t("nav.special")}
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-[var(--color-rose-gold)] transition-colors">
                  {t("nav.tracking")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Service & Aide Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-deep-rose-gold)]">
              Service Client
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/faq" className="hover:text-[var(--color-rose-gold)] transition-colors">
                  FAQ & Questions
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-[var(--color-rose-gold)] transition-colors">
                  Suivre ma commande
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-[var(--color-rose-gold)] hover:underline">
                  {t("nav.admin")} (Propriétaire)
                </Link>
              </li>
            </ul>
          </div>

          {/* VIP Broadcast Signup Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-deep-rose-gold)] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-soft-gold)]" />
              <span>Newsletter & WhatsApp VIP</span>
            </h4>
            <p className="text-xs text-[var(--color-rose-brown)]/80">
              Sois la première informée des arrivages d'Allemagne & sessions de livraison !
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Inscription réussie ! Bienvenue dans le club VIP.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Email ou numéro WhatsApp..."
                    value={subscriberInput}
                    onChange={(e) => setSubscriberInput(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 text-xs rounded-2xl border border-[var(--color-blush-pink)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1.5 rounded-xl bg-[var(--color-deep-rose-gold)] text-white hover:bg-[var(--color-rose-gold)] transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Separator with central Butterfly/Sparkle symbol */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-blush-pink)]/40" />
          </div>
          <div className="relative bg-[var(--color-ivory)] px-4 text-[var(--color-rose-gold)] flex items-center gap-2 text-xs font-serif">
            <span>✦</span>
            <Heart className="w-3.5 h-3.5 fill-[var(--color-blush-pink)] text-[var(--color-rose-gold)]" />
            <span>✦</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-rose-brown)]/70 gap-4">
          <p>{t("footer.rights")}</p>
          <div className="flex gap-4">
            <span className="hover:text-[var(--color-rose-gold)]">Tunisie & Allemagne</span>
            <span>·</span>
            <span className="hover:text-[var(--color-rose-gold)]">Paiement sécurisé à la livraison</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
