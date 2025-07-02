// /app/user/lowongan/page.tsx

import { createClient } from "@/lib/supabase/server"; // Import Supabase client server-side
import { notFound } from "next/navigation";
import LowonganClientPage from "./lowonganClient"; // Import client-side component

export default async function LowonganPage() {
  const supabase = await createClient();

  // Query all job openings
  const { data: lowongan, error } = await supabase.from("lowongan").select("*");

  if (error || !lowongan) {
    console.error("Error fetching lowongan:", error?.message);
    return notFound(); // Show 404 page if no data found
  }

  // Pass the lowongan data to the client-side component
  return (
    <div className="p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Daftar Lowongan</h1>
      <LowonganClientPage lowongan={lowongan} />
    </div>
  );
}
