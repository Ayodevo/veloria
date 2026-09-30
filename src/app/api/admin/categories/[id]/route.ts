import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

// PUT /api/admin/categories/[id] — update
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const { id } = await params;
    const catId = parseInt(id, 10);
    const body = await req.json();
    const { nameFr, nameAr, slug, imageUrl, sortOrder, isVisible } = body;

    const existing = await db.query.categories.findFirst({
      where: (c, { eq }) => eq(c.id, catId),
    });
    if (!existing) return NextResponse.json({ error: "Catégorie non trouvée." }, { status: 404 });

    const name = nameFr
      ? JSON.stringify({ fr: nameFr, ar: nameAr || nameFr })
      : existing.name;

    await db.update(schema.categories).set({
      name,
      slug: slug || existing.slug,
      imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
      sortOrder: sortOrder !== undefined ? sortOrder : existing.sortOrder,
      isVisible: isVisible !== undefined ? isVisible : existing.isVisible,
    }).where(eq(schema.categories.id, catId));

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "UPDATE_CATEGORY",
      details: `Catégorie #${catId} mise à jour`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id] — delete
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const { id } = await params;
    const catId = parseInt(id, 10);

    const existing = await db.query.categories.findFirst({
      where: (c, { eq }) => eq(c.id, catId),
    });
    if (!existing) return NextResponse.json({ error: "Catégorie non trouvée." }, { status: 404 });

    await db.delete(schema.categories).where(eq(schema.categories.id, catId));

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "DELETE_CATEGORY",
      details: `Catégorie #${catId} (${existing.slug}) supprimée`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}
