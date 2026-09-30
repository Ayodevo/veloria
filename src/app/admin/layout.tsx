import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const { getSiteSettings } = await import("@/lib/settings");
  const settings = await getSiteSettings();

  // If on login page, let it render without wrapper
  if (!session) {
    return <>{children}</>;
  }

  return <AdminLayoutClient user={session} logoUrl={settings.logo_url}>{children}</AdminLayoutClient>;
}
