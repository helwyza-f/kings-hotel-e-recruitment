"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface LowonganClientPageProps {
  lowongan: Array<{
    id: string;
    posisi: string;
    minimal_pendidikan: string;
    jatuh_tempo: string;
    informasi: string;
  }>;
}

export default function LowonganClientPage({
  lowongan: initialLowongan,
}: LowonganClientPageProps) {
  const [lowongan, setLowongan] = useState(initialLowongan);
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("lowongan").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus lowongan.");
      return;
    }

    setLowongan((prev) => prev.filter((item) => item.id !== id));
    toast.success("Lowongan berhasil dihapus.");
  };

  return (
    <div className="p-6 space-y-6 bg-background text-foreground">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Daftar Lowongan</h1>
        <Link href="/admin/lowongan/create">
          <Button>Tambah Lowongan Baru</Button>
        </Link>
      </div>

      {lowongan.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          Belum ada lowongan tersedia.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
          {lowongan.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 space-y-4"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{item.posisi}</h2>
                <p className="text-sm text-muted-foreground">
                  Pendidikan Minimal: {item.minimal_pendidikan}
                </p>
                <p className="text-sm text-muted-foreground">
                  Jatuh Tempo:{" "}
                  {format(new Date(item.jatuh_tempo), "dd MMM yyyy")}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Link href={`/admin/lowongan/${item.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Hapus
                </Button>
                <Link href={`/admin/lowongan/${item.id}/exam`}>
                  <Button variant="secondary" size="sm">
                    Manage Exams
                  </Button>
                </Link>
                <Link href={`/admin/lowongan/${item.id}/pelamar`}>
                  <Button variant="default" size="sm">
                    Kelola Pelamar
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
