import { createClient } from "@/lib/supabase/server";
import LamaranForm from "./LamaranForm";
import { redirect } from "next/navigation";

export default async function LamaranPage({
  params,
}: {
  params: Promise<{ lowonganId: string }>;
}) {
  const { lowonganId } = await params;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    return <div>User not authenticated!</div>;
  }

  // Cek apakah user sudah pernah melamar
  const { data: existingLamaran } = await supabase
    .from("lamaran")
    .select("id")
    .eq("user_id", userId)
    .eq("lowongan_id", lowonganId)
    .limit(1)
    .maybeSingle();

  if (existingLamaran) {
    // Redirect ke halaman lamaran saya kalau sudah pernah melamar
    redirect("/user/profile/lamaran-saya");
  }

  // Fetch detail lowongan
  const { data: lowongan, error: lowonganError } = await supabase
    .from("lowongan")
    .select("*")
    .eq("id", lowonganId)
    .single();

  if (lowonganError || !lowongan) {
    console.error("Error fetching lowongan:", lowonganError?.message);
    return <div>Lowongan not found!</div>;
  }

  return (
    <div className="p-6 mt-20 md:mt-0 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">
        Lamar Pekerjaan: {lowongan.posisi}
      </h1>
      <LamaranForm lowongan={lowongan} userId={userId} />
    </div>
  );
}
