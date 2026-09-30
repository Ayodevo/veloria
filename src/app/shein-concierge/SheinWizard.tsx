"use client";

import React, { useState } from "react";
import { User, Link as LinkIcon, FileText, CheckCircle2, ArrowRight, ArrowLeft, Upload, Sparkles } from "lucide-react";

interface SheinWizardProps {
  exchangeRate: number;
}

export function SheinWizard({ exchangeRate }: SheinWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "Tunis",
    address: "",
    cartUrl: "",
    screenshotUrl: "",
    notes: "",
    promoCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "shein",
          customerName: formData.name,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          notes: formData.notes,
          promoCode: formData.promoCode,
          items: [
            {
              productName: "Panier Shein Concierge",
              productUrl: formData.cartUrl,
              screenshotUrl: formData.screenshotUrl,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReference(data.reference);
        setStep(4); // Success step
      } else {
        alert(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion lors de l'envoi de la demande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[var(--color-powder-pink)] shadow-xl space-y-8">
      {/* Wizard Progress Steps Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-between border-b border-[var(--color-powder-pink)] pb-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1
                  ? "bg-[var(--color-deep-rose-gold)] text-white"
                  : "bg-[var(--color-ivory)] text-[var(--color-rose-brown)] border border-[var(--color-powder-pink)]"
              }`}
            >
              1
            </div>
            <span className="text-xs font-bold text-[var(--color-rose-brown)] hidden sm:inline">
              Coordonnées
            </span>
          </div>

          <div className="h-0.5 flex-1 mx-4 bg-[var(--color-powder-pink)]" />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2
                  ? "bg-[var(--color-deep-rose-gold)] text-white"
                  : "bg-[var(--color-ivory)] text-[var(--color-rose-brown)] border border-[var(--color-powder-pink)]"
              }`}
            >
              2
            </div>
            <span className="text-xs font-bold text-[var(--color-rose-brown)] hidden sm:inline">
              Panier Shein
            </span>
          </div>

          <div className="h-0.5 flex-1 mx-4 bg-[var(--color-powder-pink)]" />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 3
                  ? "bg-[var(--color-deep-rose-gold)] text-white"
                  : "bg-[var(--color-ivory)] text-[var(--color-rose-brown)] border border-[var(--color-powder-pink)]"
              }`}
            >
              3
            </div>
            <span className="text-xs font-bold text-[var(--color-rose-brown)] hidden sm:inline">
              Validation
            </span>
          </div>
        </div>
      )}

      {/* Step 1: Contact Info */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[var(--color-rose-brown)]">
              Étape 1 : Vos Coordonnées
            </h3>
            <p className="text-xs text-[var(--color-rose-brown)]/70">
              Où souhaitez-vous recevoir votre livraison et votre devis WhatsApp ?
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                placeholder="Ex: Amina Ben Salem"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
                Numéro WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                placeholder="Ex: 21620123456"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
                Ville en Tunisie *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                placeholder="Ex: Tunis, Sousse, Sfax, Bizerte..."
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!formData.name || !formData.phone || !formData.city) {
                alert("Veuillez remplir votre nom, téléphone et ville.");
                return;
              }
              setStep(2);
            }}
            className="w-full py-3.5 rounded-full bg-[var(--color-deep-rose-gold)] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-rose-gold)] transition-colors shadow-md"
          >
            <span>Continuer vers l'étape 2</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Shein Cart Link & Screenshot */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[var(--color-rose-brown)]">
              Étape 2 : Lien ou Capture de ton Panier Shein
            </h3>
            <p className="text-xs text-[var(--color-rose-brown)]/70">
              Colle le lien de ton panier Shein ou l'URL d'une capture d'écran de tes articles.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
                Lien du panier Shein (Share Cart Link) *
              </label>
              <input
                type="url"
                required
                value={formData.cartUrl}
                onChange={(e) => setFormData({ ...formData, cartUrl: e.target.value })}
                className="w-full px-4 py-3 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                placeholder="https://shein.com/cart/share/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
                URL Capture d'écran (Optionnel)
              </label>
              <input
                type="text"
                value={formData.screenshotUrl}
                onChange={(e) => setFormData({ ...formData, screenshotUrl: e.target.value })}
                className="w-full px-4 py-3 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                placeholder="Lien d'image de ta capture..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3.5 rounded-full border border-[var(--color-rose-gold)] text-[var(--color-rose-gold)] text-xs font-bold hover:bg-[var(--color-ivory)]"
            >
              Précédent
            </button>
            <button
              type="button"
              onClick={() => {
                if (!formData.cartUrl) {
                  alert("Veuillez coller le lien de votre panier Shein.");
                  return;
                }
                setStep(3);
              }}
              className="w-2/3 py-3.5 rounded-full bg-[var(--color-deep-rose-gold)] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-rose-gold)] transition-colors shadow-md"
            >
              <span>Continuer vers la validation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Notes & Final Submission */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[var(--color-rose-brown)]">
              Étape 3 : Notes & Confirmation
            </h3>
            <p className="text-xs text-[var(--color-rose-brown)]/70">
              Précise tes tailles, couleurs ou instructions particulières pour ton panier.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
                Instructions particulières (Tailles, couleurs, remarques)
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                placeholder="Ex: Robe noire en taille M, haut rose en S..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
                Code Promo (Optionnel)
              </label>
              <input
                type="text"
                value={formData.promoCode}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                className="w-full px-4 py-3 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                placeholder="Code réduction..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/3 py-3.5 rounded-full border border-[var(--color-rose-gold)] text-[var(--color-rose-gold)] text-xs font-bold hover:bg-[var(--color-ivory)]"
            >
              Précédent
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-3.5 rounded-full bg-[var(--color-deep-rose-gold)] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-rose-gold)] transition-colors shadow-md disabled:opacity-50"
            >
              <span>{isSubmitting ? "Envoi en cours..." : "Envoyer ma demande Shein"}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Success Screen with Reference */}
      {step === 4 && (
        <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-500">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-rose-brown)]">
              Demande reçue avec succès ! 🌸
            </h3>
            <p className="text-xs text-[var(--color-rose-brown)]/80 max-w-md mx-auto">
              Voici ton numéro de référence unique pour le suivi :
            </p>
          </div>

          <div className="inline-block px-6 py-3 bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] font-mono text-xl font-bold rounded-2xl border border-[var(--color-blush-pink)] shadow-inner">
            {reference}
          </div>

          <p className="text-xs text-[var(--color-rose-brown)]/70 max-w-sm mx-auto">
            Notre équipe va calculer ton devis personnalisé (frais de service + transport) et te l'envoyer sur WhatsApp dans les 24h !
          </p>

          <div className="pt-4">
            <a
              href={`/tracking?ref=${reference}&phone=${encodeURIComponent(formData.phone)}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--color-deep-rose-gold)] text-white text-xs font-bold shadow-lg hover:bg-[var(--color-rose-gold)] transition-all"
            >
              <span>Suivre ma demande</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
