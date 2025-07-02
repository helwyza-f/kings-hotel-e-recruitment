"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { CircleCheckBig, Trash2 } from "lucide-react";

const FormSchema = z.object({
  question_text: z.string().min(1, "Pertanyaan harus diisi."),
  choices: z
    .array(z.string().min(1))
    .min(2, "Minimal dua pilihan jawabannya")
    .max(4, "Maksimal empat pilihan jawabannya"),
  correct_answer: z.string().min(1, "Pilih jawaban yang benar."),
});

export default function ExamCreateClient({
  lowonganId,
}: {
  lowonganId: string;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question_text: "",
      choices: ["", ""],
      correct_answer: "",
    },
  });

  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
  } = form;

  const watchedChoices = watch("choices");
  const watchedCorrectAnswer = watch("correct_answer");

  const handleAddChoice = () => {
    if (watchedChoices.length < 4) {
      setValue("choices", [...watchedChoices, ""]);
    }
  };

  const handleChoiceChange = (index: number, value: string) => {
    const updated = [...watchedChoices];
    updated[index] = value;
    setValue("choices", updated);
  };

  const handleCorrectAnswerChange = (choice: string) => {
    setValue("correct_answer", choice);
  };

  const handleRemoveChoice = (index: number) => {
    if (watchedChoices.length <= 2) return;

    const removedChoice = watchedChoices[index];
    const updated = watchedChoices.filter((_, i) => i !== index);
    setValue("choices", updated);

    // Reset correct answer if it was the removed one
    if (removedChoice === watchedCorrectAnswer) {
      setValue("correct_answer", "");
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const supabase = createClient();

      const { data: examData, error: examError } = await supabase
        .from("exams")
        .select("id")
        .eq("lowongan_id", lowonganId)
        .single();

      if (examError || !examData) {
        throw new Error("Exam not found for the given lowongan ID.");
      }

      const { question_text, choices, correct_answer } = data;

      const { error: examQuestionError } = await supabase
        .from("exam_questions")
        .insert([
          {
            exam_id: examData.id,
            question_text,
            choices: JSON.stringify(choices),
            correct_answer,
          },
        ]);

      if (examQuestionError) throw examQuestionError;

      toast.success("Soal berhasil ditambahkan!");
      router.push(`/admin/lowongan/${lowonganId}/exam`);
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("Terjadi kesalahan saat menambah soal.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {/* Pertanyaan */}
        <FormField
          name="question_text"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pertanyaan</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Masukkan pertanyaan"
                  className="mt-1 text-foreground bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pilihan Jawaban */}
        <FormField
          name="choices"
          control={form.control}
          render={() => (
            <FormItem>
              <FormLabel>Pilihan Jawaban</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-3">
                  {watchedChoices.map((choice, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={choice}
                        onChange={(e) =>
                          handleChoiceChange(index, e.target.value)
                        }
                        placeholder={`Pilihan ${index + 1}`}
                        disabled={isSubmitting}
                        className="text-foreground bg-background"
                      />
                      <Button
                        type="button"
                        variant={
                          watchedCorrectAnswer === choice
                            ? "default"
                            : "outline"
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
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddChoice}
                    className="mt-3"
                  >
                    Tambah Pilihan
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Jawaban Benar */}
        <FormField
          name="correct_answer"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jawaban Benar</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled
                  placeholder="Klik tombol centang pada pilihan"
                  className="mt-1 text-foreground bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          Tambah Soal
        </Button>
      </form>
    </Form>
  );
}
