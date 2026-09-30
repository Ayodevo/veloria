import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await req.json(); // Map of { key: value }

    for (const [key, val] of Object.entries(body)) {
      const valueStr = typeof val === "object" ? JSON.stringify(val) : String(val);

      const existing = await db.query.settings.findFirst({
        where: (s, { eq }) => eq(s.key, key),
      });

      if (existing) {
        await db
          .update(schema.settings)
          .set({ value: valueStr, updatedAt: new Date().toISOString() })
          .where(eq(schema.settings.key, key));
      } else {
        await db.insert(schema.settings).values({
          key,
          value: valueStr,
          group: "general",
        });
      }
    }

    // Log activity
    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "UPDATE_SETTINGS",
      details: JSON.stringify(Object.keys(body)),
    });

    return NextResponse.json({ success: true, message: "Paramètres mis à jour !" });
  } catch (error) {
    console.error("Admin settings API error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}
