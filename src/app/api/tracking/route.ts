import { NextResponse } from "next/server";
import { db, schema } from "@/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("ref")?.trim().toUpperCase();
    const phone = searchParams.get("phone")?.replace(/[^0-9+]/g, "");

    if (!reference || !phone) {
      return NextResponse.json(
        { error: "Veuillez saisir le numéro de référence et ton numéro de téléphone." },
        { status: 400 }
      );
    }

    const request = await db.query.requests.findFirst({
      where: (r, { and, eq }) =>
        and(eq(r.reference, reference), eq(r.phone, phone)),
    });

    if (!request) {
      return NextResponse.json(
        { error: "Aucune commande trouvée avec ces informations." },
        { status: 404 }
      );
    }

    // Get status history
    const history = await db.query.requestStatusHistory.findMany({
      where: (h, { eq }) => eq(h.requestId, request.id),
      orderBy: (h, { asc }) => [asc(h.id)],
    });

    // Get items
    const items = await db.query.requestItems.findMany({
      where: (i, { eq }) => eq(i.requestId, request.id),
    });

    // Get shipment batch if assigned
    let shipment = null;
    if (request.shipmentId) {
      shipment = await db.query.shipments.findFirst({
        where: (s, { eq }) => eq(s.id, request.shipmentId!),
      });
    }

    // Customer safe response object
    const customerSafeData = {
      reference: request.reference,
      type: request.type,
      customerName: request.customerName,
      city: request.city,
      status: request.status,
      totalEur: request.totalEur,
      totalTnd: request.totalTnd,
      trackingNumber: request.trackingNumber,
      isGiftWrapped: request.isGiftWrapped,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      items: items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        priceEur: i.priceEur,
        productUrl: i.productUrl,
      })),
      history: history.map((h) => ({
        status: h.newStatus,
        date: h.createdAt,
        note: h.note,
      })),
      shipment: shipment
        ? {
            name: shipment.name,
            departureDate: shipment.departureDate,
          }
        : null,
    };

    return NextResponse.json({ success: true, data: customerSafeData });
  } catch (error) {
    console.error("Tracking API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche de ta commande." },
      { status: 500 }
    );
  }
}
