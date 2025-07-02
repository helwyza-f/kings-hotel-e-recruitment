import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { answers, examId, userId, lowonganId } = body;

  const supabase = await createClient();

  // 1. Ambil correct answers
  const { data: correctQuestions, error: questionError } = await supabase
    .from("exam_questions")
    .select("id, correct_answer")
    .eq("exam_id", examId);

  if (questionError || !correctQuestions) {
    return NextResponse.json(
      { error: "Failed to fetch correct answers" },
      { status: 500 }
    );
  }

  // 2. Hitung skor ujian
  let correct = 0;
  correctQuestions.forEach((q) => {
    if (answers[q.id] === q.correct_answer) {
      correct++;
    }
  });
  const total = correctQuestions.length;
  const score = Math.round((correct / total) * 100);

  // / 3. Ambil kualifikasi pendidikan user
  const { data: pendidikanList } = await supabase
    .from("pendidikan")
    .select("kualifikasi")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!pendidikanList || pendidikanList.length === 0) {
    return NextResponse.json(
      { error: "Data pendidikan tidak ditemukan" },
      { status: 400 }
    );
  }

  const kualifikasi = pendidikanList?.[0]?.kualifikasi ?? "SMA";
  const kualifikasiMap: Record<string, number> = {
    SMP: 1,
    SMA: 2,
    D3: 3,
    S1: 4,
    S2: 5,
    S3: 6,
  };
  const pendidikanValue = kualifikasiMap[kualifikasi] ?? 2;

  // 4. Hitung pengalaman kerja user
  const { data: pengalamanList } = await supabase
    .from("pengalaman_kerja")
    .select("periode")
    .eq("user_id", userId);
  if (!pengalamanList || pengalamanList.length === 0) {
    return NextResponse.json(
      { error: "Data pengalaman kerja tidak ditemukan" },
      { status: 400 }
    );
  }
  const tahunList = (pengalamanList ?? [])
    .map((p) => {
      const [start, end] = p.periode?.split(" - ").map(Number) ?? [];
      return { start, end };
    })
    .filter((p) => !isNaN(p.start) && !isNaN(p.end));

  const pengalamanKerja =
    tahunList.length > 0
      ? Math.max(...tahunList.map((p) => p.end)) -
        Math.min(...tahunList.map((p) => p.start))
      : 0;

  // 5. Kirim ke Flask API
  const flaskRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/predict`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pendidikan: pendidikanValue,
        pengalaman_kerja: pengalamanKerja,
        skor_psikotes: score,
      }),
    }
  );

  if (!flaskRes.ok) {
    const err = await flaskRes.json();
    return NextResponse.json(
      { error: err.error ?? "Flask API error" },
      { status: 500 }
    );
  }

  const flaskResult = await flaskRes.json();

  // 6. Simpan ke exam_submissions
  await supabase.from("exam_submissions").insert([
    {
      user_id: userId,
      exam_id: examId,
      score: score,
      predicted_score: flaskResult.prediksi_performa,
      category: flaskResult.kategori_performa,
      pendidikan: kualifikasi,
      pengalaman_kerja: pengalamanKerja,
    },
  ]);

  // 7. Update lamaran
  await supabase
    .from("lamaran")
    .update({
      exam_score: flaskResult.prediksi_performa,
      exam_category: flaskResult.kategori_performa,
      pendidikan: kualifikasi,
      pengalaman_kerja: pengalamanKerja,
    })
    .eq("user_id", userId)
    .eq("lowongan_id", lowonganId);

  // 8. Return response (jika tidak ingin user lihat hasil, bisa kosongkan return)
  return NextResponse.json({ success: true });
}
