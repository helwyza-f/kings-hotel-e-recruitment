// /app/user/lowongan/[lowonganId]/exam/page.tsx
import { createClient } from "@/lib/supabase/server";
import ExamClientPage from "./ExamClientPage"; // Client-side component

export default async function ExamPage({
  params,
}: {
  params: Promise<{ lowonganId: string }>;
}) {
  const { lowonganId } = await params;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data?.user?.id;
  if (!userId) {
    return <div>User not authenticated!</div>; // Handle unauthenticated user
  }

  // Fetch the exam data related to the lowonganId
  const { data: examData, error: examError } = await supabase
    .from("exams")
    .select("*")
    .eq("lowongan_id", lowonganId)
    .single(); // Fetch a single exam
  //   console.log("examData", examData);

  if (examError || !examData) {
    console.error("Error fetching exam:", examError?.message);
    return <div>Exam not found!</div>;
  }

  // Fetch exam questions
  // ...di tempat fetch questions
  const { data: examQuestions, error: questionError } = await supabase
    .from("exam_questions")
    .select("id, question_text, choices") // ❌ exclude correct_answer
    .eq("exam_id", examData.id);

  //   console.log("examQuestions", examQuestions);

  if (questionError || !examQuestions) {
    console.error("Error fetching questions:", questionError?.message);
    return <div>No questions found!</div>;
  }

  // Pass the exam and questions data to the client-side component
  return (
    <div className="p-6 mt-20 md:mt-0 bg-background text-foreground">
      {/* <h1 className="text-2xl font-bold mb-4">Exam for {examData.title}</h1> */}
      <ExamClientPage
        exam={examData}
        questions={examQuestions}
        userId={userId}
      />
    </div>
  );
}
