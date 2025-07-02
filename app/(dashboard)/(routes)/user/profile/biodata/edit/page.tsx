import { createClient } from "@/lib/supabase/server";
import UserProfileClientPage from "./UserProfileClientPage";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return <UserProfileClientPage profile={profile} />;
}
