import React from "react";
import { notFound } from "next/navigation";
import { getSiteSettings, parseTranslatable } from "@/lib/settings";
import { db } from "@/db";
import { PublicPageWrapper } from "@/components/PublicPageWrapper";
import { ProductDetailClient } from "./ProductDetailClient";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const settings = await getSiteSettings();

  const product = await db.query.products.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
  });

  if (!product) {
    notFound();
  }

  // Fetch variants
  const variants = await db.query.productVariants.findMany({
    where: (v, { eq }) => eq(v.productId, product.id),
  });

  // Fetch brand if linked
  let brand = null;
  if (product.brandId) {
    brand = await db.query.brands.findFirst({
      where: (b, { eq }) => eq(b.id, product.brandId!),
    });
  }

  return (
    <PublicPageWrapper settings={settings}>
      <div className="py-12 bg-gradient-to-b from-[var(--color-powder-pink)]/10 to-[var(--color-ivory)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDetailClient
            product={product}
            variants={variants}
            brand={brand}
            exchangeRate={settings.exchange_rate_eur_tnd}
            whatsappNumber={settings.whatsapp_number}
          />
        </div>
      </div>
    </PublicPageWrapper>
  );
}
