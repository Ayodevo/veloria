import React from "react";
import { db } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, FileSpreadsheet, Phone, Mail, MapPin } from "lucide-react";

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const customersList = await db.query.customers.findMany({
    orderBy: (c, { desc }) => [desc(c.id)],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
            Clients & Marketing VIP
          </h1>
          <p className="text-xs text-slate-400">
            Base de données clients constituée automatiquement via les demandes de commande.
          </p>
        </div>

        <a
          href="/api/admin/export?type=customers"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700/50 text-xs font-bold flex items-center gap-2 hover:bg-emerald-900 transition-colors shadow-md"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Exporter la Liste Client (Excel)</span>
        </a>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Nom du Client</th>
                <th className="p-3.5">Téléphone WhatsApp</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Ville</th>
                <th className="p-3.5">Total Commandes</th>
                <th className="p-3.5">Total Dépensé (EUR)</th>
                <th className="p-3.5 text-right">Inscrit le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {customersList.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-200">{c.name}</td>
                  <td className="p-3.5 font-mono font-bold text-rose-400">{c.phone}</td>
                  <td className="p-3.5 text-slate-400">{c.email || "-"}</td>
                  <td className="p-3.5">{c.city || "-"}</td>
                  <td className="p-3.5 font-bold text-center">{c.totalOrders}</td>
                  <td className="p-3.5 font-bold text-emerald-400">
                    {(c.totalSpentEur / 100).toFixed(2)} €
                  </td>
                  <td className="p-3.5 text-right font-mono text-[11px] text-slate-500">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
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
