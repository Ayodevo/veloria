import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

// PUT /api/admin/products/[id] — Update a product
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const { id } = await params;
    const productId = parseInt(id, 10);
    const body = await req.json();

    const existing = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, productId),
    });
    if (!existing) return NextResponse.json({ error: "Produit non trouvé." }, { status: 404 });

    const {
      name,
      slug,
      priceEur,
      comparePriceEur,
      purchasePriceEur,
      totalStock,
      mainImageUrl,
      shortDescription,
      badgeText,
      status,
      categoryId,
      brandId,
    } = body;

    await db
      .update(schema.products)
      .set({
        name: name !== undefined ? (typeof name === "string" ? name : JSON.stringify(name)) : existing.name,
        slug: slug || existing.slug,
        priceEur: priceEur !== undefined ? priceEur : existing.priceEur,
        comparePriceEur: comparePriceEur !== undefined ? comparePriceEur : existing.comparePriceEur,
        purchasePriceEur: purchasePriceEur !== undefined ? purchasePriceEur : existing.purchasePriceEur,
        totalStock: totalStock !== undefined ? totalStock : existing.totalStock,
        mainImageUrl: mainImageUrl || existing.mainImageUrl,
        shortDescription: shortDescription !== undefined ? (typeof shortDescription === "string" ? shortDescription : JSON.stringify(shortDescription)) : existing.shortDescription,
        badgeText: badgeText !== undefined ? (typeof badgeText === "string" ? badgeText : JSON.stringify(badgeText)) : existing.badgeText,
        status: status || existing.status,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
        brandId: brandId !== undefined ? brandId : existing.brandId,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.products.id, productId));

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "UPDATE_PRODUCT",
      details: `Produit #${productId} mis à jour`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] — Delete a product
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const { id } = await params;
    const productId = parseInt(id, 10);

    const existing = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, productId),
    });
    if (!existing) return NextResponse.json({ error: "Produit non trouvé." }, { status: 404 });

    await db.delete(schema.products).where(eq(schema.products.id, productId));

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "DELETE_PRODUCT",
      details: `Produit #${productId} (${existing.slug}) supprimé`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}
