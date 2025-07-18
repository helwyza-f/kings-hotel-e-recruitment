import { createClient } from "@/lib/supabase/server";
import PengalamanList from "./pengalamanList";

export default async function PengalamanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="text-center text-red-500">Kamu harus login</p>;
  }

  const { data: pengalaman, error } = await supabase
    .from("pengalaman_kerja")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-center text-red-500">Gagal memuat pengalaman kerja</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Riwayat Pengalaman</h1>
      </div>

      <PengalamanList pengalaman={pengalaman} />
    </div>
  );
}
