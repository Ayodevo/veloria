"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  Table,
  Eye,
  Trash2,
  Edit3,
  X,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  MapPin,
  Hash,
} from "lucide-react";

interface RequestsManagerProps {
  initialRequests: any[];
}

const STATUSES = [
  { key: "all", label: "Toutes" },
  { key: "received", label: "Reçues" },
  { key: "quote_sent", label: "Devis Envoyé" },
  { key: "confirmed", label: "Confirmées" },
  { key: "purchased", label: "Achetées" },
  { key: "in_transit", label: "En Route" },
  { key: "arrived_tn", label: "Arrivées TN" },
  { key: "delivered", label: "Livrées" },
  { key: "cancelled", label: "Annulées" },
];

const STATUS_COLORS: Record<string, string> = {
  received: "bg-amber-950 text-amber-300 border border-amber-800/50",
  quote_sent: "bg-blue-950 text-blue-300 border border-blue-800/50",
  confirmed: "bg-violet-950 text-violet-300 border border-violet-800/50",
  purchased: "bg-cyan-950 text-cyan-300 border border-cyan-800/50",
  in_transit: "bg-orange-950 text-orange-300 border border-orange-800/50",
  arrived_tn: "bg-teal-950 text-teal-300 border border-teal-800/50",
  delivered: "bg-emerald-950 text-emerald-300 border border-emerald-800/50",
  cancelled: "bg-rose-950 text-rose-300 border border-rose-800/50",
};

