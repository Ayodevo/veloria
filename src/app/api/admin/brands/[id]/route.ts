import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

// PUT /api/admin/brands/[id] — update
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const { id } = await params;
    const brandId = parseInt(id, 10);
    const body = await req.json();
    const { name, slug, logoUrl, sortOrder, isVisible } = body;

    const existing = await db.query.brands.findFirst({
      where: (b, { eq }) => eq(b.id, brandId),
    });
    if (!existing) return NextResponse.json({ error: "Marque non trouvée." }, { status: 404 });

    await db.update(schema.brands).set({
      name: name || existing.name,
      slug: slug || existing.slug,
      logoUrl: logoUrl !== undefined ? logoUrl : existing.logoUrl,
      sortOrder: sortOrder !== undefined ? sortOrder : existing.sortOrder,
      isVisible: isVisible !== undefined ? isVisible : existing.isVisible,
    }).where(eq(schema.brands.id, brandId));

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "UPDATE_BRAND",
      details: `Marque #${brandId} mise à jour`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update brand error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}

// DELETE /api/admin/brands/[id] — delete
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const { id } = await params;
    const brandId = parseInt(id, 10);

    const existing = await db.query.brands.findFirst({
      where: (b, { eq }) => eq(b.id, brandId),
    });
    if (!existing) return NextResponse.json({ error: "Marque non trouvée." }, { status: 404 });

    await db.delete(schema.brands).where(eq(schema.brands.id, brandId));

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "DELETE_BRAND",
      details: `Marque #${brandId} (${existing.slug}) supprimée`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete brand error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}
