import { createClient } from "@/lib/supabase/server"; // atau pakai server actions
import UserProfileViewPage from "./UserProfileViewPage"; // Client Component

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return <UserProfileViewPage profile={profile} />;
}
