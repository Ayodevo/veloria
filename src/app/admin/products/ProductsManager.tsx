"use client";

import React, { useState, useCallback } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Save,
  ImageIcon,
  PackageX,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface ProductsManagerProps {
  initialProducts: any[];
  categories: any[];
  brands: any[];
}

type ProductForm = {
  nameFr: string;
  nameAr: string;
  slug: string;
  priceEur: number;
  comparePriceEur: number;
  totalStock: number;
  mainImageUrl: string;
  shortDescFr: string;
  badgeFr: string;
  status: string;
  categoryId: string;
};

const emptyForm: ProductForm = {
  nameFr: "",
  nameAr: "",
  slug: "",
  priceEur: 25.0,
  comparePriceEur: 0,
  totalStock: 10,
  mainImageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
  shortDescFr: "",
  badgeFr: "",
  status: "active",
  categoryId: "",
};

function parseProductName(p: any): string {
  if (!p?.name) return "—";
  if (typeof p.name === "string") {
    try {
      const parsed = JSON.parse(p.name);
      return parsed.fr || parsed.ar || p.name;
    } catch {
      return p.name;
    }
  }
  return p.name?.fr || p.name?.ar || "—";
}

function productToForm(p: any): ProductForm {
  let nameFr = "", nameAr = "";
  if (typeof p.name === "string") {
    try {
      const parsed = JSON.parse(p.name);
      nameFr = parsed.fr || "";
      nameAr = parsed.ar || "";
    } catch {
      nameFr = p.name;
    }
  } else if (p.name) {
    nameFr = p.name.fr || "";
    nameAr = p.name.ar || "";
  }
  let shortDescFr = "";
  if (p.shortDescription) {
    try {
      const parsed = JSON.parse(p.shortDescription);
      shortDescFr = parsed.fr || shortDescFr;
    } catch {
      shortDescFr = p.shortDescription;
    }
  }
  let badgeFr = "";
  if (p.badgeText) {
    try {
      const parsed = JSON.parse(p.badgeText);
      badgeFr = parsed.fr || badgeFr;
    } catch {
      badgeFr = p.badgeText;
    }
  }
  return {
    nameFr,
    nameAr,
    slug: p.slug || "",
    priceEur: (p.priceEur || 0) / 100,
    comparePriceEur: (p.comparePriceEur || 0) / 100,
    totalStock: p.totalStock ?? 0,
    mainImageUrl: p.mainImageUrl || "",
    shortDescFr,
    badgeFr,
    status: p.status || "active",
    categoryId: p.categoryId?.toString() || "",
  };
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-950 text-emerald-300 border border-emerald-800/50",
  hidden: "bg-slate-800 text-slate-400 border border-slate-700",
  out_of_stock: "bg-amber-950 text-amber-300 border border-amber-800/50",
};
const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  hidden: "Masqué",
  out_of_stock: "Rupture",
};

