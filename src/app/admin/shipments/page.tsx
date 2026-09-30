import React from "react";
import { db } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Truck, Calendar, Clock, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function AdminShipmentsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const shipmentsList = await db.query.shipments.findMany({
    orderBy: (s, { desc }) => [desc(s.id)],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
          Sessions d'Envoi d'Allemagne
        </h1>
        <p className="text-xs text-slate-400">
          La session active alimente automatiquement la bannière d'annonce et le décompte sur le site public.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-sky-400" />
          <span>Batches d'Expédition ({shipmentsList.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shipmentsList.map((s) => (
            <div
              key={s.id}
              className={`p-5 rounded-2xl border ${
                s.status === "active"
                  ? "bg-slate-950 border-sky-500/50 shadow-md"
                  : "bg-slate-950/60 border-slate-800"
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-bold text-slate-100">
                  {s.name}
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    s.status === "active"
                      ? "bg-sky-950 text-sky-300 border border-sky-700/50"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {s.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-400 font-mono">
                <p className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  <span>Date de Départ : <strong className="text-slate-200">{s.departureDate}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Date Limite Commande : <strong className="text-slate-200">{s.orderDeadline}</strong></span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
