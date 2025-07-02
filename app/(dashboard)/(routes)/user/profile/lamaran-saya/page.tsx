// /app/user/profile/lamaran-saya/page.tsx
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default async function LamaranSayaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <p className="text-center text-muted-foreground">
        Anda harus login untuk melihat lamaran.
      </p>
    );
  }

  const { data, error } = await supabase
    .from("lamaran")
    .select(
      `
      id,
      status,
      created_at,
      exam_score,
      exam_category,
      lowongan (
        id,
        posisi,
        jatuh_tempo
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-center text-red-500">Gagal memuat data lamaran.</p>
    );
  }

  const lamarans = data as unknown as Lamaran[];

  return (
    <div className="space-y-6 p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold">Lamaran Saya</h1>

      {lamarans?.length === 0 ? (
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

                {lamaran.exam_score !== null ? (
                  <div className="text-sm space-y-1">
                    <p>Skor Ujian: {lamaran.exam_score}</p>
                    <p>Kategori: {lamaran.exam_category}</p>
                  </div>
                ) : (
                  <Link href={`/user/lowongan/${lamaran.lowongan.id}/exam`}>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full sm:w-fit mt-4"
                    >
                      Kerjakan Ujian
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
