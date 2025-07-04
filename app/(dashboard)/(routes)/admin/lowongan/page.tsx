import { createClient } from "@/lib/supabase/server"; // For Supabase client
import { redirect } from "next/navigation";

import LowonganClientPage from "./LowonganClientPage"; // Client-side component

export default async function LowonganPage() {
  const supabase = await createClient();

  // Query to get lowongan data
  const { data: lowongan, error } = await supabase
    .from("lowongan")
    .select("*")
    .order("created_at", { ascending: false }); // Ordering by created_at in descending order

  if (error) {
    console.error("Error fetching lowongan:", error.message);
    return redirect("/admin/dashboard"); // Redirect to dashboard if there's an error
  }

  return (
    <div className="p-6 bg-background text-foreground mt-20 md:mt-0">
      {/* Pass lowongan data to the client-side component */}
      <LowonganClientPage lowongan={lowongan} />
    </div>
  );
}
