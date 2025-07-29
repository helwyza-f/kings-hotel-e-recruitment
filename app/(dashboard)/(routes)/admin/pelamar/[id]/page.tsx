// app/admin/pelamar/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ClientPelamarDetail from "./client"; // Komponen client-side

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PelamarDetailPage({ params }: Props) {
  const supabase = await createClient();
  const userId = await params.then((p) => p.id);

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
//   console.log("Profile data:", profile);
  if (profileError || !profile) {
    console.error("Profile error:", profileError?.message);
    return redirect("/admin/dashboard");
  }

  // Get pendidikan
  const { data: pendidikan, error: pendidikanError } = await supabase
    .from("pendidikan")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (pendidikanError) {
    console.error("Pendidikan error:", pendidikanError.message);
  }

  // Get pengalaman kerja
  const { data: pengalaman, error: pengalamanError } = await supabase
    .from("pengalaman_kerja")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (pengalamanError) {
    console.error("Pengalaman error:", pengalamanError.message);
  }

  return (
    <div className="p-6 bg-background text-foreground mt-20 md:mt-0">
      <ClientPelamarDetail
        profile={profile}
        pendidikan={pendidikan ?? []}
        pengalaman={pengalaman ?? []}
      />
    </div>
  );
}
