import { createClient } from "@/lib/supabase/server";
import PendidikanList from "./PendidikanList";

export default async function PendidikanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const { data: pendidikanList } = await supabase
    .from("pendidikan")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Riwayat Pendidikan</h1>
      </div>
      <PendidikanList pendidikan={pendidikanList || []} />
    </div>
  );
}
