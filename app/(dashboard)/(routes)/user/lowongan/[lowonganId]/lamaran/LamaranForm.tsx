"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface LamaranFormProps {
  lowongan: any;
  userId: string;
}

export default function LamaranForm({ lowongan, userId }: LamaranFormProps) {
  const [cv, setCv] = useState<File | null>(null);
  const [suratLamaran, setSuratLamaran] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setCv(event.target.files[0]);
    }
  };

  const handleSuratLamaranChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setSuratLamaran(event.target.files[0]);
    }
  };

  const sanitizeFilename = (filename: string) => {
    return filename.replace(/[^\w\s.-]/g, "").replace(/\s+/g, "_");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cv || !suratLamaran) {
      toast.error("CV dan Surat Lamaran wajib diunggah.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const cvFilename = sanitizeFilename(cv.name);
      const suratFilename = sanitizeFilename(suratLamaran.name);

      const { data: cvData, error: cvError } = await supabase.storage
        .from("lamaran-files")
        .upload(`cv/${Date.now()}_${cvFilename}`, cv);

      const { data: suratData, error: suratError } = await supabase.storage
        .from("lamaran-files")
        .upload(`surat_lamaran/${Date.now()}_${suratFilename}`, suratLamaran);

      if (cvError || suratError) {
        toast.error("Gagal mengunggah file.");
        return;
      }

      const { error: lamaranError } = await supabase.from("lamaran").insert([
        {
          user_id: userId,
          lowongan_id: lowongan.id,
          cv_url: cvData?.fullPath,
          surat_lamaran_url: suratData?.fullPath,
          status: "pending",
        },
      ]);

      if (lamaranError) {
        toast.error("Gagal mengirim lamaran.");
        console.error(lamaranError.message);
      } else {
        toast.success("Lamaran berhasil dikirim!");
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="cv"
              className="block text-sm font-medium text-foreground"
            >
              Upload CV
            </label>
            <Input
              type="file"
              id="cv"
              onChange={handleCvChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="surat_lamaran"
              className="block text-sm font-medium text-foreground"
            >
              Upload Surat Lamaran
            </label>
            <Input
              type="file"
              id="surat_lamaran"
              onChange={handleSuratLamaranChange}
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !cv || !suratLamaran}
            className="w-full md:w-fit"
          >
            {isSubmitting ? "Mengirim..." : "Submit Lamaran"}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-green-600 text-sm">
            ✅ Lamaran Anda telah berhasil dikirim.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={() => router.push(`/user/lowongan/${lowongan.id}/exam`)}
            >
              Lanjut ke Exam
            </Button>
            <Button onClick={() => router.push("/user/profile/lamaran-saya")}>
              Lihat Lamaran Saya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
