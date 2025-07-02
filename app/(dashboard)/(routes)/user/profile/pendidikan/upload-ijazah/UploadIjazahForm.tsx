// /user/profile/pendidikan/upload-ijazah/UploadIjazahForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { fileToBase64 } from "@/lib/utils/base64";
// import { set } from "date-fns";

type PendidikanAI = {
  institusi: string;
  jurusan: string;
  kualifikasi: string;
  periode: string;
};

export default function UploadIjazahForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PendidikanAI | null>(null);

  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return toast.error("Silakan pilih file ijazah terlebih dahulu.");

    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const mimeType = file.type; // ambil langsung
      const res = await fetch("/api/extract-pendidikan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64, mimeType }),
      });

      if (!res.ok) throw new Error("Gagal mengekstrak data dari ijazah.");
      const data: PendidikanAI = await res.json();

      setPreview(data);
      toast.success("Berhasil membaca data dari ijazah!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memproses ijazah.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimpan = async () => {
    if (!preview) return;
    setLoading(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;

    if (!user_id) return toast.error("User tidak ditemukan.");

    const { error } = await supabase.from("pendidikan").insert([
      {
        user_id,
        institusi: preview.institusi,
        jurusan: preview.jurusan,
        kualifikasi: preview.kualifikasi,
        periode: preview.periode,
        // Tambahan field jika ada: sumber: "ai", verifikasi: false
      },
    ]);

    if (error) {
      console.error(error);
      toast.error("Gagal menyimpan ke database.");
    } else {
      setLoading(false);
      toast.success("Data berhasil disimpan!");
      router.push("/user/profile/pendidikan");
    }
  };

  return (
    <div className="space-y-6">
      <Input
        type="file"
        accept="image/jpeg,image/png" // Hindari PDF
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={loading}
      />

      <Button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Memproses..." : "Proses Ijazah"}
      </Button>

      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Ekstraksi AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Institusi:</strong> {preview.institusi}
            </p>
            <p>
              <strong>Jurusan:</strong> {preview.jurusan}
            </p>
            <p>
              <strong>Kualifikasi:</strong> {preview.kualifikasi}
            </p>
            <p>
              <strong>Periode:</strong> {preview.periode}
            </p>
            <Button onClick={handleSimpan}>Simpan ke Database</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
