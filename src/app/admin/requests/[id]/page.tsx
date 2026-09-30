import React from "react";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { getAdminSession } from "@/lib/auth";
import { RequestDetailClient } from "./RequestDetailClient";

export const revalidate = 0;

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const requestId = parseInt(id, 10);

  const request = await db.query.requests.findFirst({
    where: (r, { eq }) => eq(r.id, requestId),
  });

  if (!request) {
    notFound();
  }

  const items = await db.query.requestItems.findMany({
    where: (i, { eq }) => eq(i.requestId, request.id),
  });

  const history = await db.query.requestStatusHistory.findMany({
    where: (h, { eq }) => eq(h.requestId, request.id),
    orderBy: (h, { desc }) => [desc(h.id)],
  });

  const shipmentsList = await db.query.shipments.findMany({
    orderBy: (s, { desc }) => [desc(s.id)],
  });

  return (
    <div className="space-y-6">
      <RequestDetailClient
        request={request}
        items={items}
        history={history}
        shipments={shipmentsList}
        user={session}
      />
    </div>
  );
}
