import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/auth/login"); // fallback
  }

  if (profile.role === "admin") {
    redirect("/admin");
  } else {
    redirect("/user/profile/biodata");
  }
}
