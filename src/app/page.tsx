import React from "react";
import Link from "next/link";
import { getSiteSettings, parseTranslatable } from "@/lib/settings";
import { db } from "@/db";
import { PublicPageWrapper } from "@/components/PublicPageWrapper";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  ShoppingBag,
  Send,
  Package,
  Truck,
  ArrowRight,
  Star,
  CheckCircle2,
  Shield,
  Heart,
  Gift,
} from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";

export const revalidate = 60;

export default async function HomePage() {
  const settings = await getSiteSettings();

  // ── DB data (graceful fallback if DB is unreachable) ──────────────
  let productsList: Awaited<ReturnType<typeof db.query.products.findMany>> = [];
  let reviewsList: Awaited<ReturnType<typeof db.query.reviews.findMany>> = [];

  try {
    [productsList, reviewsList] = await Promise.all([
      db.query.products.findMany({
        where: (p, { eq }) => eq(p.status, "active"),
        limit: 8,
        orderBy: (p, { desc }) => [desc(p.id)],
      }),
      db.query.reviews.findMany({
        where: (r, { eq }) => eq(r.isApproved, true),
        limit: 4,
      }),
    ]);
  } catch {
    // DB offline in dev — use empty arrays, page still renders
  }

  // ── Settings-driven values ────────────────────────────────────────
  const siteTagline = settings.site_tagline?.fr ?? "Beauty · Fashion · Lifestyle";
  const siteSlogan  = settings.site_slogan?.fr  ?? "Un petit luxe, rien que pour toi.";
  const instagramUrl = settings.instagram_url ?? "https://instagram.com/veloria.tn";
  const whatsappNumber = settings.whatsapp_number ?? "21620123456";
  const exchangeRate = settings.exchange_rate_eur_tnd ?? 3.45;

  // Banner video URL — can be overridden via settings (future: settings.banner_video_url)
  const bannerVideo = "/banner.mp4";

  return (
    <PublicPageWrapper settings={settings}>

      {/* ════════════════════════════════════════════════
          1. VIDEO BANNER — cinematic · logo overlay
      ════════════════════════════════════════════════ */}
      <section className="w-full relative overflow-hidden bg-[#2d0a1a]">
        <video
          src={bannerVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full object-cover block"
          style={{ maxHeight: "90vh", minHeight: "min(90vh, 55vw)" }}
        />

        {/* ── Left dark panel only — for logo clarity, no top/bottom bars ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to right, rgba(15,3,10,0.78) 0%, rgba(20,5,14,0.6) 25%, rgba(20,5,14,0.2) 50%, transparent 70%)",
          }}
        />

        {/* ── Logo overlay — center-left, from settings/database ── */}
        {settings.logo_url && (
          <div
            className="absolute left-6 sm:left-10 lg:left-16"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              animation: "fadeInUp 1.4s cubic-bezier(0.22,1,0.36,1) both",
              animationDelay: "0.5s",
              zIndex: 10,
            }}
          >
            {/* soft glow halo behind logo */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(200,100,130,0.18) 0%, transparent 70%)",
                transform: "scale(2)",
              }}
            />
            <img
              src={settings.logo_url}
              alt={settings.site_name ?? "Veloria"}
              className="relative w-auto object-contain"
              style={{
                height: "clamp(90px, 16vw, 200px)",
                filter:
                  "drop-shadow(0 0 24px rgba(240,160,190,0.7)) drop-shadow(0 4px 40px rgba(80,10,30,0.8)) brightness(1.25) contrast(1.05)",
              }}
            />
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════
          2. TRUST BAR — texts from settings
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#fce8ed" }} className="py-6 border-y border-[#f0c0cc]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#f0c0cc]">
            {[
              { icon: Truck,  title: "Livraison rapide",      sub: "Partout en Tunisie" },
              { icon: Shield, title: "Produits authentiques", sub: "100% originaux"      },
              { icon: Heart,  title: "Service client",        sub: "À votre écoute"      },
              { icon: Gift,   title: "Emballage soigné",      sub: "Pensé avec amour"    },
            ].map(({ icon: Icon, title, sub }, i) => (
              <div key={i} className="flex flex-col items-center gap-2 py-4 px-4 text-center">
                <Icon className="w-6 h-6 text-[#b06070]" strokeWidth={1.4} />
                <p className="text-xs font-semibold text-[#7a3040] leading-tight">{title}</p>
                <p className="text-[11px] text-[#a07080] leading-tight">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          3. NOS UNIVERS — editable from admin
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#fce8ed" }} className="pt-10 pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-8 space-y-1">
            {/* Butterfly */}
            <div className="flex justify-center mb-2">
              <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
                <path d="M16 11 C11 6, 2 2, 1 8 C0 14, 8 15, 16 11Z"  fill="#b06070" opacity="0.8"/>
                <path d="M16 11 C10 13, 3 19, 6 21 C9 22, 14 17, 16 11Z" fill="#c07080" opacity="0.65"/>
                <path d="M16 11 C21 6, 30 2, 31 8 C32 14, 24 15, 16 11Z" fill="#b06070" opacity="0.8"/>
                <path d="M16 11 C22 13, 29 19, 26 21 C23 22, 18 17, 16 11Z" fill="#c07080" opacity="0.65"/>
                <ellipse cx="16" cy="11" rx="1.3" ry="5.5" fill="#8a3045"/>
              </svg>
            </div>

            <h2 className="uppercase tracking-[0.35em] text-[13px] font-semibold"
              style={{ color: "#9b4055", fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
              NOS UNIVERS
            </h2>

            {/* Slogan from settings */}
            <p className="text-[22px] sm:text-[26px] font-light"
              style={{
                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)",
                fontStyle: "italic",
                color: "#b06878",
              }}>
              Explorez, rêvez, soyez vous...
            </p>
          </div>

          {/* 4 Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Beauté",     sub: "Prendre soin de soi",        href: "/select?cat=beaute",    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop" },
              { label: "Mode",       sub: "Affirmez votre style",        href: "/select?cat=mode",      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop" },
              { label: "Life Style", sub: "Petits plaisirs du quotidien", href: "/select?cat=lifestyle", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop" },
              { label: "Nouveautés", sub: "Les dernières pépites",        href: "/select",              img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=600&auto=format&fit=crop" },
            ].map(({ label, sub, href, img }, i) => (
              <ScrollReveal key={label} delay={i * 80}>
                <Link href={href} className="group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-400" style={{ aspectRatio: "3/4" }}>
                  <img src={img} alt={label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(100,20,40,0.75) 0%, rgba(160,60,80,0.35) 50%, transparent 100%)" }} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background: "rgba(180,60,90,0.20)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h3 className="text-white font-bold text-lg sm:text-xl leading-tight mb-0.5"
                      style={{ fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" }}>
                      {label}
                    </h3>
                    <p className="text-white/75 text-[11px] sm:text-xs leading-tight mb-3">{sub}</p>
                    <div className="flex">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 group-hover:scale-110"
                        style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}>
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          4. VIP ACCESS — texts from settings
      ════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "#2d0a1a" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-10">
            <span className="uppercase tracking-[0.3em] text-[11px] font-semibold" style={{ color: "#e8b4c8" }}>
              Accès VIP Exclusifs
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-white"
              style={{ fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" }}>
              Comment souhaitez-vous commander ?
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: ShoppingBag,
                title: "Veloria Select",
                desc: "Notre sélection d'articles de beauté, maquillage et accessoires disponibles en stock.",
                href: "/select",
                cta: "Voir le catalogue",
              },
              {
                icon: Send,
                title: "Shein Concierge",
                desc: settings.shein_notice?.fr ?? "Ton panier Shein ? Envoie-nous le lien, on s'occupe de tout !",
                href: "/shein-concierge",
                cta: "Envoyer mon panier",
              },
              {
                icon: Package,
                title: "Special Order",
                desc: settings.special_order_notice?.fr ?? "DM, Douglas, Sephora... on t'achète ce que tu veux en Allemagne.",
                href: "/special-order",
                cta: "Faire une demande",
              },
            ].map(({ icon: Icon, title, desc, href, cta }, i) => (
              <ScrollReveal key={title} delay={i * 120}>
                <div className="group rounded-2xl p-7 border border-white/8 hover:border-[#e891aa]/40 transition-all duration-400 hover:-translate-y-1 flex flex-col h-full"
                  style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-lg"
                    style={{ background: "linear-gradient(135deg, #c4607a 0%, #e891aa 100%)" }}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" }}>
                    {title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed flex-1">{desc}</p>
                  <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3"
                    style={{ color: "#e8b4c8" }}>
                    {cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          5. FEATURED PRODUCTS — from DB
      ════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "#fdf6f0" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <ScrollReveal>
              <span className="uppercase tracking-[0.25em] text-[11px] font-semibold block mb-1" style={{ color: "#b06070" }}>
                Sélection Coup de Cœur
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold"
                style={{
                  fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                  background: "linear-gradient(135deg, #8b2252, #c4607a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                Produits Populaires
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <Link href="/select" className="veloria-outline-btn text-xs font-bold flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-300">
                Tout voir <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </ScrollReveal>
          </div>

          {productsList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {productsList.map((product, i) => {
                const name  = parseTranslatable(product.name);
                const badge = parseTranslatable(product.badgeText);
                const priceEur = (product.priceEur / 100).toFixed(2);
                const priceTnd = ((product.priceEur / 100) * exchangeRate).toFixed(2);

                return (
                  <ScrollReveal key={product.id} delay={(i % 4) * 70}>
                    <div className="group bg-white rounded-2xl overflow-hidden border hover:border-[#e0a0b0] hover:shadow-lg transition-all duration-400 hover:-translate-y-1 flex flex-col"
                      style={{ borderColor: "#f0d0d8" }}>
                      <div className="relative aspect-square overflow-hidden" style={{ background: "#fdf0f3" }}>
                        <img src={product.mainImageUrl} alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                        {badge && (
                          <span className="absolute top-2.5 left-2.5 text-white text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{ background: "linear-gradient(135deg,#c4607a,#e891aa)" }}>
                            {badge}
                          </span>
                        )}
                      </div>
                      <div className="p-3.5 flex flex-col gap-2 flex-1">
                        <h3 className="text-xs font-semibold line-clamp-2 leading-snug" style={{ color: "#7a2840" }}>
                          {name}
                        </h3>
                        <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid #f0d0d8" }}>
                          <div>
                            <span className="text-sm font-bold block" style={{ color: "#c4607a" }}>{priceEur} €</span>
                            <span className="text-[10px]" style={{ color: "#b09090" }}>~ {priceTnd} TND</span>
                          </div>
                          <Link href={`/select/${product.slug}`}
                            className="px-3 py-1.5 rounded-full text-white text-[11px] font-semibold hover:opacity-90 transition-opacity"
                            style={{ background: "linear-gradient(135deg,#c4607a,#e891aa)" }}>
                            Voir
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-[#b09090]">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Les produits arrivent bientôt...</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          6. HOW IT WORKS
      ════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "#fce8ed" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-12">
            <span className="uppercase tracking-[0.3em] text-[11px] font-semibold" style={{ color: "#b06070" }}>
              Simplicité & Transparence
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-1"
              style={{ fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)", color: "#7a2840" }}>
              Comment ça marche ?
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: "01", title: "Fais tes choix",       desc: "Choisis un produit du catalogue ou envoie-nous ton lien Shein / produit d'Allemagne." },
              { step: "02", title: "Reçois ton devis",     desc: "Nous calculons le prix exact en TND avec les frais de service et de livraison." },
              { step: "03", title: "Achat en Allemagne",   desc: "Notre équipe achète tes produits directement en Allemagne et prépare ton colis VIP." },
              { step: "04", title: "Livraison en Tunisie", desc: "Ton colis arrive chez toi avec suivi par SMS & WhatsApp !" },
            ].map(({ step, title, desc }, i) => (
              <ScrollReveal key={step} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 text-center space-y-3 border hover:shadow-md transition-shadow"
                  style={{ borderColor: "#f0d0d8" }}>
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-lg"
                    style={{ background: "linear-gradient(135deg,#f5c0cc,#e891aa)", color: "#7a2840",
                      fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
                    {step}
                  </div>
                  <h4 className="font-bold text-sm"
                    style={{ color: "#7a2840", fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
                    {title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#a07080" }}>{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          7. REVIEWS — from DB
      ════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "#fdf6f0" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-10">
            <span className="uppercase tracking-[0.3em] text-[11px] font-semibold" style={{ color: "#b06070" }}>
              Avis Clientèle
            </span>
            <h2 className="text-3xl font-bold mt-1"
              style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", color: "#7a2840" }}>
              Ce que nos clientes disent
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviewsList.length > 0 ? reviewsList.map((review, i) => (
              <ScrollReveal key={review.id} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 space-y-4 border hover:shadow-sm transition-shadow"
                  style={{ borderColor: "#f0d0d8" }}>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[#e8a020] text-[#e8a020]" />
                    ))}
                  </div>
                  <p className="text-sm italic leading-relaxed"
                    style={{ color: "#7a4050", fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)" }}>
                    &ldquo;{parseTranslatable(review.content)}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid #f0d0d8" }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: "linear-gradient(135deg,#c4607a,#e891aa)" }}>
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "#7a2840" }}>{review.customerName}</p>
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />Commande vérifiée
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )) : (
              /* Fallback static review */
              <ScrollReveal className="col-span-2">
                <div className="bg-white rounded-2xl p-8 text-center border" style={{ borderColor: "#f0d0d8" }}>
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(5)].map((_,j) => <Star key={j} className="w-5 h-5 fill-[#e8a020] text-[#e8a020]" />)}
                  </div>
                  <p className="text-sm italic max-w-md mx-auto"
                    style={{ color: "#7a4050", fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "18px" }}>
                    &ldquo;Service irréprochable ! Mon panier Shein est arrivé à Sousse super rapidement et l&apos;emballage cadeau était magnifique. Merci Veloria !&rdquo;
                  </p>
                  <p className="text-xs font-bold mt-3" style={{ color: "#7a2840" }}>Sana M. — Sousse</p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          8. INSTAGRAM — URL from settings
      ════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "#fce8ed" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-8">
            <span className="uppercase tracking-[0.3em] text-[11px] font-semibold flex items-center justify-center gap-2" style={{ color: "#b06070" }}>
              <InstagramIcon className="w-4 h-4" /> {instagramUrl.replace("https://instagram.com/", "@")}
            </span>
            <h2 className="text-2xl font-bold mt-1"
              style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", color: "#7a2840" }}>
              Rejoins notre communauté
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400",
              "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400",
              "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400",
              "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400",
            ].map((src, i) => (
              <ScrollReveal key={i} delay={i * 70}>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="group relative aspect-square rounded-xl overflow-hidden block">
                  <img src={src} alt="Instagram Veloria"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ background: "rgba(100,20,50,0.5)" }}>
                    <InstagramIcon className="w-6 h-6 text-white" />
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

    </PublicPageWrapper>
  );
}
