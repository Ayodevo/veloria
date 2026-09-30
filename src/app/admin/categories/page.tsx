import React from "react";
import { db } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CategoriesManager, BrandsManager } from "./CategoriesManager";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const categories = await db.query.categories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  });

  const brands = await db.query.brands.findMany({
    orderBy: (b, { asc }) => [asc(b.sortOrder)],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
          Catégories & Marques
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Gérez les catégories de produits et les marques partenaires. Les actions sont immédiates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoriesManager initialCategories={categories} />
        <BrandsManager initialBrands={brands} />
      </div>
    </div>
  );
}
