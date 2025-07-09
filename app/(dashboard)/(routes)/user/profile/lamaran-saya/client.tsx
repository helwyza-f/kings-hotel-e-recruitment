"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Lamaran = {
  id: string;
  status: string;
  created_at: string;
  exam_score: number | null;
  exam_category: string | null;
  lowongan: {
    id: string;
    posisi: string;
    jatuh_tempo: string;
  };
};

export default function LamaranSayaClient({
  lamarans,
}: {
  lamarans: Lamaran[];
}) {
  const router = useRouter();

  return (
    <div className="space-y-6 p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold">Lamaran Saya</h1>

      {lamarans.length === 0 ? (
        <p className="text-muted-foreground">
          Anda belum pernah melamar pekerjaan.
        </p>
      ) : (
        <div className="space-y-4">
          {lamarans.map((lamaran) => (
            <Card key={lamaran.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {lamaran.lowongan.posisi}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Dikirim:{" "}
                      {new Date(lamaran.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/user/lowongan/${lamaran.lowongan.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Lihat Lowongan
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 mb-2">
                <p className="text-sm text-muted-foreground">
                  Jatuh Tempo:{" "}
                  {new Date(lamaran.lowongan.jatuh_tempo).toLocaleDateString()}
                </p>

                <p className="text-sm">
                  Status Lamaran:{" "}
                  <span className="font-medium text-primary">
                    {lamaran.status}
                  </span>
                </p>

                {lamaran.exam_score === null && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full sm:w-fit mt-4"
                      >
                        Kerjakan Ujian
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Mulai Ujian Sekarang?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Setelah Anda masuk ke halaman ujian, timer akan
                          langsung berjalan dan tidak dapat dijeda. Pastikan
                          Anda siap sebelum memulai.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            router.push(
                              `/user/lowongan/${lamaran.lowongan.id}/exam`
                            )
                          }
                        >
                          Ya, Saya Siap
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
