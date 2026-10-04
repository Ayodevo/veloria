"use client";

import React, { useState } from "react";
import { SiteSettings } from "@/lib/settings";
import { Save, Palette, Globe, DollarSign, Calendar, Home, Image, LayoutGrid, Navigation } from "lucide-react";

/* ─────────────────────────────────────────────
   Types for homepage sections stored in settings
───────────────────────────────────────────── */
interface NavLink { label: string; href: string; }
interface UniversCard { label: string; sub: string; href: string; img: string; }
interface TrustItem { icon: string; title: string; sub: string; }

interface HomepageSettings {
  banner_video_url: string;
  nav_links: NavLink[];
  univers_title: string;
  univers_subtitle: string;
  univers_cards: UniversCard[];
  trust_items: TrustItem[];
}

const DEFAULT_HOME: HomepageSettings = {
  banner_video_url: "/banner.mp4",
  nav_links: [
    { label: "Accueil",     href: "/" },
    { label: "Beauté",      href: "/select?cat=beaute" },
    { label: "Mode",        href: "/select?cat=mode" },
    { label: "Life Style",  href: "/select?cat=lifestyle" },
    { label: "Nouveautés",  href: "/select" },
    { label: "Promotions",  href: "/select?promo=1" },
    { label: "À propos",    href: "/about" },
  ],
  univers_title: "NOS UNIVERS",
  univers_subtitle: "Explorez, rêvez, soyez vous...",
  univers_cards: [
    { label: "Beauté",     sub: "Prendre soin de soi",         href: "/select?cat=beaute",    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600" },
    { label: "Mode",       sub: "Affirmez votre style",         href: "/select?cat=mode",      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600" },
    { label: "Life Style", sub: "Petits plaisirs du quotidien", href: "/select?cat=lifestyle", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600" },
    { label: "Nouveautés", sub: "Les dernières pépites",        href: "/select",               img: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=600" },
  ],
  trust_items: [
    { icon: "Truck",   title: "Livraison rapide",      sub: "Partout en Tunisie" },
    { icon: "Shield",  title: "Produits authentiques", sub: "100% originaux" },
    { icon: "Heart",   title: "Service client",        sub: "À votre écoute" },
    { icon: "Gift",    title: "Emballage soigné",      sub: "Pensé avec amour" },
  ],
};

interface SettingsFormProps {
  initialSettings: SiteSettings;
  initialHomepage?: HomepageSettings;
}

export function SettingsForm({ initialSettings, initialHomepage }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState<"general" | "appearance" | "shipment" | "currency" | "homepage">("general");
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [home, setHome] = useState<HomepageSettings>(initialHomepage ?? DEFAULT_HOME);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("logo", file);
    try {
      const res = await fetch("/api/admin/settings/upload-logo", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setSettings({ ...settings, logo_url: data.url });
        showToast("Logo uploadé ! N'oubliez pas Enregistrer.");
      } else showToast(data.error || "Erreur upload.", false);
    } catch { showToast("Erreur réseau.", false); }
    finally { setIsUploading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_name: settings.site_name,
          logo_url: settings.logo_url,
          site_tagline: settings.site_tagline,
          site_slogan: settings.site_slogan,
          contact_email: settings.contact_email,
          contact_phone: settings.contact_phone,
          whatsapp_number: settings.whatsapp_number,
          instagram_url: settings.instagram_url,
          colors: settings.colors,
          button_radius: settings.button_radius,
          exchange_rate_eur_tnd: settings.exchange_rate_eur_tnd,
          next_shipment: settings.next_shipment,
          order_mode: settings.order_mode,
          fees: settings.fees,
          // Homepage section
          homepage: home,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Paramètres enregistrés !");
        setTimeout(() => window.location.reload(), 1200);
      } else showToast(data.error || "Erreur de sauvegarde.", false);
    } catch { showToast("Erreur réseau.", false); }
    finally { setIsSaving(false); }
  };

  /* ──────────── helpers ──────────── */
  const inputCls = "w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs";
  const labelCls = "block text-slate-400 mb-1 font-semibold text-[11px] uppercase tracking-wide";

  const tabs: { id: typeof activeTab; icon: React.ReactNode; label: string }[] = [
    { id: "general",    icon: <Globe className="w-4 h-4" />,      label: "Général & Contact" },
    { id: "appearance", icon: <Palette className="w-4 h-4" />,    label: "Charte Graphique" },
    { id: "homepage",   icon: <Home className="w-4 h-4" />,       label: "Page d'Accueil" },
    { id: "shipment",   icon: <Calendar className="w-4 h-4" />,   label: "Prochain Envoi" },
    { id: "currency",   icon: <DollarSign className="w-4 h-4" />, label: "Devise & Frais" },
  ];

  return (
    <form onSubmit={handleSave} className="space-y-6">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl transition-all ${toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === t.id ? "bg-rose-600 text-white shadow-lg" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}>
            {t.icon}<span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          TAB 1 — Général & Contact
      ══════════════════════════════════════════ */}
      {activeTab === "general" && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">Informations Générales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">

            <div>
              <label className={labelCls}>Nom du Site *</label>
              <input type="text" required value={settings.site_name}
                onChange={e => setSettings({ ...settings, site_name: e.target.value })}
                className={inputCls + " font-bold"} />
            </div>

            <div>
              <label className={labelCls}>Logo du Site</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 p-1">
                  {settings.logo_url
                    ? <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain mix-blend-screen" />
                    : <span className="text-xs text-slate-600">Aucun</span>}
                </div>
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={isUploading}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600 cursor-pointer disabled:opacity-50" />
                  <p className="text-[10px] text-slate-500 mt-1">
                    {isUploading ? "Téléchargement..." : "PNG, JPG, SVG — fond transparent recommandé."}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>WhatsApp (sans +) *</label>
              <input type="text" required value={settings.whatsapp_number}
                onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className={inputCls + " text-rose-400 font-mono font-bold"} />
            </div>

            <div>
              <label className={labelCls}>Instagram URL</label>
              <input type="text" value={settings.instagram_url}
                onChange={e => setSettings({ ...settings, instagram_url: e.target.value })}
                className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Tagline (Français)</label>
              <input type="text" value={settings.site_tagline.fr}
                onChange={e => setSettings({ ...settings, site_tagline: { ...settings.site_tagline, fr: e.target.value } })}
                className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Slogan (Français)</label>
              <input type="text" value={settings.site_slogan.fr}
                onChange={e => setSettings({ ...settings, site_slogan: { ...settings.site_slogan, fr: e.target.value } })}
                className={inputCls} />
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB 2 — Charte Graphique
      ══════════════════════════════════════════ */}
      {activeTab === "appearance" && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">Palette des 7 Couleurs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {(Object.entries({
              powder_pink: "Rose poudré",
              blush_pink: "Rose blush",
              rose_gold: "Rose gold",
              deep_rose_gold: "Rose gold profond",
              ivory: "Ivoire (fond du site)",
              rose_brown: "Brun rosé",
              soft_gold: "Or doux",
            }) as [keyof typeof settings.colors, string][]).map(([key, label]) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.colors[key]}
                    onChange={e => setSettings({ ...settings, colors: { ...settings.colors, [key]: e.target.value } })}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer shrink-0" />
                  <input type="text" value={settings.colors[key]}
                    onChange={e => setSettings({ ...settings, colors: { ...settings.colors, [key]: e.target.value } })}
                    className={inputCls + " font-mono"} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB 3 — PAGE D'ACCUEIL ★
      ══════════════════════════════════════════ */}
      {activeTab === "homepage" && (
        <div className="space-y-6">

          {/* ── Banner video URL ── */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Image className="w-4 h-4 text-rose-400" />
              <h3 className="font-bold text-slate-100 text-sm">Vidéo du Banner Hero</h3>
            </div>
            <div>
              <label className={labelCls}>URL de la vidéo (ex: /banner.mp4)</label>
              <input type="text" value={home.banner_video_url}
                onChange={e => setHome({ ...home, banner_video_url: e.target.value })}
                className={inputCls + " font-mono"} />
              <p className="text-[10px] text-slate-500 mt-1">Placez votre vidéo dans le dossier <code className="text-rose-400">/public/</code> puis entrez <code className="text-rose-400">/nom-video.mp4</code></p>
            </div>
          </div>

          {/* ── Navigation Links ── */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-slate-100 text-sm">Liens de Navigation</h3>
              </div>
              <button type="button"
                onClick={() => setHome({ ...home, nav_links: [...home.nav_links, { label: "Nouveau lien", href: "/" }] })}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-500">
                + Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {home.nav_links.map((link, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="text-slate-600 text-xs w-5 shrink-0">{i + 1}.</div>
                  <input type="text" value={link.label} placeholder="Label"
                    onChange={e => {
                      const nl = [...home.nav_links];
                      nl[i] = { ...nl[i], label: e.target.value };
                      setHome({ ...home, nav_links: nl });
                    }}
                    className={inputCls + " flex-1"} />
                  <input type="text" value={link.href} placeholder="/url"
                    onChange={e => {
                      const nl = [...home.nav_links];
                      nl[i] = { ...nl[i], href: e.target.value };
                      setHome({ ...home, nav_links: nl });
                    }}
                    className={inputCls + " flex-1 font-mono"} />
                  <button type="button" onClick={() => setHome({ ...home, nav_links: home.nav_links.filter((_, j) => j !== i) })}
                    className="text-red-400 hover:text-red-300 text-lg font-bold px-2 shrink-0">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* ── NOS UNIVERS Section ── */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <LayoutGrid className="w-4 h-4 text-rose-400" />
              <h3 className="font-bold text-slate-100 text-sm">Section « NOS UNIVERS »</h3>
            </div>

            {/* Section header texts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Titre de la section</label>
                <input type="text" value={home.univers_title}
                  onChange={e => setHome({ ...home, univers_title: e.target.value })}
                  className={inputCls + " uppercase tracking-widest font-bold"} />
              </div>
              <div>
                <label className={labelCls}>Sous-titre romantique</label>
                <input type="text" value={home.univers_subtitle}
                  onChange={e => setHome({ ...home, univers_subtitle: e.target.value })}
                  className={inputCls + " italic"} />
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Cartes (4 univers)</p>
              {home.univers_cards.map((card, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400">Carte {i + 1}</span>
                    {/* live mini preview */}
                    {card.img && (
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-700">
                        <img src={card.img} alt={card.label} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Titre</label>
                      <input type="text" value={card.label}
                        onChange={e => {
                          const nc = [...home.univers_cards];
                          nc[i] = { ...nc[i], label: e.target.value };
                          setHome({ ...home, univers_cards: nc });
                        }}
                        className={inputCls + " font-bold"} />
                    </div>
                    <div>
                      <label className={labelCls}>Sous-titre</label>
                      <input type="text" value={card.sub}
                        onChange={e => {
                          const nc = [...home.univers_cards];
                          nc[i] = { ...nc[i], sub: e.target.value };
                          setHome({ ...home, univers_cards: nc });
                        }}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Lien URL</label>
                      <input type="text" value={card.href}
                        onChange={e => {
                          const nc = [...home.univers_cards];
                          nc[i] = { ...nc[i], href: e.target.value };
                          setHome({ ...home, univers_cards: nc });
                        }}
                        className={inputCls + " font-mono"} />
                    </div>
                    <div>
                      <label className={labelCls}>URL de l&apos;image</label>
                      <input type="text" value={card.img}
                        onChange={e => {
                          const nc = [...home.univers_cards];
                          nc[i] = { ...nc[i], img: e.target.value };
                          setHome({ ...home, univers_cards: nc });
                        }}
                        className={inputCls + " font-mono text-[10px]"} placeholder="https://... ou /images/..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Trust bar items ── */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <h3 className="font-bold text-slate-100 text-sm">Barre de Confiance (4 points)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {home.trust_items.map((item, i) => (
                <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-rose-400">Point {i + 1}</span>
                  <div>
                    <label className={labelCls}>Titre</label>
                    <input type="text" value={item.title}
                      onChange={e => {
                        const nt = [...home.trust_items];
                        nt[i] = { ...nt[i], title: e.target.value };
                        setHome({ ...home, trust_items: nt });
                      }}
                      className={inputCls + " font-bold"} />
                  </div>
                  <div>
                    <label className={labelCls}>Sous-texte</label>
                    <input type="text" value={item.sub}
                      onChange={e => {
                        const nt = [...home.trust_items];
                        nt[i] = { ...nt[i], sub: e.target.value };
                        setHome({ ...home, trust_items: nt });
                      }}
                      className={inputCls} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB 4 — Prochain Envoi
      ══════════════════════════════════════════ */}
      {activeTab === "shipment" && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">Prochain Envoi & Décompte</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className={labelCls}>Date de départ *</label>
              <input type="date" required value={settings.next_shipment.date}
                onChange={e => setSettings({ ...settings, next_shipment: { ...settings.next_shipment, date: e.target.value } })}
                className={inputCls + " font-bold"} />
            </div>
            <div>
              <label className={labelCls}>Date limite commande</label>
              <input type="date" value={settings.next_shipment.deadline}
                onChange={e => setSettings({ ...settings, next_shipment: { ...settings.next_shipment, deadline: e.target.value } })}
                className={inputCls + " font-bold"} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Texte de la bannière (Français)</label>
              <input type="text" value={settings.next_shipment.textFr}
                onChange={e => setSettings({ ...settings, next_shipment: { ...settings.next_shipment, textFr: e.target.value } })}
                className={inputCls} />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="countdown_enabled" checked={settings.next_shipment.isCountdownEnabled}
                onChange={e => setSettings({ ...settings, next_shipment: { ...settings.next_shipment, isCountdownEnabled: e.target.checked } })}
                className="w-4 h-4 accent-rose-500" />
              <label htmlFor="countdown_enabled" className="text-slate-300 text-xs font-semibold cursor-pointer">
                Afficher le décompte en temps réel dans la bannière
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB 5 — Devise & Frais
      ══════════════════════════════════════════ */}
      {activeTab === "currency" && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">Taux de Change & Mode de Commande</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className={labelCls}>Taux EUR → TND *</label>
              <input type="number" step="0.01" required value={settings.exchange_rate_eur_tnd}
                onChange={e => setSettings({ ...settings, exchange_rate_eur_tnd: parseFloat(e.target.value) || 3.45 })}
                className={inputCls + " font-bold text-lg"} />
            </div>
            <div>
              <label className={labelCls}>Mode de Commande</label>
              <select value={settings.order_mode}
                onChange={e => setSettings({ ...settings, order_mode: e.target.value as "cart" | "whatsapp" })}
                className={inputCls + " text-rose-400 font-bold"}>
                <option value="cart">Mode Panier & Formulaire</option>
                <option value="whatsapp">Mode Direct WhatsApp</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Save Bar ── */}
      <div className="sticky bottom-6 p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 flex items-center justify-between shadow-2xl">
        <p className="text-xs text-slate-400 hidden sm:block">
          Les modifications s&apos;appliquent instantanément sur le site.
        </p>
        <button type="submit" disabled={isSaving}
          className="ml-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50">
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Sauvegarde..." : "Enregistrer tous les paramètres"}</span>
        </button>
      </div>

    </form>
  );
}
