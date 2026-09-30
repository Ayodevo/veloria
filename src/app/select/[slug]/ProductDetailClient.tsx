"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Send, CheckCircle2, Truck, ShieldCheck, Gift } from "lucide-react";

interface ProductDetailClientProps {
  product: any;
  variants: any[];
  brand?: any;
  exchangeRate: number;
  whatsappNumber: string;
}

export function ProductDetailClient({
  product,
  variants,
  brand,
  exchangeRate,
  whatsappNumber,
}: ProductDetailClientProps) {
  const { getTrans } = useLanguage();
  const { addToCart, wishlist, toggleWishlist, isWishlisted } = useCart();

  const gallery = JSON.parse(product.galleryUrls || "[]");
  const images = gallery.length > 0 ? gallery : [product.mainImageUrl];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const name = getTrans(product.name);
  const description = getTrans(product.description);
  const shortDesc = getTrans(product.shortDescription);
  const badge = getTrans(product.badgeText);
  const priceEur = ((selectedVariant?.priceEur || product.priceEur) / 100).toFixed(2);
  const priceTnd = (((selectedVariant?.priceEur || product.priceEur) / 100) * exchangeRate).toFixed(2);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      name,
      variantName: selectedVariant ? getTrans(selectedVariant.name) : undefined,
      priceEur: selectedVariant?.priceEur || product.priceEur,
      imageUrl: selectedImage || product.mainImageUrl,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
    const variantStr = selectedVariant ? ` (${getTrans(selectedVariant.name)})` : "";
    const text = `Bonjour Veloria ! 🌸 Je souhaite commander le produit :\n\n*${name}*${variantStr}\nQuantité: ${quantity}\nPrix: ${priceEur} € (~${priceTnd} TND)\nLien: ${window.location.href}`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[var(--color-powder-pink)] shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Gallery Section */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-[var(--color-ivory)] border border-[var(--color-powder-pink)] shadow-xs">
          <img
            src={selectedImage}
            alt={name}
            className="w-full h-full object-cover"
          />
          {badge && (
            <span className="absolute top-4 left-4 bg-[var(--color-soft-gold)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
              {badge}
            </span>
          )}
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-[var(--color-rose-brown)] hover:text-rose-500 transition-colors shadow-sm"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedImage === img
                    ? "border-[var(--color-deep-rose-gold)] shadow-xs"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details & Purchase Form */}
      <div className="space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          {brand && (
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rose-gold)]">
              {brand.name}
            </span>
          )}

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--color-rose-brown)]">
            {name}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--color-rose-brown)]/80 leading-relaxed font-light">
            {shortDesc || description}
          </p>

          {/* Pricing Box */}
          <div className="p-4 bg-[var(--color-powder-pink)]/30 rounded-2xl border border-[var(--color-blush-pink)]/60 flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-[var(--color-deep-rose-gold)] font-serif block">
                {priceEur} €
              </span>
              <span className="text-xs text-[var(--color-rose-brown)]/70 font-medium">
                Prix estimé : ~ {priceTnd} TND
              </span>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>En Stock</span>
              </span>
            </div>
          </div>

          {/* Variant Selector */}
          {variants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--color-rose-brown)]">
                Choisir la variante :
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const vName = getTrans(v.name);
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 text-xs rounded-xl font-medium border transition-all ${
                        isSelected
                          ? "bg-[var(--color-deep-rose-gold)] text-white border-[var(--color-deep-rose-gold)] shadow-xs"
                          : "bg-white text-[var(--color-rose-brown)] border-[var(--color-powder-pink)] hover:bg-[var(--color-powder-pink)]/40"
                      }`}
                    >
                      {vName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <label className="text-xs font-bold text-[var(--color-rose-brown)]">Quantité :</label>
            <div className="flex items-center gap-3 bg-[var(--color-ivory)] border border-[var(--color-powder-pink)] rounded-full px-3 py-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-xs font-bold px-1"
              >
                -
              </button>
              <span className="text-xs font-bold w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-xs font-bold px-1"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-6 border-t border-[var(--color-powder-pink)]">
          <button
            onClick={handleAddToCart}
            className={`w-full py-3.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[var(--color-deep-rose-gold)] hover:bg-[var(--color-rose-gold)] text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{added ? "Ajouté au panier !" : "Ajouter au Panier"}</span>
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Commander directement via WhatsApp</span>
          </button>

          <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] text-[var(--color-rose-brown)]/80">
            <div className="flex items-center gap-2 bg-[var(--color-ivory)] p-2.5 rounded-xl border border-[var(--color-powder-pink)]">
              <Truck className="w-4 h-4 text-[var(--color-rose-gold)]" />
              <span>Livraison 5-10j partout en Tunisie</span>
            </div>
            <div className="flex items-center gap-2 bg-[var(--color-ivory)] p-2.5 rounded-xl border border-[var(--color-powder-pink)]">
              <Gift className="w-4 h-4 text-[var(--color-rose-gold)]" />
              <span>Emballage cadeau sur demande</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
