"use client";

import React, { useState } from "react";
import { Plus, Trash2, Send, CheckCircle2, ArrowRight } from "lucide-react";

interface ProductRow {
  brandStore: string;
  productName: string;
  productUrl: string;
  quantity: number;
  notes: string;
}

export function SpecialOrderForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "Tunis",
    address: "",
  });

  const [items, setItems] = useState<ProductRow[]>([
    { brandStore: "DM Germany", productName: "", productUrl: "", quantity: 1, notes: "" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const addItemRow = () => {
    setItems([
      ...items,
      { brandStore: "DM Germany", productName: "", productUrl: "", quantity: 1, notes: "" },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItemRow = (index: number, field: keyof ProductRow, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) {
      alert("Veuillez remplir vos coordonnées (nom, téléphone, ville).");
      return;
    }

    const validItems = items.filter((i) => i.productName.trim().length > 0);
    if (validItems.length === 0) {
      alert("Veuillez ajouter au moins un produit.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "special",
          customerName: formData.name,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          items: validItems.map((item) => ({
            productName: `[${item.brandStore}] ${item.productName}`,
            productUrl: item.productUrl,
            quantity: item.quantity,
            itemNotes: item.notes,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReference(data.reference);
        setSubmitted(true);
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

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[var(--color-powder-pink)] shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-500">
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto animate-bounce" />
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-rose-brown)]">
          Demande reçue avec succès ! 🌸
        </h3>
        <p className="text-xs text-[var(--color-rose-brown)]/80 max-w-md mx-auto">
          Voici ta référence de commande spéciale :
        </p>

        <div className="inline-block px-6 py-3 bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] font-mono text-xl font-bold rounded-2xl border border-[var(--color-blush-pink)] shadow-inner">
          {reference}
        </div>

        <p className="text-xs text-[var(--color-rose-brown)]/70 max-w-sm mx-auto">
          Nos acheteurs en Allemagne vont vérifier la disponibilité de tes articles et t'envoyer un devis précis sous 24 à 48h sur WhatsApp !
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
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-[var(--color-powder-pink)] shadow-xl space-y-8">
      {/* Customer Contact */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-[var(--color-rose-brown)] border-b pb-2">
          1. Vos Coordonnées en Tunisie
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
              Nom complet *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
              placeholder="Ex: Syrine Khelifi"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
              Téléphone WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
              placeholder="Ex: 21620123456"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-rose-brown)] mb-1">
              Ville *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2.5 text-xs rounded-2xl border border-[var(--color-powder-pink)] bg-[var(--color-ivory)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
              placeholder="Ex: Tunis, Sousse..."
            />
          </div>
        </div>
      </div>

      {/* Repeatable Products Rows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-serif text-xl font-bold text-[var(--color-rose-brown)]">
            2. Articles demandés d'Allemagne
          </h3>
          <button
            type="button"
            onClick={addItemRow}
            className="px-3.5 py-1.5 rounded-full bg-[var(--color-powder-pink)] hover:bg-[var(--color-blush-pink)] text-[var(--color-deep-rose-gold)] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter un article</span>
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-[var(--color-ivory)]/50 rounded-2xl border border-[var(--color-powder-pink)] space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-deep-rose-gold)]">
                  Article #{idx + 1}
                </span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    className="text-rose-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[var(--color-rose-brown)] mb-1">
                    Magasin / Enseigne
                  </label>
                  <select
                    value={item.brandStore}
                    onChange={(e) => updateItemRow(idx, "brandStore", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-powder-pink)] bg-white"
                  >
                    <option value="DM Germany">DM Deutschland</option>
                    <option value="Douglas Germany">Douglas</option>
                    <option value="Sephora Germany">Sephora</option>
                    <option value="Rossmann">Rossmann</option>
                    <option value="Autre Magasin">Autre magasin / Pharmacie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[var(--color-rose-brown)] mb-1">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={item.productName}
                    onChange={(e) => updateItemRow(idx, "productName", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-powder-pink)] bg-white"
                    placeholder="Ex: Balea Med Ultra Sensitive..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[var(--color-rose-brown)] mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItemRow(idx, "quantity", parseInt(e.target.value, 10) || 1)
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-powder-pink)] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[var(--color-rose-brown)] mb-1">
                    Lien du produit (Optionnel)
                  </label>
                  <input
                    type="url"
                    value={item.productUrl}
                    onChange={(e) => updateItemRow(idx, "productUrl", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-powder-pink)] bg-white"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[var(--color-rose-brown)] mb-1">
                    Précision (Teinte, contenance...)
                  </label>
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateItemRow(idx, "notes", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-powder-pink)] bg-white"
                    placeholder="Ex: Teinte 02, Flacon 100ml..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-full bg-[var(--color-deep-rose-gold)] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-rose-gold)] transition-colors shadow-lg disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>{isSubmitting ? "Envoi de la demande..." : "Envoyer ma demande d'Allemagne"}</span>
      </button>
    </form>
  );
}
