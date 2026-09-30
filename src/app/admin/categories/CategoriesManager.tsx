"use client";

import React, { useState } from "react";
import {
  Plus, Edit3, Trash2, X, Save, Loader2,
  CheckCircle2, AlertTriangle, Eye, EyeOff,
  ImageIcon, Layers, Tag, GripVertical,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseName(raw: any): string {
  if (!raw) return "—";
  if (typeof raw === "string") {
    try { const p = JSON.parse(raw); return p.fr || p.ar || raw; } catch { return raw; }
  }
  return raw?.fr || raw?.ar || "—";
}

function toSlug(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function Toast({ toast }: { toast: { type: "success" | "error"; msg: string } | null }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold border animate-in slide-in-from-top-4 duration-300 ${toast.type === "success" ? "bg-emerald-950 text-emerald-200 border-emerald-700" : "bg-rose-950 text-rose-200 border-rose-700"}`}>
      {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      {toast.msg}
    </div>
  );
}

// ─── Category Manager ─────────────────────────────────────────────────────────

interface CatForm { nameFr: string; nameAr: string; slug: string; imageUrl: string; sortOrder: number; isVisible: boolean; }
const emptyCat: CatForm = { nameFr: "", nameAr: "", slug: "", imageUrl: "", sortOrder: 0, isVisible: true };

export function CategoriesManager({ initialCategories }: { initialCategories: any[] }) {
  const [items, setItems] = useState<any[]>(initialCategories);
  const [modal, setModal] = useState<null | "create" | "edit" | "delete">(null);
  const [active, setActive] = useState<any | null>(null);
  const [form, setForm] = useState<CatForm>(emptyCat);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreate = () => { setForm(emptyCat); setActive(null); setModal("create"); };
  const openEdit = (item: any) => {
    let nameFr = "", nameAr = "";
    if (typeof item.name === "string") {
      try { const p = JSON.parse(item.name); nameFr = p.fr || ""; nameAr = p.ar || ""; } catch { nameFr = item.name; }
    } else { nameFr = item.name?.fr || ""; nameAr = item.name?.ar || ""; }
    setForm({ nameFr, nameAr, slug: item.slug, imageUrl: item.imageUrl || "", sortOrder: item.sortOrder || 0, isVisible: item.isVisible !== false });
    setActive(item);
    setModal("edit");
  };
  const openDelete = (item: any) => { setActive(item); setModal("delete"); };
  const close = () => { setModal(null); setActive(null); setSaving(false); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = modal === "edit" && active;
      const url = isEdit ? `/api/admin/categories/${active.id}` : "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        showToast("success", isEdit ? "Catégorie mise à jour !" : "Catégorie créée !");
        if (isEdit) {
          const nameStr = JSON.stringify({ fr: form.nameFr, ar: form.nameAr || form.nameFr });
          setItems(prev => prev.map(i => i.id === active.id ? { ...i, name: nameStr, slug: form.slug, imageUrl: form.imageUrl, sortOrder: form.sortOrder, isVisible: form.isVisible } : i));
        } else {
          // add optimistically with a temp id; server returns real one
          const newItem = data.category || { id: Date.now(), name: JSON.stringify({ fr: form.nameFr, ar: form.nameAr }), slug: form.slug, imageUrl: form.imageUrl, sortOrder: form.sortOrder, isVisible: form.isVisible };
          setItems(prev => [...prev, newItem].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
        }
        close();
      } else {
        showToast("error", data.error || "Erreur.");
      }
    } catch { showToast("error", "Erreur réseau."); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!active) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${active.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Catégorie supprimée.");
        setItems(prev => prev.filter(i => i.id !== active.id));
        close();
      } else {
        showToast("error", data.error || "Erreur.");
      }
    } catch { showToast("error", "Erreur réseau."); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Toast toast={toast} />

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-400" />
            Catégories <span className="text-slate-500 font-normal text-sm">({items.length})</span>
          </h3>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5" /> Nouvelle catégorie
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-800/60">
          {items.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Aucune catégorie. Créez-en une !
            </div>
          )}
          {items.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/30 transition-colors group">
              <GripVertical className="w-4 h-4 text-slate-700 flex-shrink-0" />
              {cat.imageUrl ? (
                <img src={cat.imageUrl} alt="" className="w-9 h-9 object-cover rounded-lg border border-slate-800 flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4 text-slate-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{parseName(cat.name)}</p>
                <p className="text-[10px] text-slate-500 font-mono">/{cat.slug}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-slate-500">Ordre: {cat.sortOrder ?? 0}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${cat.isVisible !== false ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40" : "bg-slate-800 text-slate-400"}`}>
                  {cat.isVisible !== false ? "Visible" : "Masqué"}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-900 text-slate-400 hover:text-blue-300 transition-colors" title="Modifier">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => openDelete(cat)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors" title="Supprimer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h2 className="font-serif font-bold text-slate-100">{modal === "edit" ? "Modifier la catégorie" : "Nouvelle catégorie"}</h2>
              <button onClick={close} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Nom (Français) *</label>
                  <input required type="text" value={form.nameFr}
                    onChange={e => { const v = e.target.value; setForm(f => ({ ...f, nameFr: v, slug: f.slug || toSlug(v) })); }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                    placeholder="Ex: Maquillage" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Nom (Arabe)</label>
                  <input type="text" dir="rtl" value={form.nameAr}
                    onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                    placeholder="مكياج" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Slug URL *</label>
                  <input required type="text" value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                    placeholder="maquillage" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Ordre d'affichage</label>
                  <input type="number" min="0" value={form.sortOrder}
                    onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-rose-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1.5 font-semibold">URL Image (optionnel)</label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input type="url" value={form.imageUrl}
                      onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                      placeholder="https://..." />
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <button type="button" onClick={() => setForm(f => ({ ...f, isVisible: !f.isVisible }))}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.isVisible ? "bg-emerald-600" : "bg-slate-700"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isVisible ? "translate-x-5" : ""}`} />
                  </button>
                  <span className="text-slate-400">{form.isVisible ? "Visible sur le site" : "Masquée (brouillon)"}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-slate-800">
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white font-bold transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {modal === "edit" ? "Enregistrer" : "Créer"}
                </button>
                <button type="button" onClick={close} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {modal === "delete" && active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-rose-900/40 rounded-3xl w-full max-w-sm shadow-2xl">
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-950 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-100">Supprimer cette catégorie ?</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Les produits liés ne seront pas supprimés.</p>
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                <p className="font-bold text-slate-200">{parseName(active.name)}</p>
                <p className="text-slate-500 font-mono">/{active.slug}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDelete} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 disabled:opacity-60 text-white text-xs font-bold transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Supprimer
                </button>
                <button onClick={close} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Brand Manager ────────────────────────────────────────────────────────────

interface BrandForm { name: string; slug: string; logoUrl: string; sortOrder: number; isVisible: boolean; }
const emptyBrand: BrandForm = { name: "", slug: "", logoUrl: "", sortOrder: 0, isVisible: true };

export function BrandsManager({ initialBrands }: { initialBrands: any[] }) {
  const [items, setItems] = useState<any[]>(initialBrands);
  const [modal, setModal] = useState<null | "create" | "edit" | "delete">(null);
  const [active, setActive] = useState<any | null>(null);
  const [form, setForm] = useState<BrandForm>(emptyBrand);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreate = () => { setForm(emptyBrand); setActive(null); setModal("create"); };
  const openEdit = (item: any) => {
    setForm({ name: item.name, slug: item.slug, logoUrl: item.logoUrl || "", sortOrder: item.sortOrder || 0, isVisible: item.isVisible !== false });
    setActive(item);
    setModal("edit");
  };
  const openDelete = (item: any) => { setActive(item); setModal("delete"); };
  const close = () => { setModal(null); setActive(null); setSaving(false); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = modal === "edit" && active;
      const url = isEdit ? `/api/admin/brands/${active.id}` : "/api/admin/brands";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success || res.ok) {
        showToast("success", isEdit ? "Marque mise à jour !" : "Marque créée !");
        if (isEdit) {
          setItems(prev => prev.map(i => i.id === active.id ? { ...i, ...form } : i));
        } else {
          const newItem = data.brand || { id: Date.now(), ...form };
          setItems(prev => [...prev, newItem].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
        }
        close();
      } else {
        showToast("error", data.error || "Erreur.");
      }
    } catch { showToast("error", "Erreur réseau."); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!active) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/brands/${active.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Marque supprimée.");
        setItems(prev => prev.filter(i => i.id !== active.id));
        close();
      } else {
        showToast("error", data.error || "Erreur.");
      }
    } catch { showToast("error", "Erreur réseau."); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Toast toast={toast} />

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            Marques <span className="text-slate-500 font-normal text-sm">({items.length})</span>
          </h3>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5" /> Nouvelle marque
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-800/60">
          {items.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Tag className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Aucune marque. Créez-en une !
            </div>
          )}
          {items.map((brand) => (
            <div key={brand.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/30 transition-colors group">
              <GripVertical className="w-4 h-4 text-slate-700 flex-shrink-0" />
              {brand.logoUrl ? (
                <img src={brand.logoUrl} alt="" className="w-9 h-9 object-contain rounded-lg border border-slate-800 bg-white/5 p-1 flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4 text-slate-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{brand.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">/{brand.slug}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-slate-500">Ordre: {brand.sortOrder ?? 0}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${brand.isVisible !== false ? "bg-amber-950 text-amber-300 border border-amber-800/40" : "bg-slate-800 text-slate-400"}`}>
                  {brand.isVisible !== false ? "Active" : "Masquée"}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(brand)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-900 text-slate-400 hover:text-blue-300 transition-colors" title="Modifier">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => openDelete(brand)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors" title="Supprimer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h2 className="font-serif font-bold text-slate-100">{modal === "edit" ? "Modifier la marque" : "Nouvelle marque"}</h2>
              <button onClick={close} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Nom de la marque *</label>
                  <input required type="text" value={form.name}
                    onChange={e => { const v = e.target.value; setForm(f => ({ ...f, name: v, slug: f.slug || toSlug(v) })); }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500"
                    placeholder="Ex: Charlotte Tilbury" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Slug URL *</label>
                  <input required type="text" value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="charlotte-tilbury" />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1.5 font-semibold">URL Logo</label>
                  <div className="flex items-center gap-3">
                    {form.logoUrl && <img src={form.logoUrl} alt="" className="w-10 h-10 object-contain rounded-lg border border-slate-800 bg-white/5 p-1" />}
                    <div className="relative flex-1">
                      <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input type="url" value={form.logoUrl}
                        onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500"
                        placeholder="https://..." />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Ordre d'affichage</label>
                  <input type="number" min="0" value={form.sortOrder}
                    onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-bold focus:outline-none focus:border-amber-500" />
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button type="button" onClick={() => setForm(f => ({ ...f, isVisible: !f.isVisible }))}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.isVisible ? "bg-amber-600" : "bg-slate-700"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isVisible ? "translate-x-5" : ""}`} />
                  </button>
                  <span className="text-slate-400">{form.isVisible ? "Active" : "Masquée"}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-slate-800">
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-bold transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {modal === "edit" ? "Enregistrer" : "Créer"}
                </button>
                <button type="button" onClick={close} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {modal === "delete" && active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-rose-900/40 rounded-3xl w-full max-w-sm shadow-2xl">
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-950 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-100">Supprimer cette marque ?</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Les produits liés ne seront pas supprimés.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                {active.logoUrl && <img src={active.logoUrl} alt="" className="w-10 h-10 object-contain rounded-lg border border-slate-800 bg-white/5 p-1" />}
                <div className="text-xs">
                  <p className="font-bold text-slate-200">{active.name}</p>
                  <p className="text-slate-500 font-mono">/{active.slug}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDelete} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 disabled:opacity-60 text-white text-xs font-bold transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Supprimer
                </button>
                <button onClick={close} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
