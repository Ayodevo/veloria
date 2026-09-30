"use client";

import React, { useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image,
  Link,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  ExternalLink,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type Banner = {
  id: number;
  title: string | null;
  subtitle: string | null;
  desktopImageUrl: string;
  mobileImageUrl: string | null;
  buttonLabel: string | null;
  buttonUrl: string | null;
  isActive: boolean | null;
  sortOrder: number | null;
};

function parseLang(value: string | null | undefined, lang = "fr"): string {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed[lang] || parsed["fr"] || parsed["ar"] || "";
    }
    return value;
  } catch {
    return value;
  }
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold border animate-slide-in ${
        type === "success"
          ? "bg-emerald-950 text-emerald-300 border-emerald-700/50"
          : "bg-rose-950 text-rose-300 border-rose-700/50"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-base font-bold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Banner Form ──────────────────────────────────────────────────────────────
function BannerForm({
  initial,
  onSubmit,
  loading,
}: {
  initial?: Partial<Banner>;
  onSubmit: (data: Record<string, unknown>) => void;
  loading: boolean;
}) {
  const [titleFr, setTitleFr] = useState(parseLang(initial?.title, "fr"));
  const [titleAr, setTitleAr] = useState(parseLang(initial?.title, "ar"));
  const [subtitleFr, setSubtitleFr] = useState(parseLang(initial?.subtitle, "fr"));
  const [subtitleAr, setSubtitleAr] = useState(parseLang(initial?.subtitle, "ar"));
  const [desktopImageUrl, setDesktopImageUrl] = useState(initial?.desktopImageUrl || "");
  const [mobileImageUrl, setMobileImageUrl] = useState(initial?.mobileImageUrl || "");
  const [buttonLabelFr, setButtonLabelFr] = useState(parseLang(initial?.buttonLabel, "fr"));
  const [buttonLabelAr, setButtonLabelAr] = useState(parseLang(initial?.buttonLabel, "ar"));
  const [buttonUrl, setButtonUrl] = useState(initial?.buttonUrl || "/");
  const [isActive, setIsActive] = useState(initial?.isActive !== false);
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      titleFr,
      titleAr,
      subtitleFr,
      subtitleAr,
      desktopImageUrl,
      mobileImageUrl: mobileImageUrl || desktopImageUrl,
      buttonLabelFr,
      buttonLabelAr,
      buttonUrl,
      isActive,
      sortOrder: Number(sortOrder),
    });
  };

  const inputClass =
    "w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/30 transition-colors";
  const labelClass = "block text-xs font-semibold text-slate-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Image Preview */}
      {desktopImageUrl && (
        <div className="relative rounded-2xl overflow-hidden aspect-[16/6] bg-slate-800 border border-slate-700">
          <img
            src={desktopImageUrl}
            alt="Banner preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full">
              Aperçu bannière
            </span>
          </div>
        </div>
      )}

      {/* Images */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={labelClass}>
            <span className="text-rose-400">*</span> URL Image Desktop
          </label>
          <input
            type="url"
            value={desktopImageUrl}
            onChange={(e) => setDesktopImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className={inputClass}
            required
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Recommandé : 1600×600px, format paysage
          </p>
        </div>
        <div>
          <label className={labelClass}>URL Image Mobile (optionnel)</label>
          <input
            type="url"
            value={mobileImageUrl}
            onChange={(e) => setMobileImageUrl(e.target.value)}
            placeholder="Laissez vide pour utiliser l'image desktop"
            className={inputClass}
          />
        </div>
      </div>

      {/* Link URL */}
      <div>
        <label className={labelClass}>
          <Link className="w-3.5 h-3.5 inline mr-1 text-rose-400" />
          URL de redirection au clic
        </label>
        <input
          type="text"
          value={buttonUrl}
          onChange={(e) => setButtonUrl(e.target.value)}
          placeholder="/select  ou  https://..."
          className={inputClass}
          required
        />
        <p className="text-[10px] text-slate-500 mt-1">
          Cliquer sur le bannière redirigera vers cette URL
        </p>
      </div>

      {/* Titles */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Titre (FR)</label>
          <input
            value={titleFr}
            onChange={(e) => setTitleFr(e.target.value)}
            placeholder="Titre en français"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Titre (AR)</label>
          <input
            dir="rtl"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            placeholder="العنوان بالعربية"
            className={inputClass}
          />
        </div>
      </div>

      {/* Subtitles */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Sous-titre (FR)</label>
          <textarea
            value={subtitleFr}
            onChange={(e) => setSubtitleFr(e.target.value)}
            placeholder="Sous-titre ou description..."
            rows={2}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Sous-titre (AR)</label>
          <textarea
            dir="rtl"
            value={subtitleAr}
            onChange={(e) => setSubtitleAr(e.target.value)}
            placeholder="النص الفرعي..."
            rows={2}
            className={inputClass}
          />
        </div>
      </div>

      {/* Button Labels */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Texte bouton (FR)</label>
          <input
            value={buttonLabelFr}
            onChange={(e) => setButtonLabelFr(e.target.value)}
            placeholder="Ex: Découvrir"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Texte bouton (AR)</label>
          <input
            dir="rtl"
            value={buttonLabelAr}
            onChange={(e) => setButtonLabelAr(e.target.value)}
            placeholder="اكتشفي"
            className={inputClass}
          />
        </div>
      </div>

      {/* Sort & Active */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className={labelClass}>Ordre d'affichage</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            min={0}
            className={`${inputClass} w-28`}
          />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isActive ? "bg-emerald-500" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-xs font-semibold text-slate-400">
            {isActive ? "Actif" : "Inactif"}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {initial?.id ? "Mettre à jour la bannière" : "Créer la bannière"}
      </button>
    </form>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({
  banner,
  onConfirm,
  onClose,
  loading,
}: {
  banner: Banner;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <Modal title="Supprimer la bannière" onClose={onClose}>
      <div className="space-y-4">
        {/* Preview */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/5] bg-slate-800">
          <img
            src={banner.desktopImageUrl}
            alt="Banner to delete"
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop";
            }}
          />
        </div>

        <div className="bg-rose-950/30 border border-rose-800/40 rounded-2xl p-4 space-y-1">
          <p className="text-sm font-bold text-rose-300">
            {parseLang(banner.title) || `Bannière #${banner.id}`}
          </p>
          {banner.buttonUrl && (
            <p className="text-xs text-slate-400">
              Lien : <span className="text-slate-300">{banner.buttonUrl}</span>
            </p>
          )}
        </div>

        <p className="text-sm text-slate-400">
          Cette action est <span className="text-rose-400 font-bold">irréversible</span>. La bannière sera définitivement supprimée.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors border border-slate-700"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function BannersManager({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [deleteBanner, setDeleteBanner] = useState<Banner | null>(null);
  const [isPending, startTransition] = useTransition();
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });

  // ── CREATE ────────────────────────────────────────────────────────────────
  const handleCreate = async (data: Record<string, unknown>) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      setBanners((prev) => [json.banner, ...prev].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
      setShowCreate(false);
      showToast("Bannière créée avec succès !", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ── UPDATE ────────────────────────────────────────────────────────────────
  const handleUpdate = async (data: Record<string, unknown>) => {
    if (!editBanner) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/banners/${editBanner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      setBanners((prev) =>
        prev.map((b) => (b.id === editBanner.id ? json.banner : b))
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      );
      setEditBanner(null);
      showToast("Bannière mise à jour !", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ── DELETE ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteBanner) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/banners/${deleteBanner.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      setBanners((prev) => prev.filter((b) => b.id !== deleteBanner.id));
      setDeleteBanner(null);
      showToast("Bannière supprimée.", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ── TOGGLE ACTIVE ─────────────────────────────────────────────────────────
  const handleToggleActive = async (banner: Banner) => {
    const updated = { ...banner, isActive: !banner.isActive };
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? updated : b)));
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      const json = await res.json();
      if (!res.ok) {
        setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
        showToast(json.error || "Erreur", "error");
      } else {
        showToast(updated.isActive ? "Bannière activée" : "Bannière désactivée", "success");
      }
    } catch {
      setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
      showToast("Erreur réseau", "error");
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Nouvelle bannière" onClose={() => setShowCreate(false)}>
          <BannerForm onSubmit={handleCreate} loading={actionLoading} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editBanner && (
        <Modal title="Modifier la bannière" onClose={() => setEditBanner(null)}>
          <BannerForm initial={editBanner} onSubmit={handleUpdate} loading={actionLoading} />
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteBanner && (
        <DeleteModal
          banner={deleteBanner}
          onConfirm={handleDelete}
          onClose={() => setDeleteBanner(null)}
          loading={actionLoading}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Image className="w-5 h-5 text-rose-400" />
            Bannières & Slider
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les images du slider hero sur la page d'accueil. Cliquer sur une bannière redirige vers l'URL configurée.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Nouvelle bannière
        </button>
      </div>

      {/* Info card */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <ExternalLink className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-400 leading-relaxed">
          Les bannières actives s'affichent en carrousel sur la page d'accueil publique dans l'ordre de tri.{" "}
          <strong className="text-slate-300">Cliquer sur la bannière</strong> redirige l'utilisateur vers l'URL de redirection configurée.
        </p>
      </div>

      {/* Banners Grid */}
      {banners.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-dashed border-slate-700">
          <Image className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-semibold">Aucune bannière</p>
          <p className="text-slate-600 text-xs mt-1">Créez votre première bannière pour le slider de la page d'accueil</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
          >
            + Créer une bannière
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className={`group relative bg-slate-900 border rounded-2xl overflow-hidden transition-all ${
                banner.isActive
                  ? "border-slate-700 hover:border-slate-600"
                  : "border-slate-800 opacity-60"
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image thumbnail */}
                <div className="relative sm:w-64 aspect-[16/6] sm:aspect-auto shrink-0 bg-slate-800">
                  <img
                    src={banner.desktopImageUrl}
                    alt={parseLang(banner.title) || `Banner #${banner.id}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  {/* Order badge */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    #{banner.sortOrder ?? idx + 1}
                  </div>
                  {/* Active badge */}
                  <div
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      banner.isActive
                        ? "bg-emerald-500/90 text-white"
                        : "bg-slate-600/90 text-slate-200"
                    }`}
                  >
                    {banner.isActive ? "Actif" : "Inactif"}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-100 text-sm">
                      {parseLang(banner.title) || (
                        <span className="text-slate-500 italic">Sans titre</span>
                      )}
                    </h3>
                    {parseLang(banner.subtitle) && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {parseLang(banner.subtitle)}
                      </p>
                    )}

                    {/* Link URL */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Link className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="text-xs text-slate-400 font-mono truncate">
                        {banner.buttonUrl || "/"}
                      </span>
                      {banner.buttonUrl && (
                        <a
                          href={banner.buttonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Toggle active */}
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors border ${
                        banner.isActive
                          ? "bg-emerald-950/50 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900/50"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                      }`}
                    >
                      {banner.isActive ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                      {banner.isActive ? "Actif" : "Désactivé"}
                    </button>

                    <button
                      onClick={() => setEditBanner(banner)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Modifier
                    </button>

                    <button
                      onClick={() => setDeleteBanner(banner)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-rose-950/40 text-rose-400 border border-rose-900/40 hover:bg-rose-900/50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.35s ease; }
      `}</style>
    </>
  );
}
