import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Import Link from Next.js
import ExamEditClientPage from "./ExamEditClientPage"; // Import the client-side component

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ lowonganId: string; questionId: string }>;
}) {
  const { lowonganId, questionId } = await params; // Get lowonganId and questionId from params

  const supabase = await createClient();

  // Fetch the question based on questionId
  const { data: question, error: questionError } = await supabase
    .from("exam_questions")
    .select("*")
    .eq("id", questionId) // Use the questionId to fetch specific question
    .single(); // Fetch a single record
  // console.log("Fetched question:", question);
  if (questionError || !question) {
    console.error("Error fetching question:", questionError?.message);
    return notFound(); // If not found, show the 404 page
  }

  return (
    <div className="p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Edit Question</h1>

      {/* Link to go back */}
      <Link href={`/admin/lowongan/${lowonganId}/exam`}>
        <Button className="mb-4" variant="secondary">
          Kembali
        </Button>
      </Link>

      {/* Passing fetched question data to the client-side form */}
      <ExamEditClientPage
        question={question}
        lowonganId={lowonganId}
        questionId={questionId} // Pass the questionId to the client-side component
      />
    </div>
  );
}
