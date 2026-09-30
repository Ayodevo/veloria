import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { id } = await params;
    const requestId = parseInt(id, 10);
    const body = await req.json();

    const existingRequest = await db.query.requests.findFirst({
      where: (r, { eq }) => eq(r.id, requestId),
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Demande non trouvée." }, { status: 404 });
    }

    const {
      status,
      totalEur,
      purchaseCostEur,
      serviceFeeEur,
      deliveryFeeTnd,
      giftWrapFeeTnd,
      depositPaidEur,
      notes,
      trackingNumber,
      shipmentId,
      statusNote,
    } = body;

    // Calculate auto margin in EUR: Total EUR - Purchase Cost EUR
    const newTotalEur = totalEur !== undefined ? totalEur : existingRequest.totalEur;
    const newPurchaseCostEur = purchaseCostEur !== undefined ? purchaseCostEur : existingRequest.purchaseCostEur;
    const marginEur = Math.max(0, (newTotalEur || 0) - (newPurchaseCostEur || 0));

    // Calculate TND total equivalent (exchange rate e.g. 3.45)
    const exchangeRate = 3.45;
    const newTotalTnd = Math.round(((newTotalEur || 0) / 100) * exchangeRate * 100);

    // Update request
    await db
      .update(schema.requests)
      .set({
        status: status || existingRequest.status,
        totalEur: newTotalEur,
        totalTnd: newTotalTnd,
        purchaseCostEur: newPurchaseCostEur,
        serviceFeeEur: serviceFeeEur !== undefined ? serviceFeeEur : existingRequest.serviceFeeEur,
        deliveryFeeTnd: deliveryFeeTnd !== undefined ? deliveryFeeTnd : existingRequest.deliveryFeeTnd,
        giftWrapFeeTnd: giftWrapFeeTnd !== undefined ? giftWrapFeeTnd : existingRequest.giftWrapFeeTnd,
        marginEur,
        depositPaidEur: depositPaidEur !== undefined ? depositPaidEur : existingRequest.depositPaidEur,
        notes: notes !== undefined ? notes : existingRequest.notes,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : existingRequest.trackingNumber,
        shipmentId: shipmentId !== undefined ? shipmentId : existingRequest.shipmentId,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.requests.id, requestId));

    // Record status history if status changed or note provided
    if (status && status !== existingRequest.status) {
      await db.insert(schema.requestStatusHistory).values({
        requestId,
        oldStatus: existingRequest.status,
        newStatus: status,
        note: statusNote || `Statut modifié de ${existingRequest.status} vers ${status}`,
        changedBy: session.name || session.email,
      });
    }

    // Log admin action
    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "UPDATE_REQUEST",
      details: `Demande ${existingRequest.reference} mise à jour (Nouveau statut: ${status || existingRequest.status})`,
    });

    return NextResponse.json({ success: true, message: "Demande mise à jour !" });
  } catch (error) {
    console.error("Update request API error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}

// DELETE /api/admin/requests/[id] — Delete a request
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

    const { id } = await params;
    const requestId = parseInt(id, 10);

    const existing = await db.query.requests.findFirst({
      where: (r, { eq }) => eq(r.id, requestId),
    });
    if (!existing) return NextResponse.json({ error: "Demande non trouvée." }, { status: 404 });

    // Cascade-delete items and status history are handled by FK onDelete: 'cascade'
    await db.delete(schema.requests).where(eq(schema.requests.id, requestId));

    await db.insert(schema.activityLog).values({
      userId: session.id,
      userName: session.name,
      action: "DELETE_REQUEST",
      details: `Demande ${existing.reference} supprimée`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete request error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}
