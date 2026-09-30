import React from "react";
import { getSiteSettings } from "@/lib/settings";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "./SettingsForm";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
          Paramètres du Site & Charte Graphique
        </h1>
        <p className="text-xs text-slate-400">
          Modifiez le nom du site, les couleurs de la charte graphique, les taux de change et la date du prochain envoi sans toucher au code.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
