import React from "react";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductsManager } from "./ProductsManager";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const productsList = await db.query.products.findMany({
    orderBy: (p, { desc }) => [desc(p.id)],
  });

  const categoriesList = await db.query.categories.findMany();
  const brandsList = await db.query.brands.findMany();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
          Catalogue Produits (Veloria Select)
        </h1>
        <p className="text-xs text-slate-400">
          Ajoutez, modifiez ou masquez des produits dans la boutique publique.
        </p>
      </div>

      <ProductsManager
        initialProducts={productsList}
        categories={categoriesList}
        brands={brandsList}
      />
    </div>
  );
}
