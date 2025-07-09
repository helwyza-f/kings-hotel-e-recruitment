"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, SquarePen, Trash } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ExamClientPage({
  lowonganId,
  exam,
  examQuestions,
}: {
  lowonganId: string;
  exam: {
    id: string;
    duration_minutes: number;
    title: string;
    description?: string;
  };
  examQuestions: any[];
}) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [duration, setDuration] = useState<number>(exam.duration_minutes);
  const [isEditTimer, setIsEditTimer] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updated = examQuestions.map((q) => ({
      ...q,
      choices: Array.isArray(q.choices)
        ? q.choices
        : q.choices
        ? JSON.parse(q.choices)
        : [],
    }));
    setQuestions(updated);
  }, [examQuestions]);

  const handleDeleteQuestion = async (questionId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("exam_questions")
      .delete()
      .eq("id", questionId);

    if (error) {
      toast.error("Gagal menghapus soal.");
    } else {
      toast.success("Soal berhasil dihapus!");
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    }
  };

  const handleUpdateDuration = async () => {
    if (duration < 1 || duration > 180) {
      toast.warning("Durasi harus antara 1 hingga 180 menit.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("exams")
      .update({ duration_minutes: duration })
      .eq("id", exam.id);

    if (error) {
      toast.error("Gagal memperbarui durasi.");
    } else {
      toast.success("Durasi berhasil diperbarui.");
      setIsEditTimer(false);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Informasi Ujian */}
      <div className="border rounded-lg p-4 space-y-3 bg-muted/20">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold text-lg">{exam.title}</h2>
            <p className="text-sm text-muted-foreground">{exam.description}</p>
          </div>
        </div>

        {/* Durasi */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Durasi Ujian:</span>

          {isEditTimer ? (
            <>
              <Input
                type="number"
                className="w-24"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min={1}
                max={180}
              />
              <span className="text-sm">menit</span>
              <Button
                size="sm"
                onClick={handleUpdateDuration}
                disabled={loading}
              >
                Simpan Durasi
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditTimer(false)}
                disabled={loading}
              >
                Batal
              </Button>
            </>
          ) : (
            <>
              <span className="font-medium">{duration} menit</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditTimer(true)}
                className="text-muted-foreground"
                title="Edit Durasi"
              >
                <Pencil size={16} />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tambah Soal */}
      <div className="flex justify-between items-center border-b pb-2">
        <Link href={`/admin/lowongan/${lowonganId}/exam/create`}>
          <Button className="bg-primary text-background hover:bg-button-hover">
            Add New Question
          </Button>
        </Link>
      </div>

      {/* Daftar Soal */}
      {questions.map((q) => (
        <div key={q.id} className="border-b py-4">
          <h3 className="font-medium">{q.question_text}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Pilihan: {q.choices.join(", ")}
          </p>
          <div className="mt-2 flex gap-2">
            <Link href={`/admin/lowongan/${lowonganId}/exam/${q.id}`}>
              <Button size="sm" variant="outline">
                <SquarePen size={16} className="mr-1" />
                Edit
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteQuestion(q.id)}
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
