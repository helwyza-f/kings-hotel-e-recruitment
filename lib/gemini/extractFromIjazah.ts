// lib/gemini/extractFromIjazah.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function extractPendidikanFromIjazah(
  base64: string,
  mimeType: string
): Promise<{
  institusi: string;
  jurusan: string;
  kualifikasi: string;
  periode: string;
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Berikut adalah gambar ijazah. Tolong ekstrak dan kembalikan data dalam format JSON dengan struktur sebagai berikut:

{
  "institusi": "nama institusi",
  "jurusan": "nama jurusan",
  "kualifikasi": "SMP /SMA / D3 / S1 / S2 / S3",
  "periode": "tahun masuk - tahun lulus"
}

Petunjuk penting:
- Tentukan tahun **lulus** dari informasi yang tertulis di ijazah (misalnya tahun ditandatangani, tahun tertera di bagian bawah, atau tahun yang relevan).
- **Kualifikasi** dapat ditentukan dari kata-kata seperti:
  - SMP/Sekolah Menengah Pertama → kualifikasi = "SMP"
  - SMA/SMK/MA → kualifikasi = "SMA"
  - D3/Diploma → kualifikasi = "D3"
  - S1/Sarjana/Strata 1 → kualifikasi = "S1"
  - S2/Magister → kualifikasi = "S2"
  - S3/Doktor → kualifikasi = "S3"
- Tentukan **periode** pendidikan berdasarkan jenis kualifikasi:
  - Jika SMA → periode = tahun lulus - 3 tahun
  - Jika D3 → periode = tahun lulus - 3 tahun
  - Jika S1 → periode = tahun lulus - 4 tahun
  - Jika S2 → periode = tahun lulus - 2 tahun
  - Jika S3 → periode = tahun lulus - 3 tahun
- **Jangan kembalikan teks tambahan** apa pun, hanya kembalikan JSON yang valid.

Contoh keluaran:
{
  "institusi": "Universitas Indonesia",
  "jurusan": "Teknik Informatika",
  "kualifikasi": "S1",
  "periode": "2015 - 2019"
}

`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64,
        mimeType, // atau image/png/pdf sesuai input
      },
    },
  ]);
  console.log("Hasil Gemini:", result.response.text());
  const text = result.response.text();
  const cleanedText = text.replace(/```json|```/g, "").trim();
  try {
    const parsed = JSON.parse(cleanedText);
    return parsed;
  } catch {
    throw new Error("Gagal mengurai hasil Gemini");
  }
}
