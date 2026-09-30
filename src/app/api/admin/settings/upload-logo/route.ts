import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("logo") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/logo.png (or logo.jpeg etc, but let's just force .png or keep original ext)
    const ext = path.extname(file.name) || ".png";
    const filename = `logo-upload-${Date.now()}${ext}`;
    const filepath = path.join(process.cwd(), "public", filename);
    
    await writeFile(filepath, buffer);

    return NextResponse.json({ success: true, url: `/${filename}` });
  } catch (error) {
    console.error("Admin upload logo error:", error);
    return NextResponse.json({ error: "Erreur lors du téléchargement." }, { status: 500 });
  }
}
