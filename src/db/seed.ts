import { db, schema } from "./index";
import crypto from "crypto";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

async function seed() {
  console.log("🌸 Seeding Veloria database...");

  // 1. Create Admin User
  const existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, "admin@veloria.tn"),
  });

  if (!existingUser) {
    const passwordHash = hashPassword("veloria2026");
    await db.insert(schema.users).values({
      email: "admin@veloria.tn",
      passwordHash,
      name: "Veloria Admin",
      role: "owner",
    });
    console.log("✅ Admin user created: admin@veloria.tn / veloria2026");
  }

  // 2. Default Settings
  const defaultSettings = [
    {
      key: "site_name",
      value: "VELORIA",
      group: "general",
    },
    {
      key: "site_tagline",
      value: JSON.stringify({
        fr: "Beauty · Fashion · Lifestyle",
        ar: "جمال · موضة · أسلوب حياة",
      }),
      group: "general",
      isTranslatable: true,
    },
    {
      key: "site_slogan",
      value: JSON.stringify({
        fr: "Un petit luxe, rien que pour toi.",
        ar: "رفاهية صغيرة، خصيصاً لك.",
      }),
      group: "general",
      isTranslatable: true,
    },
    {
      key: "address",
      value: "Tunis, Tunisie & Frankfurt, Allemagne",
      group: "general",
    },
    {
      key: "contact_email",
      value: "contact@veloria.tn",
      group: "general",
    },
    {
      key: "contact_phone",
      value: "+216 20 123 456",
      group: "general",
    },
    {
      key: "whatsapp_number",
      value: "21620123456",
      group: "general",
    },
    {
      key: "instagram_url",
      value: "https://instagram.com/veloria.tn",
      group: "general",
    },
    {
      key: "colors",
      value: JSON.stringify({
        powder_pink: "#F7DAD7",
        blush_pink: "#EFB9B7",
        rose_gold: "#C9827A",
        deep_rose_gold: "#A85F5A",
        ivory: "#FFF8F6",
        rose_brown: "#5A3A3A",
        soft_gold: "#D8B48A",
      }),
      group: "appearance",
    },
    {
      key: "typography",
      value: JSON.stringify({
        headingFont: "Cormorant Garamond",
        bodyFont: "Jost",
        accentFont: "Great Vibes",
        arabicFont: "Cairo",
      }),
      group: "appearance",
    },
    {
      key: "button_radius",
      value: "26px",
      group: "appearance",
    },
    {
      key: "enabled_languages",
      value: JSON.stringify(["fr", "ar"]),
      group: "languages",
    },
    {
      key: "default_language",
      value: "fr",
      group: "languages",
    },
    {
      key: "form_addressing",
      value: "tu",
      group: "languages",
    },
    {
      key: "exchange_rate_eur_tnd",
      value: "3.45",
      group: "currency",
    },
    {
      key: "exchange_rate_updated_at",
      value: "2026-09-29",
      group: "currency",
    },
    {
      key: "next_shipment",
      value: JSON.stringify({
        date: "2026-10-15",
        deadline: "2026-10-10",
        isCountdownEnabled: true,
        textFr: "Prochain envoi vers la Tunisie : 15 Octobre · Commandez avant le 10 Octobre !",
        textAr: "الدفعة القادمة إلى تونس: 15 أكتوبر · اطلبي قبل 10 أكتوبر!",
      }),
      group: "next_shipment",
    },
    {
      key: "order_mode",
      value: "cart",
      group: "order_mode",
    },
    {
      key: "shein_notice",
      value: JSON.stringify({
        fr: "Service indépendant, non affilié à Shein.",
        ar: "خدمة مستقلة، غير تابعة لشين.",
      }),
      group: "general",
      isTranslatable: true,
    },
    {
      key: "special_order_notice",
      value: JSON.stringify({
        fr: "DM, Douglas, Sephora… on t'achète ce que tu veux en Allemagne.",
        ar: "دي إم، دوغلاس، سيفورا... نشتري لك كل ما تريدينه من ألمانيا.",
      }),
      group: "general",
      isTranslatable: true,
    },
    {
      key: "fees",
      value: JSON.stringify({
        serviceFeePercent: 15,
        deliveryFeeTnd: 8,
        giftWrapFeeTnd: 5,
      }),
      group: "fees",
    },
  ];

  for (const s of defaultSettings) {
    const exists = await db.query.settings.findFirst({
      where: (st, { eq }) => eq(st.key, s.key),
    });
    if (!exists) {
      await db.insert(schema.settings).values(s);
    }
  }

  // 3. Menus
  const existingHeaderMenu = await db.query.menus.findFirst({
    where: (m, { eq }) => eq(m.location, "header"),
  });

  let headerMenuId = existingHeaderMenu?.id;
  if (!headerMenuId) {
    const res = await db.insert(schema.menus).values({ name: "Header Navigation", location: "header" }).returning();
    headerMenuId = res[0].id;

    await db.insert(schema.menuItems).values([
      { menuId: headerMenuId, label: JSON.stringify({ fr: "Accueil", ar: "الرئيسية" }), url: "/", order: 1 },
      { menuId: headerMenuId, label: JSON.stringify({ fr: "Veloria Select", ar: "فيلوريا سيلكت" }), url: "/select", order: 2 },
      { menuId: headerMenuId, label: JSON.stringify({ fr: "Shein Concierge", ar: "شين كونسيرج" }), url: "/shein-concierge", order: 3 },
      { menuId: headerMenuId, label: JSON.stringify({ fr: "Special Order Germany", ar: "طلبية خاصة من ألمانيا" }), url: "/special-order", order: 4 },
      { menuId: headerMenuId, label: JSON.stringify({ fr: "Suivi de Commande", ar: "تتبع الطلب" }), url: "/tracking", order: 5 },
      { menuId: headerMenuId, label: JSON.stringify({ fr: "FAQ & Aide", ar: "الأسئلة الشائعة" }), url: "/faq", order: 6 },
    ]);
  }

  // 4. Categories
  const catSkincare = await db.insert(schema.categories).values({
    name: JSON.stringify({ fr: "Soin du Visage & Corps", ar: "العناية بالوجه والجسم" }),
    slug: "soin-du-visage",
    description: JSON.stringify({ fr: "Les meilleurs soins sélectionnés depuis l'Allemagne.", ar: "أفضل منتجات العناية المختارة من ألمانيا." }),
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    sortOrder: 1,
  }).returning();

  const catMakeup = await db.insert(schema.categories).values({
    name: JSON.stringify({ fr: "Maquillage & Beauté", ar: "المكياج والجمال" }),
    slug: "maquillage",
    description: JSON.stringify({ fr: "Teint parfait, lips & eyes des plus grandes marques.", ar: "مكياج فاخر ومميز لأفضل الماركات العالمية." }),
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop",
    sortOrder: 2,
  }).returning();

  const catHair = await db.insert(schema.categories).values({
    name: JSON.stringify({ fr: "Cheveux & Parfums", ar: "الشعر والعطور" }),
    slug: "cheveux-parfums",
    description: JSON.stringify({ fr: "Sérums, huiles et brumes parfumées de luxe.", ar: "زيوت وبخاخات معطرة وعناية بالشعر." }),
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop",
    sortOrder: 3,
  }).returning();

  // 5. Brands
  const brandRare = await db.insert(schema.brands).values({
    name: "Rare Beauty",
    slug: "rare-beauty",
    logoUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=200&auto=format&fit=crop",
  }).returning();

  const brandDior = await db.insert(schema.brands).values({
    name: "Dior Beauty",
    slug: "dior-beauty",
    logoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=200&auto=format&fit=crop",
  }).returning();

  const brandCT = await db.insert(schema.brands).values({
    name: "Charlotte Tilbury",
    slug: "charlotte-tilbury",
    logoUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=200&auto=format&fit=crop",
  }).returning();

  // 6. Products
  const sampleProducts = [
    {
      name: JSON.stringify({ fr: "Rare Beauty Soft Pinch Liquid Blush", ar: "بلاش نادر بيوتي سائل سوفت بينش" }),
      slug: "rare-beauty-soft-pinch-liquid-blush",
      description: JSON.stringify({
        fr: "Un blush liquide ultra-léger et longue tenue qui se fond parfaitement dans la peau pour un fini radieux et naturel.",
        ar: "أحمر خدود سائل خفيف الوزن ويدوم طويلاً يمتزج بسهولة مع البشرة لإطلالة متألقة وطبيعية.",
      }),
      shortDescription: JSON.stringify({ fr: "Teinte Hope - Fini Radiance 7.5ml", ar: "درجة هوب - لمسة مشعة 7.5 مل" }),
      categoryId: catMakeup[0].id,
      brandId: brandRare[0].id,
      tags: JSON.stringify(["featured", "new"]),
      priceEur: 2650,
      comparePriceEur: 3000,
      purchasePriceEur: 2100,
      mainImageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
      ]),
      totalStock: 12,
      badgeText: JSON.stringify({ fr: "Coup de cœur", ar: "الأكثر طلباً" }),
      status: "active",
    },
    {
      name: JSON.stringify({ fr: "Dior Addict Lip Glow Oil", ar: "زيت الشفاه ديور أديكت ليب غلو" }),
      slug: "dior-addict-lip-glow-oil",
      description: JSON.stringify({
        fr: "L'huile à lèvres nourrissante et brillante incontournable. Formule enrichie en huile de cerise.",
        ar: "زيت الشفاه المغذي واللامع الأيقوني، معزز ببريق وردي فريد وزيت الكرز.",
      }),
      shortDescription: JSON.stringify({ fr: "Teinte 001 Pink - Fini Brillant", ar: "درجة 001 بينك - لمعان مغذي" }),
      categoryId: catMakeup[0].id,
      brandId: brandDior[0].id,
      tags: JSON.stringify(["featured", "limited"]),
      priceEur: 4200,
      comparePriceEur: 4500,
      purchasePriceEur: 3400,
      mainImageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
      ]),
      totalStock: 5,
      badgeText: JSON.stringify({ fr: "Stock Limité", ar: "كمية محدودة" }),
      status: "active",
    },
    {
      name: JSON.stringify({ fr: "Charlotte Tilbury Airbrush Powder", ar: "بودرة تشارلوت تيلبوري إيربروش" }),
      slug: "charlotte-tilbury-airbrush-powder",
      description: JSON.stringify({
        fr: "La poudre pressée micro-fine magique qui floute les imperfections et matifie en douceur sans assécher.",
        ar: "بودرة مضغوطة فائقة النعومة تخفي عيوب البشرة وتمنحك لمسة مخملية ساحرة.",
      }),
      shortDescription: JSON.stringify({ fr: "Teinte 2 Medium 8g", ar: "درجة 2 ميديوم 8غ" }),
      categoryId: catMakeup[0].id,
      brandId: brandCT[0].id,
      tags: JSON.stringify(["featured"]),
      priceEur: 4400,
      comparePriceEur: 4800,
      purchasePriceEur: 3500,
      mainImageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
      ]),
      totalStock: 8,
      badgeText: JSON.stringify({ fr: "Nouveau", ar: "جديد" }),
      status: "active",
    },
    {
      name: JSON.stringify({ fr: "Sol de Janeiro Cheirosa 68 Perfume Mist", ar: "عطر سول دي جانيرو شيروسا 68" }),
      slug: "sol-de-janeiro-cheirosa-68",
      description: JSON.stringify({
        fr: "Une brume parfumée pour le corps et les cheveux aux notes fruitées et florales de pitahaya et de jasmin brésilien.",
        ar: "بخاخ معطر للجسم والشعر بنفحات فاكهية وزهرية ساحرة.",
      }),
      shortDescription: JSON.stringify({ fr: "Brumefleurs & dragonfruit 90ml", ar: "بخاخ عطر ناعم 90مل" }),
      categoryId: catHair[0].id,
      brandId: brandRare[0].id,
      tags: JSON.stringify(["new"]),
      priceEur: 2400,
      purchasePriceEur: 1800,
      mainImageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop",
      galleryUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop",
      ]),
      totalStock: 15,
      badgeText: JSON.stringify({ fr: "Best-Seller", ar: "الأكثر مبيعاً" }),
      status: "active",
    },
  ];

  for (const p of sampleProducts) {
    const createdP = await db.insert(schema.products).values(p).returning();
    await db.insert(schema.productVariants).values([
      {
        productId: createdP[0].id,
        name: JSON.stringify({ fr: "Teinte 01 / Original", ar: "درجة 01" }),
        stock: 5,
        priceEur: p.priceEur,
      },
    ]);
  }

  // 7. Banners / Hero slides
  await db.insert(schema.banners).values([
    {
      title: JSON.stringify({ fr: "Un petit luxe, rien que pour toi", ar: "رفاهية صغيرة، خصيصاً لك" }),
      subtitle: JSON.stringify({ fr: "Découvre les trésors de beauté & mode d'Allemagne livrés chez toi en Tunisie.", ar: "اكتشفي منتجات الجمال والموضة من ألمانيا المسلمة مباشرة إليك في تونس." }),
      desktopImageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop",
      mobileImageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
      buttonLabel: JSON.stringify({ fr: "Explorer la Sélection", ar: "استكشفي المجموعات" }),
      buttonUrl: "/select",
      isActive: true,
      sortOrder: 1,
    },
  ]);

  // 8. FAQ Categories & FAQ Items
  const faqCat = await db.insert(schema.faqCategories).values({
    name: JSON.stringify({ fr: "Commandes & Livraison", ar: "الطلبات والتوصيل" }),
    sortOrder: 1,
  }).returning();

  await db.insert(schema.faqs).values([
    {
      categoryId: faqCat[0].id,
      question: JSON.stringify({ fr: "Comment fonctionnent les commandes Shein Concierge ?", ar: "كيف تعمل طلبات شين كونسيرج؟" }),
      answer: JSON.stringify({
        fr: "Il te suffit de constituer ton panier sur Shein, copier le lien et nous l'envoyer via le formulaire. Nous calculons ton devis personnalisé (prix + frais de service + livraison en Tunisie) sous 24h !",
        ar: "يكفي أن تقومي بتجميع سلتك على موقع شين، نسخ الرابط وإرساله لنا عبر النماذج. نقوم بإرسال التكلفة الكلية والتوصيل خلال 24 ساعة!",
      }),
      sortOrder: 1,
    },
    {
      categoryId: faqCat[0].id,
      question: JSON.stringify({ fr: "Quels sont les délais de livraison vers la Tunisie ?", ar: "ما هي مدة التوصيل إلى تونس؟" }),
      answer: JSON.stringify({
        fr: "Les colis sont préparés en Allemagne et expédiés selon les dates de nos sessions de transport. Comptez généralement 5 à 10 jours après la date de départ !",
        ar: "يتم تحضير الطرود في ألمانيا وشحنها وفقاً لمواعيد رحلاتنا المحددة. تستغرق الشحنة عادة 5 إلى 10 أيام بعد الانطلاق!",
      }),
      sortOrder: 2,
    },
  ]);

  // 9. Shipment Batches
  const activeShipment = await db.insert(schema.shipments).values({
    name: "Envoi Octobre 2026",
    departureDate: "2026-10-15",
    orderDeadline: "2026-10-10",
    status: "active",
  }).returning();

  // 10. Sample Requests / Order tracking demo data
  const sampleRequest1 = await db.insert(schema.requests).values({
    type: "select",
    reference: "VS-1001",
    customerName: "Amina Ben Salem",
    phone: "21698765432",
    email: "amina@example.com",
    city: "Tunis",
    address: "Lac 2, Tunis",
    status: "in_transit",
    totalEur: 4200,
    totalTnd: 14490,
    purchaseCostEur: 3400,
    serviceFeeEur: 800,
    deliveryFeeTnd: 800,
    marginEur: 800,
    depositPaidEur: 2000,
    notes: "Client fidèle Instagram. Souhaite emballage cadeau.",
    trackingNumber: "VEL-TN-88219",
    shipmentId: activeShipment[0].id,
    isGiftWrapped: true,
  }).returning();

  await db.insert(schema.requestItems).values({
    requestId: sampleRequest1[0].id,
    productName: "Dior Addict Lip Glow Oil - 001 Pink",
    quantity: 1,
    priceEur: 4200,
  });

  await db.insert(schema.requestStatusHistory).values([
    { requestId: sampleRequest1[0].id, oldStatus: null, newStatus: "received", note: "Demande reçue via le site web", changedBy: "system" },
    { requestId: sampleRequest1[0].id, oldStatus: "received", newStatus: "quote_sent", note: "Devis validé et envoyé par WhatsApp", changedBy: "admin@veloria.tn" },
    { requestId: sampleRequest1[0].id, oldStatus: "quote_sent", newStatus: "confirmed", note: "Acompte reçu de 20 EUR", changedBy: "admin@veloria.tn" },
    { requestId: sampleRequest1[0].id, oldStatus: "confirmed", newStatus: "purchased", note: "Produit acheté chez Sephora Allemagne", changedBy: "admin@veloria.tn" },
    { requestId: sampleRequest1[0].id, oldStatus: "purchased", newStatus: "in_transit", note: "Colis en route vers la Tunisie", changedBy: "admin@veloria.tn" },
  ]);

  const sampleRequest2 = await db.insert(schema.requests).values({
    type: "shein",
    reference: "VX-1002",
    customerName: "Syrine Khelifi",
    phone: "21622334455",
    email: "syrine@example.com",
    city: "Sousse",
    address: "Kantaoui, Sousse",
    status: "quote_sent",
    totalEur: 8500,
    totalTnd: 29325,
    purchaseCostEur: 7000,
    serviceFeeEur: 1500,
    deliveryFeeTnd: 800,
    marginEur: 1500,
    notes: "Lien de panier Shein reçu avec 4 articles.",
    trackingNumber: null,
    shipmentId: activeShipment[0].id,
  }).returning();

  await db.insert(schema.requestItems).values({
    requestId: sampleRequest2[0].id,
    productName: "Panier Shein 4 articles (Robes & Accessoires)",
    productUrl: "https://shein.com/cart/share/12345",
    quantity: 1,
    priceEur: 8500,
  });

  await db.insert(schema.requestStatusHistory).values([
    { requestId: sampleRequest2[0].id, oldStatus: null, newStatus: "received", note: "Demande de devis Shein Concierge", changedBy: "system" },
    { requestId: sampleRequest2[0].id, oldStatus: "received", newStatus: "quote_sent", note: "Devis calculé et envoyé au client", changedBy: "admin@veloria.tn" },
  ]);

  console.log("✨ Veloria database successfully seeded!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
