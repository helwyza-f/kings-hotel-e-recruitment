"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { CircleCheckBig, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Zod validation schema
const formSchema = z.object({
  question_text: z.string().min(1, "Pertanyaan harus diisi."),
  choices: z
    .array(z.string().min(1))
    .min(2, "Minimal dua pilihan jawabannya")
    .max(4, "Maksimal empat pilihan jawabannya"),
  correct_answer: z.string().min(1, "Pilih jawaban yang benar."),
});

interface ExamEditClientPageProps {
  question: {
    id: string;
    exam_id: string;
    question_text: string;
    choices: string[];
    correct_answer: string;
  };
  lowonganId: string;
  // questionId: string;
}

export default function ExamEditClientPage({
  question,
  lowonganId,
}: // questionId,
ExamEditClientPageProps) {
  const router = useRouter();
  const choices = Array.isArray(question.choices)
    ? question.choices
    : JSON.parse(question.choices || "[]");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question_text: question.question_text,
      choices: choices,
      correct_answer: question.correct_answer,
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,

    watch,
  } = form;

  const watchedChoices = watch("choices");
  const watchedCorrectAnswer = watch("correct_answer");

  const handleChoiceChange = (index: number, value: string) => {
    const updatedChoices = [...watchedChoices];
    updatedChoices[index] = value;
    setValue("choices", updatedChoices);
  };

  const handleAddChoice = () => {
    if (watchedChoices.length < 4) {
      setValue("choices", [...watchedChoices, ""]);
    }
  };

  const handleRemoveChoice = (index: number) => {
    if (watchedChoices.length <= 2) return;

    const updatedChoices = [...watchedChoices];
    const removed = updatedChoices.splice(index, 1);
    setValue("choices", updatedChoices);

    // If the removed choice is the correct answer, reset it
    if (removed[0] === watchedCorrectAnswer) {
      setValue("correct_answer", "");
    }
  };

  const handleCorrectAnswerChange = (choice: string) => {
    setValue("correct_answer", choice);
  };

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("exam_questions")
        .update({
          question_text: data.question_text,
          choices: JSON.stringify(data.choices),
          correct_answer: data.correct_answer,
        })
        .eq("id", question.id);

      if (error) {
        console.error("Error updating question:", error.message);
        toast.error("Gagal memperbarui soal.");
        return;
      }

      toast.success("Soal berhasil diperbarui!");
      router.push(`/admin/lowongan/${lowonganId}/exam`); // Refresh the page to reflect changes
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Terjadi kesalahan saat memperbarui soal.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Pertanyaan */}
      <div>
        <label
          htmlFor="question_text"
          className="block text-sm font-medium text-foreground"
        >
          Pertanyaan
        </label>
        <Input
          {...form.register("question_text")}
          disabled={isSubmitting}
          placeholder="Masukkan pertanyaan"
          className="mt-1 text-foreground bg-background"
        />
        <span className="text-red-500">{errors.question_text?.message}</span>
      </div>

      {/* Pilihan Jawaban */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Pilihan Jawaban
        </label>
        <div className="space-y-4">
          {watchedChoices.map((choice, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                placeholder={`Pilihan ${index + 1}`}
                className="mt-1 text-foreground bg-background"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant={
                  watchedCorrectAnswer === choice ? "default" : "outline"
                }
                size="icon"
                onClick={() => handleCorrectAnswerChange(choice)}
                title="Tandai sebagai jawaban benar"
              >
                <CircleCheckBig size={16} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveChoice(index)}
                disabled={watchedChoices.length <= 2}
                title="Hapus pilihan"
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddChoice}
          className="mt-3"
        >
          Tambah Pilihan
        </Button>
        <span className="text-red-500 block mt-1">
          {errors.choices?.message}
        </span>
      </div>

      {/* Jawaban Benar */}
      <div>
        <label
          htmlFor="correct_answer"
          className="block text-sm font-medium text-foreground"
        >
          Jawaban Benar
        </label>
        <Input
          {...form.register("correct_answer")}
          disabled
          placeholder="Klik ikon centang untuk memilih jawaban benar"
          className="mt-1 text-foreground bg-background"
        />
        <span className="text-red-500">{errors.correct_answer?.message}</span>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="w-full"
      >
        Simpan Soal
      </Button>
    </form>
  );
}
