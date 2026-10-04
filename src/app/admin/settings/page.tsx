import React from "react";
import { getSiteSettings } from "@/lib/settings";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { schema } from "@/db";
import { eq } from "drizzle-orm";
import { SettingsForm } from "./SettingsForm";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await getSiteSettings();

  // Load homepage settings from DB (stored as JSON under key "homepage")
  let initialHomepage = undefined;
  try {
    const row = await db.query.settings.findFirst({
      where: (s, { eq }) => eq(s.key, "homepage"),
    });
    if (row?.value) initialHomepage = JSON.parse(row.value);
  } catch { /* use defaults */ }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
          Paramètres du Site & Charte Graphique
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Gérez le nom, les couleurs, la page d&apos;accueil, les taux de change et l&apos;envoi — sans toucher au code.
        </p>
      </div>

      <SettingsForm initialSettings={settings} initialHomepage={initialHomepage} />
    </div>
  );
}
