"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Check,
  X,
  FileText,
  MailOpen,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Pelamar {
  id: string;
  status: string;
  exam_score: number | null;
  exam_category: string | null;
  cv_url: string | null;
  surat_lamaran_url: string | null;
  created_at: string;
  pendidikan: string;
  pengalaman_kerja: number;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function PelamarCardList({ pelamars }: { pelamars: Pelamar[] }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/lamaran/${id}/update-status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Status berhasil diperbarui");
        location.reload();
      } else {
        toast.error("Gagal memperbarui status");
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {pelamars.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border bg-card shadow-sm p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">
                {p.user.first_name} {p.user.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">{p.user.email}</p>

              <div className="mt-2 flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <span>{p.pendidikan}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{p.pengalaman_kerja} tahun</span>
              </div>

              <div className="mt-2 text-sm">
                <span className="font-medium">Status:</span>{" "}
                <span className="text-primary">{p.status}</span>
              </div>

              <div className="text-sm">
                <span className="font-medium">Skor:</span> {p.exam_score ?? "-"}{" "}
                ({p.exam_category ?? "-"})
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-3">
                {p.cv_url && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`${supabaseUrl}/storage/v1/object/public/${p.cv_url}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FileText className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>CV</TooltipContent>
                  </Tooltip>
                )}
                {p.surat_lamaran_url && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`${supabaseUrl}/storage/v1/object/public/${p.surat_lamaran_url}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MailOpen className="w-5 h-5 text-green-600 hover:text-green-800" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>Surat Lamaran</TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleUpdateStatus(p.id, "Direview")}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tandai Direview</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleUpdateStatus(p.id, "Ditolak")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tolak</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
