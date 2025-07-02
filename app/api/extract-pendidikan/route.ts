import { NextRequest, NextResponse } from "next/server";
import { extractPendidikanFromIjazah } from "@/lib/gemini/extractFromIjazah";

export async function POST(req: NextRequest) {
  try {
    const { base64, mimeType } = await req.json();

    if (!base64 || !mimeType) {
      return NextResponse.json(
        { error: "Base64 atau mimeType kosong" },
        { status: 400 }
      );
    }

    const result = await extractPendidikanFromIjazah(base64, mimeType);
    console.log("Hasil ekstraksi:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error di route handler:", error);
    return NextResponse.json(
      { error: "Gagal mengekstrak ijazah" },
      { status: 500 }
    );
  }
}
