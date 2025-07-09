import { createClient } from "@/lib/supabase/server";
import ClientSidebar from "./ClientSidebar"; // Komponen baru
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default async function UserProfileLayout({ children }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fotoUrl: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("foto_url")
      .eq("id", user.id)
      .single();

    if (profile?.foto_url) {
      fotoUrl = profile.foto_url;
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 md:px-6 py-8 max-w-6xl mx-auto mt-20 md:mt-0">
      <ClientSidebar fotoUrl={fotoUrl} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
