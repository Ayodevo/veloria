"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { X, Trash2, Plus, Minus, Gift, ShoppingBag, Send, CheckCircle2, ArrowRight } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exchangeRate?: number;
  whatsappNumber?: string;
  orderMode?: "cart" | "whatsapp";
}

export function CartDrawer({
  isOpen,
  onClose,
  exchangeRate = 3.45,
  whatsappNumber = "21620123456",
  orderMode = "cart",
}: CartDrawerProps) {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isGiftWrapped,
    setIsGiftWrapped,
    totalEurCents,
  } = useCart();
  const { locale, t } = useLanguage();

  const [step, setStep] = useState<"cart" | "form" | "success">("cart");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "Tunis",
    address: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  if (!isOpen) return null;

  const totalEur = totalEurCents / 100;
  const giftWrapFeeTnd = isGiftWrapped ? 5 : 0;
  const totalTnd = (totalEur * exchangeRate + giftWrapFeeTnd).toFixed(2);

  const handleWhatsAppOrder = () => {
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
    let text = `Bonjour Veloria ! 🌸 Je souhaite commander les articles suivants :\n\n`;

    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.name}* (x${item.quantity}) - ${(
        (item.priceEur * item.quantity) /
        100
      ).toFixed(2)} €\n`;
    });

    if (isGiftWrapped) {
      text += `\n🎁 *Emballage cadeau inclus* (+5 TND)`;
    }

    text += `\n\n💰 *Total estimé :* ${totalEur.toFixed(2)} € (~${totalTnd} TND)`;
    text += `\n\nMerci de me donner les détails de confirmation !`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "select",
          customerName: formData.name,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          notes: formData.notes,
          isGiftWrapped,
          items: cart.map((item) => ({
            productName: item.name,
            quantity: item.quantity,
            priceEur: item.priceEur,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderRef(data.reference);
        setStep("success");
        clearCart();
      } else {
        alert(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--color-ivory)] shadow-2xl flex flex-col justify-between border-l border-[var(--color-powder-pink)]">
          {/* Header */}
          <div className="px-6 py-5 bg-[var(--color-powder-pink)]/40 border-b border-[var(--color-powder-pink)] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--color-deep-rose-gold)] font-serif text-lg font-bold">
              <ShoppingBag className="w-5 h-5" />
              <span>{t("cart.title")}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[var(--color-rose-brown)] hover:bg-white/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {step === "cart" && (
              <>
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-[var(--color-blush-pink)] mx-auto opacity-60" />
                    <p className="text-sm text-[var(--color-rose-brown)]/80">
                      {t("cart.empty")}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Cart list */}
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={`${item.productId}-${item.variantId || 0}`}
                          className="flex gap-4 p-3 bg-white rounded-2xl border border-[var(--color-powder-pink)] shadow-2xs"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl border border-[var(--color-powder-pink)]"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs font-semibold text-[var(--color-rose-brown)] line-clamp-1">
                                {item.name}
                              </h4>
                              {item.variantName && (
                                <p className="text-[11px] text-[var(--color-rose-gold)]">
                                  {item.variantName}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-bold text-[var(--color-deep-rose-gold)]">
                                {(item.priceEur / 100).toFixed(2)} €
                              </span>

                              <div className="flex items-center gap-2 bg-[var(--color-ivory)] border border-[var(--color-powder-pink)] rounded-full px-2 py-0.5">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1,
                                      item.variantId
                                    )
                                  }
                                  className="text-[var(--color-rose-brown)] hover:text-[var(--color-rose-gold)]"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold w-4 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity + 1,
                                      item.variantId
                                    )
                                  }
                                  className="text-[var(--color-rose-brown)] hover:text-[var(--color-rose-gold)]"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() =>
                                  removeFromCart(item.productId, item.variantId)
                                }
                                className="text-rose-400 hover:text-rose-600 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Gift wrap option */}
                    <div className="p-4 bg-[var(--color-powder-pink)]/30 rounded-2xl border border-[var(--color-blush-pink)]/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-[var(--color-deep-rose-gold)]" />
                        <div>
                          <p className="text-xs font-bold text-[var(--color-rose-brown)]">
                            Emballage cadeau Veloria (+5 TND)
                          </p>
                          <p className="text-[10px] text-[var(--color-rose-brown)]/70">
                            Boîte rose, ruban en satin & carte de remerciement
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isGiftWrapped}
                        onChange={(e) => setIsGiftWrapped(e.target.checked)}
                        className="w-4 h-4 accent-[var(--color-deep-rose-gold)] rounded-sm cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {step === "form" && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--color-rose-brown)] border-b pb-2">
                  Informations de livraison en Tunisie
                </h3>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-rose-brown)] mb-1">
                    {t("form.name")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-powder-pink)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                    placeholder="Ex: Syrine Khelifi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-rose-brown)] mb-1">
                    {t("form.phone")} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-powder-pink)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                    placeholder="Ex: 21620123456"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-rose-brown)] mb-1">
                    {t("form.city")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-powder-pink)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                    placeholder="Ex: Tunis, Sousse, Sfax..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-rose-brown)] mb-1">
                    {t("form.address")}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-powder-pink)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                    placeholder="Adresse exacte..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-rose-brown)] mb-1">
                    {t("form.notes")}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-powder-pink)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
                    placeholder="Instructions particulières..."
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="w-1/3 py-2.5 text-xs font-semibold rounded-2xl border border-[var(--color-rose-gold)] text-[var(--color-rose-gold)] hover:bg-white"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-2.5 text-xs font-semibold rounded-2xl bg-[var(--color-deep-rose-gold)] text-white hover:bg-[var(--color-rose-gold)] transition-colors shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? "Envoi..." : "Confirmer la commande"}
                  </button>
                </div>
              </form>
            )}

            {step === "success" && (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold font-serif text-[var(--color-rose-brown)]">
                  Merci pour ta commande ! 🌸
                </h3>
                <p className="text-xs text-[var(--color-rose-brown)]/80 max-w-xs mx-auto">
                  Ta référence de suivi est :
                </p>
                <div className="inline-block px-4 py-2 bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] font-mono text-base font-bold rounded-xl border border-[var(--color-blush-pink)] shadow-inner">
                  {orderRef}
                </div>
                <p className="text-[11px] text-[var(--color-rose-brown)]/70">
                  Notre équipe va vérifier tes articles et te contacter par WhatsApp sous 24h.
                </p>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setStep("cart");
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-full bg-[var(--color-deep-rose-gold)] text-white text-xs font-bold shadow-md hover:bg-[var(--color-rose-gold)]"
                  >
                    Fermer & Continuer le shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && step === "cart" && (
            <div className="p-6 bg-white border-t border-[var(--color-powder-pink)] space-y-3">
              <div className="flex justify-between items-center text-xs text-[var(--color-rose-brown)]">
                <span>Total en Euro :</span>
                <span className="font-bold">{totalEur.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-[var(--color-deep-rose-gold)]">
                <span>{t("cart.total")} (TND) :</span>
                <span className="text-base font-serif">~ {totalTnd} TND</span>
              </div>
              <p className="text-[10px] text-[var(--color-rose-brown)]/60 text-center">
                Taux de change : 1 EUR = {exchangeRate} TND · Paiement à la confirmation
              </p>

              {orderMode === "whatsapp" ? (
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{t("cart.whatsapp_order")}</span>
                </button>
              ) : (
                <button
                  onClick={() => setStep("form")}
                  className="w-full py-3 rounded-full bg-[var(--color-deep-rose-gold)] hover:bg-[var(--color-rose-gold)] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <span>{t("cart.checkout")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
