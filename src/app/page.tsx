import React from "react";
import Link from "next/link";
import { getSiteSettings, parseTranslatable } from "@/lib/settings";
import { db, schema } from "@/db";
import { ShipmentBanner } from "@/components/ShipmentBanner";
import { PublicPageWrapper } from "@/components/PublicPageWrapper";
import { HeroSlider } from "@/components/HeroSlider";
import { Sparkles, ShoppingBag, Send, Package, Truck, ArrowRight, Heart, Star, CheckCircle2 } from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  const settings = await getSiteSettings();

  // Fetch featured products
  const productsList = await db.query.products.findMany({
    where: (p, { eq }) => eq(p.status, "active"),
    limit: 6,
    orderBy: (p, { desc }) => [desc(p.id)],
  });

  // Fetch banners
  const bannersList = await db.query.banners.findMany({
    where: (b, { eq }) => eq(b.isActive, true),
    orderBy: (b, { asc }) => [asc(b.sortOrder)],
  });

  // Fetch reviews
  const reviewsList = await db.query.reviews.findMany({
    where: (r, { eq }) => eq(r.isApproved, true),
    limit: 4,
  });

  // bannersList is passed directly to the slider

  return (
    <PublicPageWrapper settings={settings}>
      {/* 1. Shipment Announcement Banner */}
      <ShipmentBanner nextShipment={settings.next_shipment} />

      {/* 2. Hero Slider */}
      <section className="w-full">
        <HeroSlider banners={bannersList} />
      </section>

            {/* 3. Three Access Portals Section */}
      <section className="py-16 bg-[var(--color-ivory)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rose-gold)]">
              Accès VIP Exclusifs
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--color-rose-brown)]">
              Comment souhaitez-vous commander ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Veloria Select */}
            <div className="group bg-white rounded-3xl p-8 border border-[var(--color-powder-pink)] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] flex items-center justify-center font-serif text-xl font-bold">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[var(--color-rose-brown)]">
                  Veloria Select
                </h3>
                <p className="text-xs text-[var(--color-rose-brown)]/80 leading-relaxed font-light">
                  Notre sélection d'articles de beauté, maquillage et accessoires disponibles tout de suite en stock.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/select"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-deep-rose-gold)] group-hover:text-[var(--color-rose-gold)] transition-colors"
                >
                  <span>Voir le catalogue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2: Shein Concierge */}
            <div className="group bg-white rounded-3xl p-8 border border-[var(--color-blush-pink)] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-blush-pink)] text-[var(--color-deep-rose-gold)] flex items-center justify-center font-serif text-xl font-bold">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[var(--color-rose-brown)]">
                  Shein Concierge
                </h3>
                <p className="text-xs text-[var(--color-rose-brown)]/80 leading-relaxed font-light">
                  Ton panier Shein ? Envoie-nous simplement le lien, on s'occupe de tout l'achat & de la livraison !
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/shein-concierge"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-deep-rose-gold)] group-hover:text-[var(--color-rose-gold)] transition-colors"
                >
                  <span>Envoyer mon panier</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 3: Special Order Germany */}
            <div className="group bg-white rounded-3xl p-8 border border-[var(--color-powder-pink)] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] flex items-center justify-center font-serif text-xl font-bold">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[var(--color-rose-brown)]">
                  Special Order Germany
                </h3>
                <p className="text-xs text-[var(--color-rose-brown)]/80 leading-relaxed font-light">
                  DM, Douglas, Sephora... on t'achète ce que tu veux directement dans les magasins en Allemagne.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/special-order"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-deep-rose-gold)] group-hover:text-[var(--color-rose-gold)] transition-colors"
                >
                  <span>Faire une demande</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products Showcase */}
      <section className="py-16 bg-gradient-to-b from-[var(--color-ivory)] via-[var(--color-powder-pink)]/20 to-[var(--color-ivory)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rose-gold)]">
                Sélection Coup de Cœur
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-rose-brown)]">
                Produits Populaires
              </h2>
            </div>
            <Link
              href="/select"
              className="text-xs font-bold text-[var(--color-deep-rose-gold)] hover:underline flex items-center gap-1"
            >
              <span>Tout voir ({productsList.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {productsList.map((product) => {
              const name = parseTranslatable(product.name);
              const badge = parseTranslatable(product.badgeText);
              const priceEur = (product.priceEur / 100).toFixed(2);
              const priceTnd = ((product.priceEur / 100) * settings.exchange_rate_eur_tnd).toFixed(2);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-[var(--color-powder-pink)] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
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
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[var(--color-rose-brown)] line-clamp-2">
                        {name}
                      </h3>
                      <p className="text-[11px] text-[var(--color-rose-brown)]/60 line-clamp-1 mt-0.5">
                        {parseTranslatable(product.shortDescription)}
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

                      <Link
                        href={`/select/${product.slug}`}
                        className="px-3 py-1.5 rounded-full bg-[var(--color-powder-pink)] hover:bg-[var(--color-deep-rose-gold)] text-[var(--color-deep-rose-gold)] hover:text-white text-[11px] font-semibold transition-colors"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works Steps */}
      <section className="py-16 bg-[var(--color-ivory)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rose-gold)]">
              Simplicité & Transparence
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--color-rose-brown)]">
              Comment ça marche ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[var(--color-powder-pink)] text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] font-bold flex items-center justify-center mx-auto text-sm">
                1
              </div>
              <h4 className="font-serif text-base font-bold text-[var(--color-rose-brown)]">
                Fais tes choix
              </h4>
              <p className="text-xs text-[var(--color-rose-brown)]/70">
                Choisis un produit du catalogue ou envoie-nous ton lien Shein / produit d'Allemagne.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[var(--color-powder-pink)] text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] font-bold flex items-center justify-center mx-auto text-sm">
                2
              </div>
              <h4 className="font-serif text-base font-bold text-[var(--color-rose-brown)]">
                Reçois ton devis
              </h4>
              <p className="text-xs text-[var(--color-rose-brown)]/70">
                Nous calculons le prix exact en TND avec les frais de service et de livraison.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[var(--color-powder-pink)] text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] font-bold flex items-center justify-center mx-auto text-sm">
                3
              </div>
              <h4 className="font-serif text-base font-bold text-[var(--color-rose-brown)]">
                Achat en Allemagne
              </h4>
              <p className="text-xs text-[var(--color-rose-brown)]/70">
                Notre équipe achète tes produits directement en Allemagne et prépare ton colis VIP.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[var(--color-powder-pink)] text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] font-bold flex items-center justify-center mx-auto text-sm">
                4
              </div>
              <h4 className="font-serif text-base font-bold text-[var(--color-rose-brown)]">
                Livraison en Tunisie
              </h4>
              <p className="text-xs text-[var(--color-rose-brown)]/70">
                Ton colis arrive chez toi en Tunisie en toute sécurité avec suivi par SMS & WhatsApp !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews Carousel */}
      <section className="py-16 bg-gradient-to-r from-[var(--color-powder-pink)]/30 via-[var(--color-ivory)] to-[var(--color-powder-pink)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rose-gold)]">
              Avis Clientèle
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--color-rose-brown)]">
              Ce que nos clientes disent
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reviewsList.length > 0 ? (
              reviewsList.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-3xl border border-[var(--color-powder-pink)] shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-1 text-[var(--color-soft-gold)]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--color-soft-gold)]" />
                    ))}
                  </div>
                  <p className="text-xs text-[var(--color-rose-brown)]/80 italic leading-relaxed">
                    "{parseTranslatable(review.content)}"
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-powder-pink)]/40">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-powder-pink)] text-[var(--color-deep-rose-gold)] font-bold flex items-center justify-center text-xs">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-rose-brown)]">
                        {review.customerName}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Commande vérifiée</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-xs text-[var(--color-rose-brown)]/70 py-6">
                « Service irréprochable ! Mon panier Shein est arrivé à Sousse super rapidement et l'emballage cadeau était magnifique. Merci Veloria ! »
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Instagram Feed Gallery */}
      <section className="py-16 bg-[var(--color-ivory)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rose-gold)] flex items-center justify-center gap-1">
              <InstagramIcon className="w-4 h-4" />
              <span>@veloria.tn</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-rose-brown)]">
              Rejoins notre communauté sur Instagram
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <a
              href="https://instagram.com/veloria.tn"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-xs"
            >
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400&auto=format&fit=crop"
                alt="Instagram Veloria"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <InstagramIcon className="w-6 h-6" />
              </div>
            </a>

            <a
              href="https://instagram.com/veloria.tn"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-xs"
            >
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop"
                alt="Instagram Veloria"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <InstagramIcon className="w-6 h-6" />
              </div>
            </a>

            <a
              href="https://instagram.com/veloria.tn"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-xs"
            >
              <img
                src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop"
                alt="Instagram Veloria"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <InstagramIcon className="w-6 h-6" />
              </div>
            </a>

            <a
              href="https://instagram.com/veloria.tn"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-xs"
            >
              <img
                src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400&auto=format&fit=crop"
                alt="Instagram Veloria"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <InstagramIcon className="w-6 h-6" />
              </div>
            </a>
          </div>
        </div>
      </section>
    </PublicPageWrapper>
  );
}
