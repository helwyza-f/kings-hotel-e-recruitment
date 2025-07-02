"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SquarePen, Trash } from "lucide-react"; // Import the icons from Lucide React
import { createClient } from "@/lib/supabase/client"; // Import Supabase client
import { toast } from "sonner"; // For toast notifications

export default function ExamClientPage({
  exams,
  examQuestions,
  lowonganId,
}: {
  exams: any[];
  examQuestions: any[];
  lowonganId: string;
}) {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    // Convert the jsonb `choices` into a proper array and set it to state
    const updatedQuestions = examQuestions.map((question) => {
      // Ensure choices is parsed correctly if it's a JSON string
      const choices = Array.isArray(question.choices)
        ? question.choices // If it's already an array, use it directly
        : question.choices
        ? JSON.parse(question.choices) // Parse the JSON string if it's not an array
        : []; // If choices is empty or undefined, set an empty array

      return { ...question, choices }; // Update the question with parsed choices
    });
    setQuestions(updatedQuestions);
  }, [examQuestions]);

  // Function to handle delete request
  const handleDeleteQuestion = async (questionId: string) => {
    const supabase = createClient();

    // Send the delete request to Supabase
    const { error } = await supabase
      .from("exam_questions")
      .delete()
      .eq("id", questionId); // Delete the question based on the provided questionId

    if (error) {
      console.error("Error deleting question:", error.message);
    } else {
      toast.success("Soal berhasil dihapus!");
      // Optionally, you can also filter out the deleted question from the UI immediately
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== questionId)
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Add New Question Button */}
      <div className="mt-6 pb-2 border-b">
        <Link href={`/admin/lowongan/${lowonganId}/exam/create`}>
          <Button
            variant="secondary"
            size="sm"
            className="bg-primary text-background hover:bg-button-hover"
          >
            Add New Question
          </Button>
        </Link>
      </div>
      {questions.map((question) => (
        <div key={question.id} className="border-b py-4">
          <h3 className="font-medium text-foreground">
            {question.question_text}
          </h3>
          <p className="text-sm dark:text-primary text-foreground mt-1">
            Pilihan:{" "}
            {Array.isArray(question.choices)
              ? question.choices.join(", ")
              : "No choices available"}
          </p>
          <div className="mt-2 flex gap-2">
            {/* Edit Button */}
            <Link href={`/admin/lowongan/${lowonganId}/exam/${question.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-foreground text-foreground hover:bg-background"
              >
                <SquarePen size={16} className="mr-1" />
                Edit Question
              </Button>
            </Link>

            {/* Delete Button with Trash Icon */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteQuestion(question.id)}
              className="flex items-center justify-center bg-destructive dark:bg-primary text-background"
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
