"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Props {
  profile: {
    id: string;
    foto_url: string | null;
  };
}

export default function EditFotoProfilClientPage({ profile }: Props) {
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(profile.foto_url || "");
  const router = useRouter();

  const handleUpload = async () => {
    if (!fotoFile) {
      toast.warning("Silakan pilih foto terlebih dahulu.");
      return;
    }

    const supabase = createClient();
    const ext = fotoFile.name.split(".").pop();
    const filePath = `avatars/${profile.id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, fotoFile, { upsert: true });

    if (uploadError) {
      toast.error("Gagal mengupload foto.");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ foto_url: publicUrlData.publicUrl })
      .eq("id", profile.id);

    if (updateError) {
      toast.error("Gagal memperbarui profil.");
    } else {
      toast.success("Foto profil berhasil diperbarui!");
      router.refresh();
      router.push("/user/profile/biodata");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-white dark:bg-muted p-6 rounded-xl shadow-md space-y-6 text-center">
        <h2 className="text-2xl font-semibold">Ubah Foto Profil</h2>

        <div className="flex justify-center">
          <div className="relative group">
            <Image
              src={previewUrl || "/placeholder.jpg"}
              alt="Preview"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover border-4 border-accent shadow-md transition duration-200 group-hover:brightness-95"
            />
          </div>
        </div>

        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer file:text-sm file:mr-4"
          />
        </div>
        <div className="flex gap-3 ">
          <Button
            onClick={handleUpload}
            className=" font-semibold"
            disabled={!fotoFile}
          >
            Simpan Foto
          </Button>
          <Button
            variant="outline"
            className=""
            onClick={() => router.push("/user/profile/biodata")}
          >
            Batal
          </Button>
        </div>
      </div>
    </div>
  );
}
