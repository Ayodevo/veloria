"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { Search, Heart, Sparkles, SlidersHorizontal } from "lucide-react";

interface ProductGridProps {
  initialProducts: any[];
  categories: any[];
  exchangeRate: number;
}

export function ProductGrid({
  initialProducts,
  categories,
  exchangeRate,
}: ProductGridProps) {
  const { getTrans } = useLanguage();
  const { wishlist, toggleWishlist, isWishlisted, addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        const name = getTrans(product.name).toLowerCase();
        const matchesSearch = name.includes(searchQuery.toLowerCase());
        const matchesCat =
          selectedCategory === null || product.categoryId === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.priceEur - b.priceEur;
        if (sortBy === "price-desc") return b.priceEur - a.priceEur;
        return b.id - a.id;
      });
  }, [initialProducts, searchQuery, selectedCategory, sortBy, getTrans]);

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search, Category Chips, Sort */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[var(--color-powder-pink)] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-full border border-[var(--color-powder-pink)] bg-[var(--color-ivory)] focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-gold)]"
            />
            <Search className="w-4 h-4 text-[var(--color-rose-gold)] absolute left-3 top-3" />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-[var(--color-rose-gold)]" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs rounded-full border border-[var(--color-powder-pink)] bg-[var(--color-ivory)] text-[var(--color-rose-brown)] focus:outline-none"
            >
              <option value="newest">Nouveautés</option>
              <option value="price-asc">Prix : croissant</option>
              <option value="price-desc">Prix : décroissant</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === null
                ? "bg-[var(--color-deep-rose-gold)] text-white shadow-xs"
                : "bg-[var(--color-ivory)] text-[var(--color-rose-brown)] border border-[var(--color-powder-pink)] hover:bg-[var(--color-powder-pink)]/50"
            }`}
          >
            Tous les produits
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-[var(--color-deep-rose-gold)] text-white shadow-xs"
                  : "bg-[var(--color-ivory)] text-[var(--color-rose-brown)] border border-[var(--color-powder-pink)] hover:bg-[var(--color-powder-pink)]/50"
              }`}
            >
              {getTrans(cat.name)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[var(--color-powder-pink)] space-y-3">
          <Sparkles className="w-10 h-10 text-[var(--color-blush-pink)] mx-auto opacity-50" />
          <p className="text-sm text-[var(--color-rose-brown)] font-medium">
            Aucun produit ne correspond à ta recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const name = getTrans(product.name);
            const badge = getTrans(product.badgeText);
            const priceEur = (product.priceEur / 100).toFixed(2);
            const priceTnd = (
              (product.priceEur / 100) *
              exchangeRate
            ).toFixed(2);
            const wishlisted = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden border border-[var(--color-powder-pink)] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-[var(--color-ivory)]">
                  <img
                    src={product.mainImageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {badge && (
                    <span className="absolute top-3 left-3 bg-[var(--color-soft-gold)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      {badge}
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-xs text-[var(--color-rose-brown)] hover:text-rose-500 transition-colors shadow-xs"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlisted ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--color-rose-brown)] line-clamp-2">
                      {name}
                    </h3>
                    <p className="text-[11px] text-[var(--color-rose-brown)]/60 line-clamp-1 mt-0.5">
                      {getTrans(product.shortDescription)}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[var(--color-powder-pink)]/40">
                    <div>
                      <span className="text-xs font-bold text-[var(--color-deep-rose-gold)] block">
                        {priceEur} €
                      </span>
                      <span className="text-[10px] text-[var(--color-rose-brown)]/60">
                        ~ {priceTnd} TND
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          addToCart({
                            productId: product.id,
                            name,
                            priceEur: product.priceEur,
                            imageUrl: product.mainImageUrl,
                            quantity: 1,
                          })
                        }
                        className="px-2.5 py-1 rounded-full bg-[var(--color-deep-rose-gold)] text-white text-[11px] font-semibold hover:bg-[var(--color-rose-gold)] transition-colors shadow-2xs"
                      >
                        + Panier
                      </button>

                      <Link
                        href={`/select/${product.slug}`}
                        className="px-2.5 py-1 rounded-full bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] text-[11px] font-semibold hover:bg-[var(--color-blush-pink)] transition-colors"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
