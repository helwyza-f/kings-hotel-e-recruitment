import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LowonganDetailClientPage from "./LowonganDetailClientPage";

export default async function LowonganDetailPage({
  params,
}: {
  params: Promise<{ lowonganId: string }>;
}) {
  const { lowonganId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: lowongan, error } = await supabase
    .from("lowongan")
    .select("*")
    .eq("id", lowonganId)
    .single();

  if (error || !lowongan) {
    return notFound();
  }

  // Cek apakah user sudah pernah melamar
  let sudahMelamar = false;
  let bolehMelamar = false;
  if (user) {
    const { data: existing } = await supabase
      .from("lamaran")
      .select("id")
      .eq("user_id", user.id)
      .eq("lowongan_id", lowonganId)
      .limit(1)
      .maybeSingle(); // ganti single() dengan maybeSingle()

    // Tambahkan di LowonganDetailPage (server-side)

    const { data: pendidikanList } = await supabase
      .from("pendidikan")
      .select("id")
      .eq("user_id", user.id);

    const { data: pengalamanList } = await supabase
      .from("pengalaman_kerja")
      .select("id")
      .eq("user_id", user.id);

    const dataPendidikanAda = (pendidikanList ?? []).length > 0;
    const dataPengalamanAda = (pengalamanList ?? []).length > 0;
    bolehMelamar = dataPendidikanAda && dataPengalamanAda;

    sudahMelamar = !!existing;
  }

  return (
    <div className="p-6 bg-background text-foreground mt-20 md:mt-0">
      <h1 className="text-2xl font-bold mb-4">{lowongan.posisi}</h1>
      <LowonganDetailClientPage
        lowongan={lowongan}
        sudahMelamar={sudahMelamar}
        bolehMelamar={bolehMelamar} // Pass user existence to indicate if they can apply
      />
    </div>
  );
}
