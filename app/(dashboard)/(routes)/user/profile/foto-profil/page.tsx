import { createClient } from "@/lib/supabase/server";
import EditFotoProfilClientPage from "./EditFotoProfilClientPage";
import { redirect } from "next/navigation";

export default async function EditFotoProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, foto_url")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/");

  return <EditFotoProfilClientPage profile={profile} />;
}
