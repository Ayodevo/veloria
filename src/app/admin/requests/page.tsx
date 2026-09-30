import React from "react";
import { db } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RequestsManager } from "./RequestsManager";

export const revalidate = 0;

export default async function AdminRequestsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const allRequests = await db.query.requests.findMany({
    orderBy: (r, { desc }) => [desc(r.id)],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
          Gestion Unifiée des Commandes
        </h1>
        <p className="text-xs text-slate-400">
          Gérez vos commandes Veloria Select, Shein Concierge et Special Order Germany en un seul endroit.
        </p>
      </div>

      <RequestsManager initialRequests={allRequests} />
    </div>
  );
}
