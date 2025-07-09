import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function extractPengalamanKerjaFromSurat(
  base64: string,
  mimeType: string
): Promise<{
  perusahaan: string;
  jabatan: string;
  periode: string;
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Berikut adalah gambar atau dokumen surat pengalaman kerja. Tolong ekstrak dan kembalikan data dalam format JSON dengan struktur berikut:

{
  "perusahaan": "nama perusahaan",
  "jabatan": "jabatan terakhir",
  "periode": "tahun masuk - tahun keluar"
}

Petunjuk penting:
- Ambil nama perusahaan dari header atau badan surat.
- Jabatan bisa ditemukan di kalimat seperti "menjabat sebagai", "bekerja sebagai", atau yang serupa.
- Tahun masuk dan keluar bisa dari kalimat seperti "dari tahun ... sampai ...", atau "sejak ... hingga ...".
- Jika hanya ada tahun keluar (misalnya tahun surat dibuat), asumsikan masa kerja 1–2 tahun sebelumnya.
- Jangan kembalikan teks tambahan atau format markdown, hanya JSON yang valid.

Contoh hasil:
{
  "perusahaan": "PT. Maju Mundur",
  "jabatan": "Software Engineer",
  "periode": "2018 - 2022"
}
`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64,
        mimeType,
      },
    },
  ]);

  console.log("Gemini Response:", result.response.text());
  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch {
    throw new Error("Gagal parsing hasil Gemini");
  }
}
