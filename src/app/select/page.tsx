import React from "react";
import { getSiteSettings, parseTranslatable } from "@/lib/settings";
import { db } from "@/db";
import { PublicPageWrapper } from "@/components/PublicPageWrapper";
import { ProductGrid } from "./ProductGrid";

export const revalidate = 60;

export default async function SelectCataloguePage() {
  const settings = await getSiteSettings();

  const categories = await db.query.categories.findMany({
    where: (c, { eq }) => eq(c.isVisible, true),
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  });

  const products = await db.query.products.findMany({
    where: (p, { eq }) => eq(p.status, "active"),
    orderBy: (p, { desc }) => [desc(p.id)],
  });

  return (
    <PublicPageWrapper settings={settings}>
      <div className="py-12 bg-gradient-to-b from-[var(--color-powder-pink)]/20 to-[var(--color-ivory)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rose-gold)]">
              Catalogue Officiel
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--color-rose-brown)]">
              Veloria Select
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-rose-brown)]/80">
              Notre sélection exclusive de soins, maquillage et parfums disponibles immédiatement en stock.
            </p>
          </div>

          {/* Interactive Client Product Grid */}
          <ProductGrid
            initialProducts={products}
            categories={categories}
            exchangeRate={settings.exchange_rate_eur_tnd}
          />
        </div>
      </div>
    </PublicPageWrapper>
  );
}
