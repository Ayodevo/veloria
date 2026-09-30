"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "fr" | "ar";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  getTrans: (obj: any) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  fr: {
    "nav.home": "Accueil",
    "nav.select": "Veloria Select",
    "nav.shein": "Shein Concierge",
    "nav.special": "Special Order",
    "nav.tracking": "Suivi de Commande",
    "nav.faq": "FAQ & Aide",
    "nav.cart": "Panier",
    "nav.wishlist": "Favoris",
    "nav.admin": "Administration",
    "hero.badge": "Luxe & Elégance depuis l'Allemagne",
    "hero.discover": "Découvrir la sélection",
    "hero.shein_cta": "Envoyer mon panier Shein",
    "hero.special_cta": "Demande spéciale d'Allemagne",
    "sections.access": "Tes accès VIP",
    "sections.featured": "Sélection coup de cœur",
    "sections.how_it_works": "Comment ça marche ?",
    "sections.reviews": "Avis de nos clientes",
    "sections.instagram": "Rejoins-nous sur Instagram",
    "cart.title": "Ton Panier Veloria",
    "cart.empty": "Ton panier est encore vide.",
    "cart.total": "Total estimé",
    "cart.checkout": "Passer la commande",
    "cart.whatsapp_order": "Commander via WhatsApp",
    "form.name": "Nom complet",
    "form.phone": "Numéro WhatsApp",
    "form.city": "Ville (Tunisie)",
    "form.address": "Adresse de livraison",
    "form.notes": "Notes / Instructions",
    "form.submit": "Envoyer la demande",
    "tracking.title": "Suivi de ta commande",
    "tracking.subtitle": "Entre ton numéro de référence et ton téléphone pour suivre ton colis en temps réel.",
    "tracking.ref_placeholder": "Ex: VS-1001 ou VX-1002",
    "tracking.phone_placeholder": "Ex: 21620123456",
    "tracking.search": "Vérifier le statut",
    "footer.rights": "Tous droits réservés. Veloria Beauty · Fashion · Lifestyle.",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.select": "فيلوريا سيلكت",
    "nav.shein": "شين كونسيرج",
    "nav.special": "طلبية خاصة",
    "nav.tracking": "تتبع الطلب",
    "nav.faq": "الأسئلة الشائعة",
    "nav.cart": "السلة",
    "nav.wishlist": "المفضلة",
    "nav.admin": "لوحة التحكم",
    "hero.badge": "رفاهية وأناقة من ألمانيا",
    "hero.discover": "استكشفي المجموعات",
    "hero.shein_cta": "أرسلي سلة شين",
    "hero.special_cta": "طلب خاص من ألمانيا",
    "sections.access": "بواباتك الخاصة",
    "sections.featured": "الأكثر طلباً ومحبة",
    "sections.how_it_works": "كيف تعمل الخدمة؟",
    "sections.reviews": "آراء صديقات فيلوريا",
    "sections.instagram": "تابعينا على إنستغرام",
    "cart.title": "سلتك في فيلوريا",
    "cart.empty": "سلتك فارغة حالياً.",
    "cart.total": "المجموع التقديري",
    "cart.checkout": "تأكيد الطلب",
    "cart.whatsapp_order": "الطلب عبر واتساب",
    "form.name": "الاسم الكامل",
    "form.phone": "رقم الواتساب",
    "form.city": "المدينة (تونس)",
    "form.address": "عنوان التسليم",
    "form.notes": "ملاحظات إضافية",
    "form.submit": "إرسال الطلب",
    "tracking.title": "تتبع طلبيتك",
    "tracking.subtitle": "أدخلي رقم التتبع ورقم الهاتف لمتابعة حالة شحنتك لحظة بلحظة.",
    "tracking.ref_placeholder": "مثال: VS-1001 أو VX-1002",
    "tracking.phone_placeholder": "مثال: 21620123456",
    "tracking.search": "التحقق من حالة الطلب",
    "footer.rights": "جميع الحقوق محفوظة. فيلوريا جمال · موضة · أسلوب حياة.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("veloria_locale") as Locale;
    if (saved && (saved === "fr" || saved === "ar")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("veloria_locale", newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
  };

  const dir = locale === "ar" ? "rtl" : "ltr";

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations["fr"]?.[key] || key;
  };

  const getTrans = (obj: any): string => {
    if (!obj) return "";
    if (typeof obj === "string") {
      try {
        const parsed = JSON.parse(obj);
        return parsed[locale] || parsed["fr"] || parsed["ar"] || obj;
      } catch {
        return obj;
      }
    }
    return obj[locale] || obj["fr"] || obj["ar"] || "";
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir, t, getTrans }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
