// /app/user/dashboard/page.tsx

import { createClient } from "@/lib/supabase/server"; // Import Supabase client server-side
import { notFound } from "next/navigation";
import UserDashboardClientPage from "./clientPage"; // Import client-side component

export default async function UserDashboardPage() {
  // Supabase client
  const supabase = await createClient();

  // Ambil ID pengguna yang terautentikasi
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user:", userError?.message);
    return notFound(); // Tampilkan 404 jika tidak ada pengguna
  }

  // Ambil daftar lowongan yang tersedia untuk dilamar
  const { data: lowongan, error } = await supabase.from("lowongan").select("*"); // Ambil semua lowongan yang tersedia

  if (error || !lowongan) {
    console.error("Error fetching lowongan:", error?.message);
    return notFound(); // Tampilkan 404 jika tidak ada data
  }

  // Mengirim data lowongan ke client-side component
  return (
    <div className="p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Dashboard Pengguna</h1>
      <UserDashboardClientPage lowongan={lowongan} />
    </div>
  );
}
