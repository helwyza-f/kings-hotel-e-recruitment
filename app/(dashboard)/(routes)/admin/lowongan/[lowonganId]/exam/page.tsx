import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ExamClientPage from "./ExamClientPage";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ lowonganId: string }>;
}) {
  const resolvedParams = await params;
  const { lowonganId } = resolvedParams;

  const supabase = await createClient();

  const { data: lowongan } = await supabase
    .from("lowongan")
    .select("*")
    .eq("id", lowonganId)
    .single();

  const { data: exams, error: examsError } = await supabase
    .from("exams")
    .select("*")
    .eq("lowongan_id", lowonganId);

  if (examsError || !exams || exams.length === 0) return notFound();

  const exam = exams[0]; // Ambil hanya satu exam

  const { data: examQuestions, error: questionsError } = await supabase
    .from("exam_questions")
    .select("*")
    .eq("exam_id", exam.id); // hanya ambil soal dari 1 exam

  if (questionsError) return notFound();

  return (
    <div className="p-6 bg-background text-foreground mt-20 md:mt-0">
      <h1 className="text-2xl font-bold mb-4">
        Manage Exam for: {lowongan?.posisi || "Unknown Position"}
      </h1>
      <ExamClientPage
        lowonganId={lowonganId}
        exam={exam}
        examQuestions={examQuestions}
      />
    </div>
  );
}
