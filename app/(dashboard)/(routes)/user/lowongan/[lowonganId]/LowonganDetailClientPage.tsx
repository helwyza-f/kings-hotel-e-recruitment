// /user/lowongan/[lowonganId]/LowonganDetailClientPage.tsx
"use client";

import dynamic from "next/dynamic"; // Import dynamic for lazy loading
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Lazy load ReactQuill with no SSR (Server-Side Rendering)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.bubble.css"; // Bubble theme
import Link from "next/link";

interface Lowongan {
  id: string;
  posisi: string;
  minimal_pendidikan: string;
  jatuh_tempo: string;
  informasi: string;
}

interface LowonganDetailClientPageProps {
  lowongan: Lowongan;
  sudahMelamar: boolean;
  bolehMelamar: boolean; // Optional prop to indicate if the user can apply
}

export default function LowonganDetailClientPage({
  lowongan,
  sudahMelamar,
  bolehMelamar, // Optional prop to indicate if the user can apply
}: LowonganDetailClientPageProps) {
  return (
    <div>
      <h3 className="font-medium text-lg">{lowongan.posisi}</h3>
      <p>Minimal Pendidikan: {lowongan.minimal_pendidikan}</p>
      <p>
        Tanggal Jatuh Tempo:{" "}
        {format(new Date(lowongan.jatuh_tempo), "dd MMM yyyy")}
      </p>

      <div className="my-4">
        <p className="font-medium">Informasi:</p>
        <ReactQuill
          value={lowongan.informasi || ""}
          readOnly
          theme="bubble"
          className="bg-background text-foreground"
        />
      </div>

      {!sudahMelamar ? (
        <div className="mt-4 space-y-2">
          {!bolehMelamar ? (
            <p className="text-sm text-red-500">
              ⚠️ Silakan lengkapi data pendidikan dan pengalaman kerja Anda di
              halaman profil sebelum melamar.
            </p>
          ) : (
            <Link href={`/user/lowongan/${lowongan.id}/lamaran`}>
              <Button variant="default" size="sm" disabled={!bolehMelamar}>
                Lamar Sekarang
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          ✅ Anda sudah melamar ke lowongan ini.
        </p>
      )}
    </div>
  );
}
