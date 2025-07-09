import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import supabaseAdmin from "@/lib/supabase/admin";

export default async function RootPage() {
  const { data: lowongans } = await supabaseAdmin
    .from("lowongan")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/bg.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={80}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-[80vh] text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Selamat Datang di King's Recruitment
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow">
          Aplikasi modern untuk membangun profil akademik dan pengalaman kerja
          Anda.
        </p>

        <Link href="/user/profile">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 text-foreground"
          >
            Masuk ke Profil
          </Button>
        </Link>
      </div>

      {/* Lowongan Terbaru */}
      <div className="relative z-10 w-full px-6 py-10 bg-transparent ">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center text-foreground">
            Lowongan Terbaru
          </h2>

          {lowongans?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {lowongans.map((lowongan) => (
                <Card key={lowongan.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{lowongan.posisi}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Jatuh Tempo:{" "}
                      <span className="text-foreground font-medium">
                        {new Date(lowongan.jatuh_tempo).toLocaleDateString()}
                      </span>
                    </p>
                    <Link
                      href={`/user/lowongan/${lowongan.id}`}
                      className="inline-block mt-4 text-blue-600 hover:underline"
                    >
                      Lihat Detail →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              Belum ada lowongan tersedia.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
