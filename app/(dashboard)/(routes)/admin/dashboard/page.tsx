import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { ClipboardList, Users, ThumbsUp, ThumbsDown } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: lowonganCount },
    { count: pelamarCount },
    { count: diterimaCount },
    { count: ditolakCount },
  ] = await Promise.all([
    supabase.from("lowongan").select("*", { count: "exact", head: true }),
    supabase.from("lamaran").select("*", { count: "exact", head: true }),
    supabase
      .from("lamaran")
      .select("*", { count: "exact", head: true })
      .eq("status", "Direview"),
    supabase
      .from("lamaran")
      .select("*", { count: "exact", head: true })
      .eq("status", "Ditolak"),
  ]);

  return (
    <div className="bg-background p-6 text-foreground">
      <h1 className="text-2xl font-semibold">King's Recruitment</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card className="p-6 shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ClipboardList className="mr-2" />
            <span className="text-lg">Lowongan</span>
          </div>
          <div className="text-2xl font-bold">{lowonganCount ?? 0}</div>
        </Card>

        <Card className="p-6 shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="mr-2" />
            <span className="text-lg">Pelamar</span>
          </div>
          <div className="text-2xl font-bold">{pelamarCount ?? 0}</div>
        </Card>

        <Card className="p-6 shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ThumbsUp className="mr-2" />
            <span className="text-lg">Diterima</span>
          </div>
          <div className="text-2xl font-bold">{diterimaCount ?? 0}</div>
        </Card>

        <Card className="p-6 shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ThumbsDown className="mr-2" />
            <span className="text-lg">Ditolak</span>
          </div>
          <div className="text-2xl font-bold">{ditolakCount ?? 0}</div>
        </Card>
      </div>
    </div>
  );
}
