import { createClient } from "@/lib/supabase/server";
import PelamarTableClient from "./PelamarTableClient";

export default async function PelamarPage({
  params,
}: {
  params: Promise<{ lowonganId: string }>;
}) {
  const supabase = await createClient();
  const { lowonganId } = await params;
  const { data } = await supabase
    .from("lamaran")
    .select(
      `
    id,
    status,
    created_at,
    exam_score,
    exam_category,
    pendidikan,
    pengalaman_kerja,
    cv_url,
    surat_lamaran_url,
    user:profiles(id, first_name, last_name, email)
  `
    )
    .eq("lowongan_id", lowonganId)

    .order("created_at", { ascending: false });

  const pelamarData = (data ?? []).map((item) => ({
    ...item,
    user: Array.isArray(item.user) ? item.user[0] : item.user,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Pelamar</h1>
      <PelamarTableClient pelamars={pelamarData} />
    </div>
  );
}
