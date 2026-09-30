import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";

// GET /api/admin/banners — list all banners
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const banners = await db.query.banners.findMany({
    orderBy: (b, { asc }) => [asc(b.sortOrder)],
  });

  return NextResponse.json({ banners });
}

// POST /api/admin/banners — create banner
export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

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

    if (!desktopImageUrl) {
      return NextResponse.json({ error: "L'image desktop est requise." }, { status: 400 });
    }

    const title = JSON.stringify({ fr: titleFr || "", ar: titleAr || titleFr || "" });
    const subtitle = JSON.stringify({ fr: subtitleFr || "", ar: subtitleAr || subtitleFr || "" });
    const buttonLabel = JSON.stringify({ fr: buttonLabelFr || "", ar: buttonLabelAr || buttonLabelFr || "" });

    const inserted = await db
      .insert(schema.banners)
      .values({
        title,
        subtitle,
        desktopImageUrl,
        mobileImageUrl: mobileImageUrl || desktopImageUrl,
        buttonLabel,
        buttonUrl: buttonUrl || "/",
        isActive: isActive !== false,
        sortOrder: sortOrder ?? 0,
      })
      .returning();

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "CREATE_BANNER",
      details: `Bannière #${inserted[0].id} créée (${buttonUrl})`,
    });

    return NextResponse.json({ success: true, banner: inserted[0] });
  } catch (error) {
    console.error("Create banner error:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la bannière." }, { status: 500 });
  }
}
