// /app/admin/lowongan/exam/[id]/create/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ExamCreateClient from "./ExamCreateClient"; // Client-side form component

export default async function CreateExamPage({
  params,
}: {
  params: Promise<{ lowonganId: string }>;
}) {
  const paramsResolved = await params; // Await the params to get the actual id
  const { lowonganId: id } = paramsResolved;

  const supabase = await createClient();

  // Fetch lowongan data based on ID
  const { data: lowongan, error } = await supabase
    .from("lowongan")
    .select("*")
    .eq("id", id)
    .single(); // Fetch a single row

  if (error || !lowongan) {
    console.error("Error fetching lowongan:", error?.message);
    return notFound(); // If not found, show the 404 page
  }

  return (
    <div className="p-6 bg-background text-foreground mt-20 md:mt-0">
      <h1 className="text-2xl font-bold mb-4">
        Create Exam Question for Lowongan: {lowongan.posisi}
      </h1>

      {/* Passing the lowongan data to the client-side form component */}
      <ExamCreateClient lowonganId={lowongan.id} />
    </div>
  );
}
