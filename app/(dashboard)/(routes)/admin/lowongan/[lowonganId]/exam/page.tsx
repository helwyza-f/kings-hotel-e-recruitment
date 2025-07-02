import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ExamClientPage from "./ExamClientPage"; // Import the client-side component

export default async function ExamPage({
  params,
}: {
  params: Promise<{ lowonganId: string }>; // Expecting params to be a promise
}) {
  const resolvedParams = await params; // Await the promise to get the actual params
  const { lowonganId } = resolvedParams; // Extract the lowonganId from params

  const supabase = await createClient();
  //Fecth lowongan based on the lowonganId
  const { data: lowongan } = await supabase
    .from("lowongan")
    .select("*")
    .eq("id", lowonganId)
    .single(); // Fetch a single row based on the lowonganId
  // Fetch exams based on the lowonganId
  const { data: exams, error: examsError } = await supabase
    .from("exams")
    .select("*")
    .eq("lowongan_id", lowonganId);

  if (examsError || !exams) {
    console.error("Error fetching exams:", examsError?.message);
    return notFound(); // If not found, show the 404 page
  }

  // Fetch exam questions for each exam
  const { data: examQuestions, error: questionsError } = await supabase
    .from("exam_questions")
    .select("*")
    .in(
      "exam_id",
      exams.map((exam) => exam.id)
    );

  if (questionsError) {
    console.error("Error fetching exam questions:", questionsError?.message);
    return notFound(); // If not found, show the 404 page
  }

  // Passing the data to the client-side component
  return (
    <div className="p-6 bg-background text-foreground mt-20 md:mt-0">
      <h1 className="text-2xl font-bold mb-4">
        Manage Exams for Lowongan: {lowongan?.posisi || "Unknown Position"}
      </h1>
      <ExamClientPage
        exams={exams}
        examQuestions={examQuestions}
        lowonganId={lowonganId}
      />
    </div>
  );
}
