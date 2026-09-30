"use client";

import React, { useState } from "react";
import { SiteSettings } from "@/lib/settings";
import { Save, Palette, Globe, DollarSign, Calendar, Sliders, Shield } from "lucide-react";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState<"general" | "appearance" | "shipment" | "currency">("general");
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await fetch("/api/admin/settings/upload-logo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSettings({ ...settings, logo_url: data.url });
        alert("Logo uploadé avec succès ! N'oubliez pas d'Enregistrer.");
      } else {
        alert(data.error || "Erreur de téléchargement.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    } finally {
      setIsUploading(false);
    }
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
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Paramètres enregistrés avec succès !");
        window.location.reload();
      } else {
        alert(data.error || "Erreur de sauvegarde.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "general"
              ? "bg-rose-500 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Général & Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("appearance")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "appearance"
              ? "bg-rose-500 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Charte Graphique (7 Couleurs)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("shipment")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "shipment"
              ? "bg-rose-500 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Prochain Envoi & Décompte</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("currency")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "currency"
              ? "bg-rose-500 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Devise & Frais</span>
        </button>
      </div>

      {/* Tab 1: General */}
      {activeTab === "general" && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">
            Informations Générales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Nom du Site *</label>
              <input
                type="text"
                required
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Logo du Site</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 p-1">
                  {settings.logo_url ? (
                    <img
                      src={settings.logo_url}
                      alt="Logo preview"
                      className="w-full h-full object-contain mix-blend-screen"
                    />
                  ) : (
                    <span className="text-xs text-slate-600">Aucun</span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-xl file:border-0
                      file:text-xs file:font-semibold
                      file:bg-rose-500 file:text-white
                      hover:file:bg-rose-600 file:transition-colors
                      cursor-pointer disabled:opacity-50"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    {isUploading ? "Téléchargement en cours..." : "Formats acceptés : PNG, JPG, SVG. Recommandé : fond transparent."}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Numéro WhatsApp (sans +) *</label>
              <input
                type="text"
                required
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Tagline (Français)</label>
              <input
                type="text"
                value={settings.site_tagline.fr}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    site_tagline: { ...settings.site_tagline, fr: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Slogan (Français)</label>
              <input
                type="text"
                value={settings.site_slogan.fr}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    site_slogan: { ...settings.site_slogan, fr: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Appearance & Brand Colors */}
      {activeTab === "appearance" && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">
            Palette des 7 Couleurs de la Charte Graphique
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Rose poudré</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.colors.powder_pink}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, powder_pink: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.colors.powder_pink}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, powder_pink: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Rose blush</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.colors.blush_pink}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, blush_pink: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.colors.blush_pink}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, blush_pink: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Rose gold</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.colors.rose_gold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, rose_gold: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.colors.rose_gold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, rose_gold: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Rose gold profond</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.colors.deep_rose_gold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, deep_rose_gold: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.colors.deep_rose_gold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, deep_rose_gold: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Ivoire (Couleur de Fond du Site)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.colors.ivory}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, ivory: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.colors.ivory}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, ivory: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Brun rosé</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.colors.rose_brown}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, rose_brown: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.colors.rose_brown}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, rose_brown: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Or doux (Soft Gold)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.colors.soft_gold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, soft_gold: e.target.value },
                    })
                  }
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.colors.soft_gold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      colors: { ...settings.colors, soft_gold: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Shipment Countdown */}
      {activeTab === "shipment" && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">
            Prochain Envoi vers la Tunisie & Décompte
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Date de départ (YYYY-MM-DD) *</label>
              <input
                type="date"
                required
                value={settings.next_shipment.date}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    next_shipment: { ...settings.next_shipment, date: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Date limite commande</label>
              <input
                type="date"
                value={settings.next_shipment.deadline}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    next_shipment: { ...settings.next_shipment, deadline: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-semibold">Texte de la bannière (Français)</label>
              <input
                type="text"
                value={settings.next_shipment.textFr}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    next_shipment: { ...settings.next_shipment, textFr: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Currency Exchange Rate */}
      {activeTab === "currency" && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">
            Taux de Change & Mode de Commande
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Taux de Change EUR → TND *</label>
              <input
                type="number"
                step="0.01"
                required
                value={settings.exchange_rate_eur_tnd}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    exchange_rate_eur_tnd: parseFloat(e.target.value) || 3.45,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-bold text-lg"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Mode de Commande Public</label>
              <select
                value={settings.order_mode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    order_mode: e.target.value as "cart" | "whatsapp",
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 font-bold"
              >
                <option value="cart">Mode Panier & Formulaire (Mode B)</option>
                <option value="whatsapp">Mode Direct WhatsApp (Mode A)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Bar */}
      <div className="sticky bottom-6 p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 flex items-center justify-between shadow-xl">
        <p className="text-xs text-slate-400">
          Les modifications seront appliquées instantanément sur le site.
        </p>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Sauvegarde..." : "Enregistrer tous les paramètres"}</span>
        </button>
      </div>
    </form>
  );
}
