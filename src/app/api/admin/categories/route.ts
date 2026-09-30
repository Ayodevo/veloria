import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

// GET /api/admin/categories — list all
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const categories = await db.query.categories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  });
  return NextResponse.json({ categories });
}

// POST /api/admin/categories — create
export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const body = await req.json();
    const { nameFr, nameAr, slug, imageUrl, sortOrder, isVisible } = body;

    if (!nameFr || !slug) {
      return NextResponse.json({ error: "Nom (FR) et slug requis." }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await db.query.categories.findFirst({
      where: (c, { eq }) => eq(c.slug, slug),
    });
    if (existing) return NextResponse.json({ error: "Ce slug est déjà utilisé." }, { status: 400 });

    const name = JSON.stringify({ fr: nameFr, ar: nameAr || nameFr });
    const inserted = await db.insert(schema.categories).values({
      name,
      slug,
      imageUrl: imageUrl || null,
      sortOrder: sortOrder ?? 0,
      isVisible: isVisible !== false,
    }).returning();

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "CREATE_CATEGORY",
      details: `Catégorie "${nameFr}" créée (slug: ${slug})`,
    });

    return NextResponse.json({ success: true, category: inserted[0] });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Erreur lors de la création." }, { status: 500 });
  }
}
