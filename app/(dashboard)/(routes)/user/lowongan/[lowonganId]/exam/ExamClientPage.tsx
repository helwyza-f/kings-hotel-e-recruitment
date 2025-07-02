"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ExamQuestion {
  id: string;
  question_text: string;
  choices: string;
}

interface ExamData {
  id: string;
  title: string;
  description: string;
  lowongan_id: string;
}

interface ExamClientPageProps {
  exam: ExamData;
  questions: ExamQuestion[];
  userId: string;
}

export default function ExamClientPage({
  exam,
  questions,
  userId,
}: ExamClientPageProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/submit-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          examId: exam.id,
          userId,
          lowonganId: exam.lowongan_id, // 👈 ini ditambahkan
        }),
      });

      if (res.ok) {
        toast.success("Ujian berhasil dikirim!");
        router.push("/user/profile/lamaran-saya"); // 👈 redirect otomatis
      } else {
        const result = await res.json();
        console.error(result.error);
        toast.error("Gagal memeriksa jawaban.");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("Terjadi kesalahan saat mengirim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{exam.title}</h2>
        <p className="text-sm text-muted-foreground">{exam.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, index) => {
          const choices: string[] = JSON.parse(q.choices);
          return (
            <div key={q.id} className="space-y-2">
              <p className="font-medium">
                {index + 1}. {q.question_text}
              </p>
              <div className="space-y-1">
                {choices.map((choice) => (
                  <label key={choice} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={choice}
                      checked={answers[q.id] === choice}
                      onChange={() => handleChange(q.id, choice)}
                      required
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        <Button type="submit" className="mt-4" disabled={loading}>
          {loading ? "Memeriksa..." : "Submit Jawaban"}
        </Button>
      </form>
    </div>
  );
}
