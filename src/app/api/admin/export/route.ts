import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getAdminSession } from "@/lib/auth";
import ExcelJS from "exceljs";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "requests"; // 'requests' or 'customers'

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Veloria Admin";

    if (type === "requests") {
      const sheet = workbook.addWorksheet("Commandes & Demandes");
      sheet.columns = [
        { header: "Référence", key: "reference", width: 15 },
        { header: "Type", key: "type", width: 12 },
        { header: "Client", key: "customerName", width: 25 },
        { header: "Téléphone", key: "phone", width: 18 },
        { header: "Ville", key: "city", width: 15 },
        { header: "Statut", key: "status", width: 15 },
        { header: "Total EUR", key: "totalEur", width: 12 },
        { header: "Total TND", key: "totalTnd", width: 12 },
        { header: "Marge EUR", key: "marginEur", width: 12 },
        { header: "Date", key: "createdAt", width: 20 },
      ];

      const allRequests = await db.query.requests.findMany({
        orderBy: (r, { desc }) => [desc(r.id)],
      });

      for (const r of allRequests) {
        sheet.addRow({
          reference: r.reference,
          type: r.type.toUpperCase(),
          customerName: r.customerName,
          phone: r.phone,
          city: r.city,
          status: r.status,
          totalEur: ((r.totalEur || 0) / 100).toFixed(2),
          totalTnd: ((r.totalTnd || 0) / 100).toFixed(2),
          marginEur: ((r.marginEur || 0) / 100).toFixed(2),
          createdAt: r.createdAt,
        });
      }
    } else {
      const sheet = workbook.addWorksheet("Clients Veloria");
      sheet.columns = [
        { header: "Nom", key: "name", width: 25 },
        { header: "Téléphone", key: "phone", width: 18 },
        { header: "Email", key: "email", width: 25 },
        { header: "Ville", key: "city", width: 15 },
        { header: "Total Commandes", key: "totalOrders", width: 15 },
        { header: "Total Dépensé (EUR)", key: "totalSpentEur", width: 18 },
        { header: "Date Inscription", key: "createdAt", width: 20 },
      ];

      const allCustomers = await db.query.customers.findMany({
        orderBy: (c, { desc }) => [desc(c.id)],
      });

      for (const c of allCustomers) {
        sheet.addRow({
          name: c.name,
          phone: c.phone,
          email: c.email || "-",
          city: c.city || "-",
          totalOrders: c.totalOrders,
          totalSpentEur: ((c.totalSpentEur || 0) / 100).toFixed(2),
          createdAt: c.createdAt,
        });
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=veloria-${type}-${new Date().toISOString().slice(0, 10)}.xlsx`,
      },
    });
  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json({ error: "Erreur lors de l'exportation." }, { status: 500 });
  }
}
