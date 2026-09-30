import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

// PUT /api/admin/banners/[id] — update banner
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const { id } = await params;
    const bannerId = parseInt(id, 10);
    if (isNaN(bannerId)) return NextResponse.json({ error: "ID invalide." }, { status: 400 });

    const body = await req.json();
    const {
      titleFr,
      titleAr,
      subtitleFr,
      subtitleAr,
      desktopImageUrl,
      mobileImageUrl,
      buttonLabelFr,
      buttonLabelAr,
      buttonUrl,
      isActive,
      sortOrder,
    } = body;

    const updateData: Record<string, any> = {};

    if (desktopImageUrl !== undefined) updateData.desktopImageUrl = desktopImageUrl;
    if (mobileImageUrl !== undefined) updateData.mobileImageUrl = mobileImageUrl;
    if (buttonUrl !== undefined) updateData.buttonUrl = buttonUrl;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);

    if (titleFr !== undefined || titleAr !== undefined) {
      updateData.title = JSON.stringify({ fr: titleFr || "", ar: titleAr || titleFr || "" });
    }
    if (subtitleFr !== undefined || subtitleAr !== undefined) {
      updateData.subtitle = JSON.stringify({ fr: subtitleFr || "", ar: subtitleAr || subtitleFr || "" });
    }
    if (buttonLabelFr !== undefined || buttonLabelAr !== undefined) {
      updateData.buttonLabel = JSON.stringify({ fr: buttonLabelFr || "", ar: buttonLabelAr || buttonLabelFr || "" });
    }

    const updated = await db
      .update(schema.banners)
      .set(updateData)
      .where(eq(schema.banners.id, bannerId))
      .returning();

    if (!updated.length) return NextResponse.json({ error: "Bannière introuvable." }, { status: 404 });

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "UPDATE_BANNER",
      details: `Bannière #${bannerId} mise à jour`,
    });

    return NextResponse.json({ success: true, banner: updated[0] });
  } catch (error) {
    console.error("Update banner error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}

// DELETE /api/admin/banners/[id] — delete banner
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const { id } = await params;
    const bannerId = parseInt(id, 10);
    if (isNaN(bannerId)) return NextResponse.json({ error: "ID invalide." }, { status: 400 });

    const deleted = await db
      .delete(schema.banners)
      .where(eq(schema.banners.id, bannerId))
      .returning();

    if (!deleted.length) return NextResponse.json({ error: "Bannière introuvable." }, { status: 404 });

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "DELETE_BANNER",
      details: `Bannière #${bannerId} supprimée`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}
