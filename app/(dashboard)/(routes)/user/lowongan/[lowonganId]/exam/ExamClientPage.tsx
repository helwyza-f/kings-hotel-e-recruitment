"use client";

import { useEffect, useState } from "react";
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
  duration_minutes: number;
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
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [timerExpired, setTimerExpired] = useState(false);

  const examKey = `exam-start-${exam.id}`;

  // Format time: MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    // Hitung waktu sisa dari localStorage
    const storedStart = localStorage.getItem(examKey);
    let startTime: number;

    if (storedStart) {
      startTime = parseInt(storedStart, 10);
    } else {
      // Simpan waktu sekarang sebagai waktu mulai
      startTime = Date.now();
      localStorage.setItem(examKey, startTime.toString());
    }

    const totalTime = exam.duration_minutes * 60; // seconds

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = totalTime - elapsed;

      if (remaining <= 0) {
        setTimerExpired(true);
        handleSubmitAuto();
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitAuto = async () => {
    setLoading(true);
    toast.info("Waktu habis. Jawaban dikirim otomatis.");
    try {
      const res = await fetch("/api/submit-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          examId: exam.id,
          userId,
          lowonganId: exam.lowongan_id,
        }),
      });

      if (res.ok) {
        localStorage.removeItem(examKey);
        router.push("/user/profile/lamaran-saya");
      } else {
        toast.error("Gagal mengirim otomatis.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat auto-submit.");
    } finally {
      setLoading(false);
    }
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
          lowonganId: exam.lowongan_id,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Ujian berhasil dikirim!");
        localStorage.removeItem(examKey);
        router.push("/user/profile/lamaran-saya");
      } else {
        toast.error(result.error || "Gagal memeriksa jawaban.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{exam.title}</h2>
          <p className="text-sm text-muted-foreground">{exam.description}</p>
        </div>
        <div className="text-red-600 font-bold text-lg">
          Sisa waktu: {formatTime(timeLeft)}
        </div>
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
                      disabled={loading || timerExpired}
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        <Button
          type="submit"
          className="mt-4"
          disabled={loading || timerExpired}
        >
          {loading ? "Memeriksa..." : "Submit Jawaban"}
        </Button>
      </form>
    </div>
  );
}
