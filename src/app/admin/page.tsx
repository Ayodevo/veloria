import React from "react";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, TrendingUp, Clock, AlertTriangle, Truck, ArrowRight, Eye } from "lucide-react";
import { DashboardCharts } from "./DashboardCharts";

export const revalidate = 0; // Fresh dashboard metrics

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch metrics
  const allRequests = await db.query.requests.findMany({
    orderBy: (r, { desc }) => [desc(r.id)],
  });

  const allProducts = await db.query.products.findMany();
  const activeShipment = await db.query.shipments.findFirst({
    where: (s, { eq }) => eq(s.status, "active"),
  });

  const totalRequests = allRequests.length;
  const pendingQuoteRequests = allRequests.filter((r) => r.status === "received").length;
  const totalMarginEur = allRequests.reduce((sum, r) => sum + (r.marginEur || 0), 0) / 100;
  const totalRevenueEur = allRequests.reduce((sum, r) => sum + (r.totalEur || 0), 0) / 100;

  const lowStockProducts = allProducts.filter(
    (p) => p.isStockTracked && (p.totalStock || 0) <= 5
  );

  const recentRequests = allRequests.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
          Tableau de Bord VIP
        </h1>
        <p className="text-xs text-slate-400">
          Aperçu global de l'activité, des marges et des demandes en attente de devis.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Margin */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Marge Cumulée</span>
            <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-slate-100">
            {totalMarginEur.toFixed(2)} €
          </p>
          <p className="text-[11px] text-slate-500">
            Chiffre d'affaires : {totalRevenueEur.toFixed(2)} €
          </p>
        </div>

        {/* Card 2: Pending Quotes */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">À traiter (Devis)</span>
            <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/50">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-amber-400">
            {pendingQuoteRequests}
          </p>
          <p className="text-[11px] text-slate-500">Demandes en attente d'envoi de devis</p>
        </div>

        {/* Card 3: Total Requests */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Demandes</span>
            <div className="p-2 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/50">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-slate-100">
            {totalRequests}
          </p>
          <p className="text-[11px] text-slate-500">Select, Shein & Special Orders</p>
        </div>

        {/* Card 4: Active Shipment Batch */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Session d'Envoi</span>
            <div className="p-2 rounded-xl bg-sky-950/80 text-sky-400 border border-sky-800/50">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-bold text-sky-300">
            {activeShipment ? activeShipment.name : "Aucun envoi planifié"}
          </p>
          <p className="text-[11px] text-slate-500">
            {activeShipment
              ? `Départ : ${activeShipment.departureDate}`
              : "Créez une session d'envoi dans le menu"}
          </p>
        </div>
      </div>

      {/* Recharts Analytics Chart */}
      <DashboardCharts />

      {/* Low Stock Warning Box */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold">Alerte Stock Faible ({lowStockProducts.length} produits)</p>
              <p className="text-[11px] text-amber-300/80">
                {lowStockProducts.map((p) => p.slug).join(", ")}
              </p>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
          >
            Gérer les stocks
          </Link>
        </div>
      )}

      {/* Recent Requests Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-slate-100">
            Dernières Demandes Reçues
          </h3>
          <Link
            href="/admin/requests"
            className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Voir toutes les demandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Référence</th>
                <th className="p-3">Type</th>
                <th className="p-3">Client</th>
                <th className="p-3">Ville</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Montant EUR</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-rose-400">{req.reference}</td>
                  <td className="p-3 uppercase text-[11px] font-semibold text-slate-400">
                    {req.type}
                  </td>
                  <td className="p-3 font-medium text-slate-200">{req.customerName}</td>
                  <td className="p-3">{req.city}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        req.status === "received"
                          ? "bg-amber-950 text-amber-300 border border-amber-800/50"
                          : req.status === "delivered"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-100">
                    {((req.totalEur || 0) / 100).toFixed(2)} €
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/requests/${req.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-300 inline-flex items-center gap-1 transition-colors text-[11px] font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Gérer / Devis</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
