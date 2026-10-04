import React from "react";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  AlertTriangle,
  Truck,
  ArrowRight,
  Eye,
  Euro,
  Users,
  Package,
} from "lucide-react";
import { DashboardCharts } from "./DashboardCharts";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

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

  const statusConfig: Record<string, { label: string; classes: string }> = {
    received: {
      label: "Reçue",
      classes: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    },
    quoted: {
      label: "Devis envoyé",
      classes: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
    },
    paid: {
      label: "Payée",
      classes: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    },
    shipped: {
      label: "Expédiée",
      classes: "bg-violet-500/15 text-violet-300 border border-violet-500/30",
    },
    delivered: {
      label: "Livrée",
      classes: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    },
    cancelled: {
      label: "Annulée",
      classes: "bg-red-500/15 text-red-400 border border-red-500/30",
    },
  };

  return (
    <div className="space-y-8">
      {/* ══════════════════════════════
          HEADER
      ══════════════════════════════ */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* Butterfly accent */}
            <svg className="w-5 h-5 text-[#e891aa] opacity-80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C10 2 6 4 6 8c0 2 1 3.5 2 4.5C6 13 2 15 2 18c0 2 2 4 6 3.5C9.5 21 11 20 12 19c1 1 2.5 2 4 2.5C20 22 22 20 22 18c0-3-4-5-6-5.5C17 11.5 18 10 18 8c0-4-4-6-6-6z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#e891aa]">
              Veloria Admin
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
            Tableau de Bord
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vue d&apos;ensemble · Marges · Demandes en attente
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c4607a]/10 border border-[#c4607a]/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400 font-medium">Live</span>
        </div>
      </div>

      {/* ══════════════════════════════
          KPI CARDS
      ══════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Margin */}
        <div className="admin-kpi-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Marge Cumulée
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold font-serif admin-stat-number">
              {totalMarginEur.toFixed(2)} €
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              CA total : <span className="text-slate-400">{totalRevenueEur.toFixed(2)} €</span>
            </p>
          </div>
          <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
              style={{ width: totalRevenueEur > 0 ? `${Math.min((totalMarginEur / totalRevenueEur) * 100, 100)}%` : "0%" }}
            />
          </div>
        </div>

        {/* Pending Quotes */}
        <div className="admin-kpi-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              À traiter (Devis)
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <p className={`text-3xl font-bold font-serif ${pendingQuoteRequests > 0 ? "text-amber-400" : "text-slate-400"}`}>
              {pendingQuoteRequests}
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Demandes en attente de devis
            </p>
          </div>
          {pendingQuoteRequests > 0 && (
            <Link
              href="/admin/requests"
              className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              <span>Traiter maintenant</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Total Requests */}
        <div className="admin-kpi-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Demandes
            </span>
            <div className="p-2 rounded-xl bg-[#c4607a]/10 border border-[#c4607a]/20">
              <ShoppingBag className="w-4 h-4 text-[#e891aa]" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold font-serif text-slate-100">
              {totalRequests}
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Select · Shein · Special Orders
            </p>
          </div>
          <div className="flex gap-1">
            {["select", "shein", "special"].map((type) => {
              const count = allRequests.filter((r) => r.type === type).length;
              const pct = totalRequests > 0 ? (count / totalRequests) * 100 : 0;
              const colors: Record<string, string> = {
                select: "bg-[#c4607a]",
                shein: "bg-[#8b2252]",
                special: "bg-[#5a1035]",
              };
              return (
                <div
                  key={type}
                  className={`h-1 rounded-full ${colors[type]} transition-all`}
                  style={{ width: `${pct}%`, minWidth: count > 0 ? "4px" : "0" }}
                />
              );
            })}
          </div>
        </div>

        {/* Active Shipment */}
        <div className="admin-kpi-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Session d&apos;Envoi
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <Truck className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div>
            <p className={`text-sm font-bold font-serif leading-snug ${activeShipment ? "text-sky-300" : "text-slate-500"}`}>
              {activeShipment ? activeShipment.name : "Aucun envoi planifié"}
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              {activeShipment
                ? `Départ : ${activeShipment.departureDate}`
                : "Créez une session dans le menu"}
            </p>
          </div>
          {activeShipment && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-[11px] text-sky-400 font-medium">En cours</span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════
          ANALYTICS CHART
      ══════════════════════════════ */}
      <div className="admin-kpi-card rounded-2xl overflow-hidden">
        <div className="px-6 pt-5 pb-2 border-b border-white/5">
          <h3 className="font-serif text-base font-bold text-slate-200">
            Analytiques & Tendances
          </h3>
          <p className="text-[11px] text-slate-500">Évolution des demandes et revenus</p>
        </div>
        <DashboardCharts />
      </div>

      {/* ══════════════════════════════
          LOW STOCK WARNING
      ══════════════════════════════ */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-2xl p-4 border bg-amber-500/5 border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300">
                Stock Faible — {lowStockProducts.length} produit{lowStockProducts.length > 1 ? "s" : ""}
              </p>
              <p className="text-[11px] text-amber-400/60 mt-0.5">
                {lowStockProducts.map((p) => p.slug).slice(0, 4).join(", ")}
                {lowStockProducts.length > 4 && ` +${lowStockProducts.length - 4} autres`}
              </p>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shrink-0"
          >
            Gérer les stocks
          </Link>
        </div>
      )}

      {/* ══════════════════════════════
          RECENT REQUESTS TABLE
      ══════════════════════════════ */}
      <div className="admin-kpi-card rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-slate-100">
              Dernières Demandes
            </h3>
            <p className="text-[11px] text-slate-500">Les 5 plus récentes</p>
          </div>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c4607a]/10 hover:bg-[#c4607a]/20 text-[#e891aa] text-xs font-semibold border border-[#c4607a]/20 transition-colors"
          >
            <span>Voir toutes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="bg-slate-950/50 text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="px-5 py-3">Référence</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3 hidden md:table-cell">Ville</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 hidden sm:table-cell">Montant</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentRequests.map((req) => {
                const status = statusConfig[req.status] ?? {
                  label: req.status,
                  classes: "bg-slate-800 text-slate-300 border border-slate-700",
                };
                return (
                  <tr
                    key={req.id}
                    className="hover:bg-white/3 transition-colors group"
                  >
                    <td className="px-5 py-4 font-mono font-bold text-[#e891aa] text-[11px]">
                      {req.reference}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        req.type === "select"
                          ? "bg-[#c4607a]/15 text-[#e891aa] border border-[#c4607a]/25"
                          : req.type === "shein"
                          ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                          : "bg-sky-500/15 text-sky-300 border border-sky-500/25"
                      }`}>
                        {req.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-200">{req.customerName}</td>
                    <td className="px-5 py-4 text-slate-400 hidden md:table-cell">{req.city}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${status.classes}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-100 hidden sm:table-cell">
                      {((req.totalEur || 0) / 100).toFixed(2)} €
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c4607a]/10 hover:bg-[#c4607a]/25 text-[#e891aa] border border-[#c4607a]/20 transition-all text-[11px] font-semibold group-hover:border-[#c4607a]/40"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Gérer</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {recentRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500 text-xs">
                    Aucune demande pour l&apos;instant
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════
          QUICK ACTIONS
      ══════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: "/admin/products", icon: Package, label: "Produits", count: allProducts.length, color: "from-[#c4607a]/20 to-[#8b2252]/20 border-[#c4607a]/20" },
          { href: "/admin/requests", icon: ShoppingBag, label: "Demandes", count: totalRequests, color: "from-sky-500/10 to-sky-600/10 border-sky-500/20" },
          { href: "/admin/shipments", icon: Truck, label: "Envois", count: activeShipment ? 1 : 0, color: "from-emerald-500/10 to-emerald-600/10 border-emerald-500/20" },
          { href: "/admin/customers", icon: Users, label: "Clients", count: null, color: "from-violet-500/10 to-violet-600/10 border-violet-500/20" },
        ].map(({ href, icon: Icon, label, count, color }) => (
          <Link
            key={href}
            href={href}
            className={`group admin-kpi-card rounded-2xl p-5 bg-gradient-to-br ${color} flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300`}
          >
            <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            <div>
              {count !== null && (
                <p className="text-2xl font-bold font-serif text-slate-200">{count}</p>
              )}
              <p className="text-[11px] text-slate-500 font-medium">{label}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
