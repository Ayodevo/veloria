import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, priceEur, totalStock, mainImageUrl, status } = body;

    if (!name || !slug || !priceEur || !mainImageUrl) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(schema.products)
      .values({
        name: typeof name === "string" ? name : JSON.stringify(name),
        slug,
        priceEur,
        totalStock: totalStock || 0,
        mainImageUrl,
        status: status || "active",
      })
      .returning();

    // Log action
    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "CREATE_PRODUCT",
      details: `Produit ${slug} créé`,
    });

    return NextResponse.json({ success: true, product: inserted[0] });
  } catch (error) {
    console.error("Create product API error:", error);
    return NextResponse.json({ error: "Erreur lors de la création." }, { status: 500 });
  }
}
