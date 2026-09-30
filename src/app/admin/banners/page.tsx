import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { BannersManager } from "./BannersManager";

export const metadata = {
  title: "Bannières & Slider — Admin Veloria",
};

export default async function AdminBannersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const banners = await db.query.banners.findMany({
    orderBy: (b, { asc }) => [asc(b.sortOrder)],
  });

  return <BannersManager initialBanners={banners} />;
}
