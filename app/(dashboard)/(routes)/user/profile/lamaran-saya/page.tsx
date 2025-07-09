import { createClient } from "@/lib/supabase/server";
import LamaranSayaClient from "./client";

export default async function LamaranSayaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <p className="text-center text-muted-foreground">
        Anda harus login untuk melihat lamaran.
      </p>
    );
  }

  const { data, error } = await supabase
    .from("lamaran")
    .select(
      `
      id,
      status,
      created_at,
      exam_score,
      exam_category,
      lowongan (
        id,
        posisi,
        jatuh_tempo
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-center text-red-500">Gagal memuat data lamaran.</p>
    );
  }

  // Pastikan lowongan bukan array
  const fixedLamarans = (data ?? []).map((l) => ({
    ...l,
    lowongan: Array.isArray(l.lowongan) ? l.lowongan[0] : l.lowongan,
  }));

  return <LamaranSayaClient lamarans={fixedLamarans} />;
}
