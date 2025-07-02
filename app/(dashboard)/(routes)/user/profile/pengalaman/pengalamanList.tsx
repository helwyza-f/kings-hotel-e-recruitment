"use client";

import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Pengalaman = {
  id: string;
  perusahaan: string;
  jabatan: string;
  periode: string;
};

export default function PengalamanList({
  pengalaman,
}: {
  pengalaman: Pengalaman[];
}) {
  const router = useRouter();

  const deletePengalaman = async (id: string) => {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("pengalaman_kerja")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting pengalaman:", error.message);
      } else {
        toast.success("Pengalaman kerja berhasil dihapus");
        router.refresh();
      }
    } catch (error) {
      console.error("Error during delete:", error);
      toast.error("Gagal menghapus pengalaman kerja.");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        Untuk menambahkan data pengalaman, silakan unggah surat pengalaman kamu.
      </p>

      <Button
        onClick={() => router.push("/user/profile/pengalaman/upload-surat")}
        className="flex items-center gap-2"
      >
        <PlusCircle className="w-4 h-4" />
        Upload Surat Pengalaman
      </Button>

      {pengalaman.length === 0 ? (
        <p className="text-muted-foreground">Belum ada data pengalaman.</p>
      ) : (
        pengalaman.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader>
              <CardTitle className="text-lg">{item.perusahaan}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>
                <span className="font-medium">Jabatan:</span> {item.jabatan}
              </p>
              <p>
                <span className="font-medium">Periode:</span> {item.periode}
              </p>
            </CardContent>

            <Button
              onClick={() => deletePengalaman(item.id)}
              variant="destructive"
              className="absolute top-2 right-2 p-1"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}