export function ProductsManager({ initialProducts, categories, brands }: ProductsManagerProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal state
  const [modal, setModal] = useState<null | "create" | "edit" | "delete">(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingProduct(null);
    setModal("create");
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    setForm(productToForm(p));
    setModal("edit");
  };

  const openDelete = (p: any) => {
    setEditingProduct(p);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setEditingProduct(null);
    setSaving(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: { fr: form.nameFr, ar: form.nameAr || form.nameFr },
        slug: form.slug || form.nameFr.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        priceEur: Math.round(form.priceEur * 100),
        comparePriceEur: form.comparePriceEur ? Math.round(form.comparePriceEur * 100) : null,
        totalStock: form.totalStock,
        mainImageUrl: form.mainImageUrl,
        shortDescription: form.shortDescFr ? { fr: form.shortDescFr, ar: form.shortDescFr } : null,
        badgeText: form.badgeFr ? { fr: form.badgeFr, ar: form.badgeFr } : null,
        status: form.status,
        categoryId: form.categoryId ? parseInt(form.categoryId, 10) : null,
      };

      const isEdit = modal === "edit" && editingProduct;
      const url = isEdit ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success || res.ok) {
        showToast("success", isEdit ? "Produit mis à jour !" : "Produit créé !");
        // Optimistic update
        if (isEdit) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === editingProduct.id
                ? { ...p, ...payload, name: JSON.stringify(payload.name), priceEur: payload.priceEur }
                : p
            )
          );
        } else {
          // Reload to get the new product with generated id
          setTimeout(() => window.location.reload(), 1000);
        }
        closeModal();
      } else {
        showToast("error", data.error || "Erreur inconnue.");
      }
    } catch {
      showToast("error", "Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Produit supprimé.");
        setProducts((prev) => prev.filter((p) => p.id !== editingProduct.id));
        closeModal();
      } else {
        showToast("error", data.error || "Erreur de suppression.");
      }
    } catch {
      showToast("error", "Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) => {
    const name = parseProductName(p).toLowerCase();
    const matchSearch = name.includes(searchQuery.toLowerCase()) || p.slug?.includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold border animate-in slide-in-from-top-4 duration-300 ${
            toast.type === "success"
              ? "bg-emerald-950 text-emerald-200 border-emerald-700"
              : "bg-rose-950 text-rose-200 border-rose-700"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="hidden">Masqué</option>
            <option value="out_of_stock">Rupture</option>
          </select>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau Produit
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Image</th>
                <th className="p-3.5">Produit</th>
                <th className="p-3.5">Prix EUR</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Statut</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <PackageX className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>Aucun produit trouvé</p>
                  </td>
                </tr>
              )}
              {filtered.map((p) => {
                const name = parseProductName(p);
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="p-3.5">
                      <img
                        src={p.mainImageUrl}
                        alt=""
                        className="w-11 h-11 object-cover rounded-xl border border-slate-800"
                      />
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-200">{name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{p.slug}</p>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-rose-400">
                      {(p.priceEur / 100).toFixed(2)} €
                      {p.comparePriceEur > 0 && (
                        <span className="ml-1.5 text-slate-500 line-through text-[10px]">
                          {(p.comparePriceEur / 100).toFixed(2)} €
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-bold">
                      <span className={p.totalStock <= 5 ? "text-amber-400" : "text-emerald-400"}>
                        {p.totalStock} unités
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[p.status] || STATUS_STYLES.hidden}`}>
                        {STATUS_LABELS[p.status] || p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-900 text-slate-300 hover:text-blue-300 transition-colors"
                          title="Modifier"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDelete(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-slate-950/50 border-t border-slate-800 text-[11px] text-slate-500">
          {filtered.length} produit{filtered.length !== 1 ? "s" : ""} affiché{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ─── CREATE / EDIT MODAL ─── */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="font-serif text-lg font-bold text-slate-100">
                {modal === "edit" ? "Modifier le produit" : "Nouveau Produit"}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Image Preview */}
              {form.mainImageUrl && (
                <div className="flex items-center gap-4 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <img src={form.mainImageUrl} alt="" className="w-16 h-16 object-cover rounded-xl border border-slate-700" />
                  <p className="text-xs text-slate-400">Aperçu de l'image principale</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Nom FR */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Nom (Français) *</label>
                  <input
                    required
                    type="text"
                    value={form.nameFr}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => ({
                        ...f,
                        nameFr: v,
                        slug: f.slug || v.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      }));
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                    placeholder="Ex: Rare Beauty Soft Pinch Blush"
                  />
                </div>

                {/* Nom AR */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Nom (Arabe)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.nameAr}
                    onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                    placeholder="اسم المنتج بالعربية"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Slug URL *</label>
                  <input
                    required
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                    placeholder="rare-beauty-blush"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Statut *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="active">Actif — visible en boutique</option>
                    <option value="hidden">Masqué — brouillon</option>
                    <option value="out_of_stock">Rupture de stock</option>
                  </select>
                </div>

                {/* Prix EUR */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Prix (€) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.priceEur}
                    onChange={(e) => setForm((f) => ({ ...f, priceEur: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Prix barré */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Prix Barré (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.comparePriceEur}
                    onChange={(e) => setForm((f) => ({ ...f, comparePriceEur: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                    placeholder="0 = aucun"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Stock Total *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.totalStock}
                    onChange={(e) => setForm((f) => ({ ...f, totalStock: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Badge Promo</label>
                  <input
                    type="text"
                    value={form.badgeFr}
                    onChange={(e) => setForm((f) => ({ ...f, badgeFr: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                    placeholder="Ex: Nouveau, Promo, Best-seller..."
                  />
                </div>

                {/* Catégorie */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-slate-400 mb-1.5 font-semibold">Catégorie</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                    >
                      <option value="">— Sans catégorie —</option>
                      {categories.map((c: any) => {
                        const name = typeof c.name === "string"
                          ? ((() => { try { return JSON.parse(c.name).fr || c.name; } catch { return c.name; } })())
                          : c.name?.fr || c.name;
                        return <option key={c.id} value={c.id}>{name}</option>;
                      })}
                    </select>
                  </div>
                )}

                {/* Image URL */}
                <div className={categories.length > 0 ? "" : "sm:col-span-2"}>
                  <label className="block text-slate-400 mb-1.5 font-semibold">URL Image Principale *</label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      required
                      type="url"
                      value={form.mainImageUrl}
                      onChange={(e) => setForm((f) => ({ ...f, mainImageUrl: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Description courte */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1.5 font-semibold">Description courte (FR)</label>
                  <textarea
                    rows={2}
                    value={form.shortDescFr}
                    onChange={(e) => setForm((f) => ({ ...f, shortDescFr: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 resize-none focus:outline-none focus:border-rose-500"
                    placeholder="Ex: Blush minéral longue tenue aux teintes naturelles..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white text-xs font-bold shadow-md transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {modal === "edit" ? "Enregistrer les modifications" : "Créer le produit"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRM MODAL ─── */}
      {modal === "delete" && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-rose-900/50 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-950 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-100 text-base">Supprimer ce produit ?</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Cette action est irréversible.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                <img src={editingProduct.mainImageUrl} alt="" className="w-12 h-12 object-cover rounded-xl" />
                <div>
                  <p className="font-bold text-slate-200 text-sm">{parseProductName(editingProduct)}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{editingProduct.slug}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 disabled:opacity-60 text-white text-xs font-bold transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Supprimer définitivement
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
