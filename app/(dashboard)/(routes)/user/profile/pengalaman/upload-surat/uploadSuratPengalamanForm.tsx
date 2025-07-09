"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { fileToBase64 } from "@/lib/utils/base64";

type PengalamanAI = {
  perusahaan: string;
  jabatan: string;
  periode: string;
};

export default function UploadSuratPengalamanForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PengalamanAI | null>(null);
  const [loadingSimpan, setLoadingSimpan] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file)
      return toast.error(
        "Silakan pilih file surat pengalaman terlebih dahulu."
      );

    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const mimeType = file.type;

      const res = await fetch("/api/extract-pengalaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64, mimeType }),
      });

      if (!res.ok)
        throw new Error("Gagal mengekstrak data dari surat pengalaman.");

      const data: PengalamanAI = await res.json();
      setPreview(data);
      toast.success("Berhasil membaca data dari surat pengalaman!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memproses surat pengalaman.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimpan = async () => {
    if (!preview) return;
    setLoadingSimpan(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;

    if (!user_id) return toast.error("User tidak ditemukan.");

    const { error } = await supabase.from("pengalaman_kerja").insert([
      {
        user_id,
        perusahaan: preview.perusahaan,
        jabatan: preview.jabatan,
        periode: preview.periode,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error("Gagal menyimpan ke database.");
    } else {
      setLoadingSimpan(false);
      toast.success("Data pengalaman berhasil disimpan!");
      router.push("/user/profile/pengalaman");
    }
  };

  return (
    <div className="space-y-6">
      <Input
        type="file"
        accept="image/jpeg,image/png"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={loading}
      />

      <Button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Memproses..." : "Proses Surat Pengalaman"}
      </Button>

      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Ekstraksi AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Perusahaan:</strong> {preview.perusahaan}
            </p>
            <p>
              <strong>Jabatan:</strong> {preview.jabatan}
            </p>
            <p>
              <strong>Periode:</strong> {preview.periode}
            </p>
            <Button onClick={handleSimpan} disabled={loadingSimpan}>
              Simpan ke Database
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
