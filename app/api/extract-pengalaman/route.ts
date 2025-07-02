import { NextRequest, NextResponse } from "next/server";
import { extractPengalamanKerjaFromSurat } from "@/lib/gemini/extractFromSuratPengalaman";

export async function POST(req: NextRequest) {
  try {
    const { base64, mimeType } = await req.json();

    if (!base64 || !mimeType) {
      return NextResponse.json(
        { error: "Base64 atau mimeType kosong" },
        { status: 400 }
      );
    }

    const result = await extractPengalamanKerjaFromSurat(base64, mimeType);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error di route handler:", error);
    return NextResponse.json(
      { error: "Gagal mengekstrak surat pengalaman" },
      { status: 500 }
    );
  }
}
