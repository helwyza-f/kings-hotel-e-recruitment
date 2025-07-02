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
  if (user) {
    const { data: existing } = await supabase
      .from("lamaran")
      .select("id")
      .eq("user_id", user.id)
      .eq("lowongan_id", lowonganId)
      .limit(1)
      .maybeSingle(); // ganti single() dengan maybeSingle()

    console.log("User ID:", user.id);
    console.log("Lowongan ID:", lowonganId);
    console.log("Existing lamaran:", existing);
    sudahMelamar = !!existing;
  }

  return (
    <div className="p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">{lowongan.posisi}</h1>
      <LowonganDetailClientPage
        lowongan={lowongan}
        sudahMelamar={sudahMelamar}
      />
    </div>
  );
}
