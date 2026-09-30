import { db, schema } from "@/db";

export interface SiteSettings {
  site_name: string;
  logo_url: string;
  site_tagline: { fr: string; ar: string };
  site_slogan: { fr: string; ar: string };
  address: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  instagram_url: string;
  colors: {
    powder_pink: string;
    blush_pink: string;
    rose_gold: string;
    deep_rose_gold: string;
    ivory: string;
    rose_brown: string;
    soft_gold: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    accentFont: string;
    arabicFont: string;
  };
  button_radius: string;
  enabled_languages: string[];
  default_language: string;
  form_addressing: "tu" | "vous";
  exchange_rate_eur_tnd: number;
  exchange_rate_updated_at: string;
  next_shipment: {
    date: string;
    deadline: string;
    isCountdownEnabled: boolean;
    textFr: string;
    textAr: string;
  };
  order_mode: "cart" | "whatsapp";
  shein_notice: { fr: string; ar: string };
  special_order_notice: { fr: string; ar: string };
  fees: {
    serviceFeePercent: number;
    deliveryFeeTnd: number;
    giftWrapFeeTnd: number;
  };
}

export const defaultSettings: SiteSettings = {
  site_name: "VELORIA",
  logo_url: "/logo.png",
  site_tagline: {
    fr: "Beauty · Fashion · Lifestyle",
    ar: "جمال · موضة · أسلوب حياة",
  },
  site_slogan: {
    fr: "Un petit luxe, rien que pour toi.",
    ar: "رفاهية صغيرة، خصيصاً لك.",
  },
  address: "Tunis, Tunisie & Frankfurt, Allemagne",
  contact_email: "contact@veloria.tn",
  contact_phone: "+216 20 123 456",
  whatsapp_number: "21620123456",
  instagram_url: "https://instagram.com/veloria.tn",
  colors: {
    powder_pink: "#F7DAD7",
    blush_pink: "#EFB9B7",
    rose_gold: "#C9827A",
    deep_rose_gold: "#A85F5A",
    ivory: "#FFF8F6",
    rose_brown: "#5A3A3A",
    soft_gold: "#D8B48A",
  },
  typography: {
    headingFont: "Cormorant Garamond",
    bodyFont: "Jost",
    accentFont: "Great Vibes",
    arabicFont: "Cairo",
  },
  button_radius: "26px",
  enabled_languages: ["fr", "ar"],
  default_language: "fr",
  form_addressing: "tu",
  exchange_rate_eur_tnd: 3.45,
  exchange_rate_updated_at: "2026-09-29",
  next_shipment: {
    date: "2026-10-15",
    deadline: "2026-10-10",
    isCountdownEnabled: true,
    textFr: "Prochain envoi vers la Tunisie : 15 Octobre · Commandez avant le 10 Octobre !",
    textAr: "الدفعة القادمة إلى تونس: 15 أكتوبر · اطلبي قبل 10 أكتوبر!",
  },
  order_mode: "cart",
  shein_notice: {
    fr: "Service indépendant, non affilié à Shein.",
    ar: "خدمة مستقلة، غير تابعة لشين.",
  },
  special_order_notice: {
    fr: "DM, Douglas, Sephora… on t'achète ce que tu veux en Allemagne.",
    ar: "دي إم، دوغلاس، سيفورا... نشتري لك كل ما تريدينه من ألمانيا.",
  },
  fees: {
    serviceFeePercent: 15,
    deliveryFeeTnd: 8,
    giftWrapFeeTnd: 5,
  },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.select().from(schema.settings);
    const settingsMap: Record<string, string> = {};
    for (const r of rows) {
      settingsMap[r.key] = r.value;
    }

    const settings: SiteSettings = { ...defaultSettings };

    if (settingsMap.site_name) settings.site_name = settingsMap.site_name;
    if (settingsMap.logo_url) settings.logo_url = settingsMap.logo_url;
    if (settingsMap.site_tagline) settings.site_tagline = JSON.parse(settingsMap.site_tagline);
    if (settingsMap.site_slogan) settings.site_slogan = JSON.parse(settingsMap.site_slogan);
    if (settingsMap.address) settings.address = settingsMap.address;
    if (settingsMap.contact_email) settings.contact_email = settingsMap.contact_email;
    if (settingsMap.contact_phone) settings.contact_phone = settingsMap.contact_phone;
    if (settingsMap.whatsapp_number) settings.whatsapp_number = settingsMap.whatsapp_number;
    if (settingsMap.instagram_url) settings.instagram_url = settingsMap.instagram_url;
    if (settingsMap.colors) settings.colors = JSON.parse(settingsMap.colors);
    if (settingsMap.typography) settings.typography = JSON.parse(settingsMap.typography);
    if (settingsMap.button_radius) settings.button_radius = settingsMap.button_radius;
    if (settingsMap.enabled_languages) settings.enabled_languages = JSON.parse(settingsMap.enabled_languages);
    if (settingsMap.default_language) settings.default_language = settingsMap.default_language;
    if (settingsMap.form_addressing) settings.form_addressing = settingsMap.form_addressing as "tu" | "vous";
    if (settingsMap.exchange_rate_eur_tnd) settings.exchange_rate_eur_tnd = parseFloat(settingsMap.exchange_rate_eur_tnd);
    if (settingsMap.exchange_rate_updated_at) settings.exchange_rate_updated_at = settingsMap.exchange_rate_updated_at;
    if (settingsMap.next_shipment) settings.next_shipment = JSON.parse(settingsMap.next_shipment);
    if (settingsMap.order_mode) settings.order_mode = settingsMap.order_mode as "cart" | "whatsapp";
    if (settingsMap.shein_notice) settings.shein_notice = JSON.parse(settingsMap.shein_notice);
    if (settingsMap.special_order_notice) settings.special_order_notice = JSON.parse(settingsMap.special_order_notice);
    if (settingsMap.fees) settings.fees = JSON.parse(settingsMap.fees);

    return settings;
  } catch (error) {
    console.error("Failed to load site settings:", error);
    return defaultSettings;
  }
}

export function parseTranslatable(
  value: string | { [key: string]: string } | null | undefined,
  locale: string = "fr",
  fallback: string = ""
): string {
  if (!value) return fallback;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed[locale] || parsed["fr"] || parsed["ar"] || fallback;
      }
      return value;
    } catch {
      return value;
    }
  }
  return value[locale] || value["fr"] || value["ar"] || fallback;
}