export function RequestsManager({ initialRequests }: RequestsManagerProps) {
  const [requests, setRequests] = useState<any[]>(initialRequests);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Modal state
  const [editModal, setEditModal] = useState<any | null>(null);
  const [deleteModal, setDeleteModal] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const openEdit = (req: any) => {
    setEditForm({
      status: req.status,
      customerName: req.customerName,
      phone: req.phone,
      city: req.city,
      notes: req.notes || "",
      trackingNumber: req.trackingNumber || "",
      totalEur: (req.totalEur / 100).toFixed(2),
      purchaseCostEur: (req.purchaseCostEur / 100).toFixed(2),
    });
    setEditModal(req);
  };

  const openDelete = (req: any) => setDeleteModal(req);

  const closeModals = () => {
    setEditModal(null);
    setDeleteModal(null);
    setSaving(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/requests/${editModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editForm.status,
          notes: editForm.notes,
          trackingNumber: editForm.trackingNumber,
          totalEur: Math.round(parseFloat(editForm.totalEur) * 100),
          purchaseCostEur: Math.round(parseFloat(editForm.purchaseCostEur) * 100),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Demande mise à jour !");
        setRequests((prev) =>
          prev.map((r) =>
            r.id === editModal.id
              ? {
                  ...r,
                  status: editForm.status,
                  notes: editForm.notes,
                  trackingNumber: editForm.trackingNumber,
                  totalEur: Math.round(parseFloat(editForm.totalEur) * 100),
                  purchaseCostEur: Math.round(parseFloat(editForm.purchaseCostEur) * 100),
                }
              : r
          )
        );
        closeModals();
      } else {
        showToast("error", data.error || "Erreur.");
      }
    } catch {
      showToast("error", "Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/requests/${deleteModal.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Demande ${deleteModal.reference} supprimée.`);
        setRequests((prev) => prev.filter((r) => r.id !== deleteModal.id));
        closeModals();
      } else {
        showToast("error", data.error || "Erreur.");
      }
    } catch {
      showToast("error", "Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  const filteredRequests = useMemo(
    () =>
      requests.filter((req) => {
        const q = searchQuery.toLowerCase();
        const matchSearch =
          req.reference?.toLowerCase().includes(q) ||
          req.customerName?.toLowerCase().includes(q) ||
          req.phone?.includes(q) ||
          req.city?.toLowerCase().includes(q);
        const matchStatus = selectedStatus === "all" || req.status === selectedStatus;
        const matchType = selectedType === "all" || req.type === selectedType;
        return matchSearch && matchStatus && matchType;
      }),
    [requests, searchQuery, selectedStatus, selectedType]
  );

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

      {/* Controls Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Rechercher réf, nom, tél, ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="all">Tous les types</option>
            <option value="select">Veloria Select</option>
            <option value="shein">Shein Concierge</option>
            <option value="special">Special Order</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === "table" ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
          >
            <Table className="w-4 h-4" />
            <span>Tableau</span>
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === "kanban" ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Kanban</span>
          </button>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUSES.map((st) => (
          <button
            key={st.key}
            onClick={() => setSelectedStatus(st.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStatus === st.key
                ? "bg-rose-500 text-white shadow-xs"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {st.label}
            {st.key !== "all" && (
              <span className="ml-1.5 opacity-60">
                ({requests.filter((r) => r.status === st.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table View */}
      {viewMode === "table" ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Référence</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Client & Contact</th>
                  <th className="p-3.5">Ville</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5">Total EUR</th>
                  <th className="p-3.5">Marge EUR</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                      Aucune demande trouvée.
                    </td>
                  </tr>
                )}
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-rose-400">{req.reference}</td>
                    <td className="p-3.5 uppercase font-semibold text-slate-400 text-[11px]">{req.type}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-200">{req.customerName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{req.phone}</p>
                    </td>
                    <td className="p-3.5 text-slate-300">{req.city}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_COLORS[req.status] || "bg-slate-800 text-slate-300"}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-100">{(req.totalEur / 100).toFixed(2)} €</td>
                    <td className="p-3.5 font-bold text-emerald-400">{(req.marginEur / 100).toFixed(2)} €</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/requests/${req.id}`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Voir détail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEdit(req)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-900 text-slate-300 hover:text-blue-300 transition-colors"
                          title="Modifier"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDelete(req)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-slate-950/50 border-t border-slate-800 text-[11px] text-slate-500">
            {filteredRequests.length} demande{filteredRequests.length !== 1 ? "s" : ""}
          </div>
        </div>
      ) : (
        /* Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto">
          {["received", "quote_sent", "confirmed", "purchased", "in_transit", "delivered"].map((statusKey) => {
            const colReqs = filteredRequests.filter((r) => r.status === statusKey);
            const label = STATUSES.find((s) => s.key === statusKey)?.label || statusKey;
            return (
              <div key={statusKey} className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3 flex flex-col min-w-[200px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{label}</h4>
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                    {colReqs.length}
                  </span>
                </div>
                <div className="space-y-3 flex-1">
                  {colReqs.map((req) => (
                    <div
                      key={req.id}
                      className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-rose-500/40 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-rose-400">{req.reference}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{req.type}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-200">{req.customerName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{req.phone}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs gap-1">
                        <span className="font-bold text-slate-300">{(req.totalEur / 100).toFixed(2)} €</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(req)} className="p-1 rounded bg-slate-800 hover:bg-blue-900 text-slate-400 hover:text-blue-300 transition-colors">
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <Link href={`/admin/requests/${req.id}`} className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                            <Eye className="w-3 h-3" />
                          </Link>
                          <button onClick={() => openDelete(req)} className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── EDIT MODAL ─── */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h2 className="font-serif font-bold text-slate-100 text-base">Modifier la demande</h2>
                <p className="text-xs text-rose-400 font-mono mt-0.5">{editModal.reference}</p>
              </div>
              <button onClick={closeModals} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEdit} className="p-6 space-y-4 text-xs">
              {/* Customer info (read-only display) */}
              <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-1.5"><PhoneCall className="w-3.5 h-3.5" />{editModal.phone}</div>
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{editModal.city}</div>
                <div className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" />#{editModal.id}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1.5 font-semibold">Statut *</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    {STATUSES.filter((s) => s.key !== "all").map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Total EUR */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Total Client (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.totalEur}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, totalEur: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Purchase Cost */}
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Coût d'achat (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.purchaseCostEur}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, purchaseCostEur: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Tracking */}
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1.5 font-semibold">N° de suivi colis</label>
                  <input
                    type="text"
                    value={editForm.trackingNumber}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, trackingNumber: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                    placeholder="Ex: TN123456789"
                  />
                </div>

                {/* Notes */}
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1.5 font-semibold">Notes internes</label>
                  <textarea
                    rows={3}
                    value={editForm.notes}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, notes: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 resize-none focus:outline-none focus:border-rose-500"
                    placeholder="Notes visibles uniquement par l'admin..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white font-bold transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Enregistrer
                </button>
                <button type="button" onClick={closeModals} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors">
                  Annuler
                </button>
                <Link href={`/admin/requests/${editModal.id}`} className="ml-auto flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors text-[11px] font-semibold">
                  <Eye className="w-3.5 h-3.5" />Fiche complète
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRM MODAL ─── */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-rose-900/50 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-950 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-100 text-base">Supprimer cette demande ?</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Irréversible. Les articles liés seront aussi supprimés.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1 text-xs">
                <p className="font-mono font-bold text-rose-400">{deleteModal.reference}</p>
                <p className="font-bold text-slate-200">{deleteModal.customerName}</p>
                <p className="text-slate-400">{deleteModal.phone} · {deleteModal.city}</p>
                <p className="text-slate-300 font-semibold">{(deleteModal.totalEur / 100).toFixed(2)} €</p>
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
                <button onClick={closeModals} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors">
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
