import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type, // 'select' | 'shein' | 'special'
      customerName,
      phone,
      email,
      city,
      address,
      notes,
      items, // array of { productName, productUrl, screenshotUrl, quantity, priceEur, itemNotes }
      isGiftWrapped,
      promoCode,
    } = body;

    if (!type || !customerName || !phone || !city) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires (nom, téléphone, ville)." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, "");

    // Generate reference number based on type
    const prefix = type === "select" ? "VS" : type === "shein" ? "VX" : "SO";
    const lastRequest = await db.query.requests.findFirst({
      where: (r, { eq }) => eq(r.type, type),
      orderBy: (r, { desc }) => [desc(r.id)],
    });

    const nextId = (lastRequest?.id || 1000) + 1;
    const reference = `${prefix}-${nextId}`;

    // Calculate total EUR cents if items supplied
    let totalEur = 0;
    if (items && Array.isArray(items)) {
      totalEur = items.reduce(
        (sum, item) => sum + (item.priceEur || 0) * (item.quantity || 1),
        0
      );
    }

    // Insert request
    const inserted = await db
      .insert(schema.requests)
      .values({
        type,
        reference,
        customerName,
        phone: cleanPhone,
        email: email || null,
        city,
        address: address || null,
        notes: notes || null,
        status: "received",
        totalEur,
        totalTnd: Math.round((totalEur / 100) * 3.45 * 100),
        isGiftWrapped: Boolean(isGiftWrapped),
        promoCode: promoCode || null,
      })
      .returning();

    const requestId = inserted[0].id;

    // Insert request items if any
    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await db.insert(schema.requestItems).values({
          requestId,
          productName: item.productName || "Article sans nom",
          productUrl: item.productUrl || null,
          screenshotUrl: item.screenshotUrl || null,
          quantity: item.quantity || 1,
          priceEur: item.priceEur || 0,
          itemNotes: item.itemNotes || null,
        });
      }
    }

    // Record status history
    await db.insert(schema.requestStatusHistory).values({
      requestId,
      oldStatus: null,
      newStatus: "received",
      note: "Demande créée par le client via le site web",
      changedBy: "system",
    });

    // Create or update customer record
    const existingCustomer = await db.query.customers.findFirst({
      where: (c, { eq }) => eq(c.phone, cleanPhone),
    });

    if (!existingCustomer) {
      await db.insert(schema.customers).values({
        name: customerName,
        phone: cleanPhone,
        email: email || null,
        city,
        totalOrders: 1,
        totalSpentEur: totalEur,
      });
    } else {
      await db
        .update(schema.customers)
        .set({
          totalOrders: (existingCustomer.totalOrders || 0) + 1,
          totalSpentEur: (existingCustomer.totalSpentEur || 0) + totalEur,
        })
        .where(eq(schema.customers.id, existingCustomer.id));
    }

    return NextResponse.json({
      success: true,
      reference,
      requestId,
      message: "Ta demande a été reçue avec succès !",
    });
  } catch (error) {
    console.error("Create request API error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement de ta demande." },
      { status: 500 }
    );
  }
}
