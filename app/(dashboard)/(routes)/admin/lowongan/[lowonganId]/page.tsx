import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClientFormEdit from "./clientFormEdit";

export default async function EditLowonganPage({
  params,
}: {
  params: Promise<{ lowonganId: string }>;
}) {
  const resolvedparams = await params;
  const { lowonganId: id } = resolvedparams;

  // Check if lowonganId is valid
  if (!id) {
    console.error("No lowonganId found in params.");
    return notFound(); // Handle missing lowonganId
  }

  const supabase = await createClient();

  // Query to get the lowongan based on the id
  const { data: lowongan, error } = await supabase
    .from("lowongan")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !lowongan) {
    console.error("Error fetching lowongan:", error?.message);
    return notFound(); // If not found, show the 404 page
  }

  return (
    <div className="p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Edit Lowongan</h1>

      {/* Use Link for navigation */}
      <Link href="/admin/lowongan">
        <Button className="mb-4" variant="secondary">
          Kembali
        </Button>
      </Link>

      {/* Passing fetched data to the client-side form */}
      <ClientFormEdit lowongan={lowongan} />
    </div>
  );
}
