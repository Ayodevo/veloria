import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";

// POST /api/admin/brands — create
export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const body = await req.json();
    const { name, slug, logoUrl, sortOrder, isVisible } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Nom et slug requis." }, { status: 400 });
    }

    const existing = await db.query.brands.findFirst({
      where: (b, { eq }) => eq(b.slug, slug),
    });
    if (existing) return NextResponse.json({ error: "Ce slug est déjà utilisé." }, { status: 400 });

    const inserted = await db.insert(schema.brands).values({
      name,
      slug,
      logoUrl: logoUrl || null,
      sortOrder: sortOrder ?? 0,
      isVisible: isVisible !== false,
    }).returning();

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "CREATE_BRAND",
      details: `Marque "${name}" créée`,
    });

    return NextResponse.json({ success: true, brand: inserted[0] });
  } catch (error) {
    console.error("Create brand error:", error);
    return NextResponse.json({ error: "Erreur lors de la création." }, { status: 500 });
  }
}
