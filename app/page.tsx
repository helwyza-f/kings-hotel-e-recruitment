// app/(landing)/page.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import supabaseAdmin from "@/lib/supabase/admin";
import { GraduationCap, Clock, FileText } from "lucide-react";

export default async function RootPage() {
  const { data: lowongans } = await supabaseAdmin
    .from("lowongan")
    .select("*")
    .order("created_at", { ascending: true });
  // .limit(5);

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden">
        {/* Background */}
        <Image
          src="/img/bg3.jpg"
          alt="Hero background"
          fill
          className="object-cover object-left "
          quality={100}
          priority
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl px-6 py-16 gap-10">
          {/* Text */}
          <div className="text-center lg:text-left max-w-xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-xl">
              Selamat Datang di King&apos;s Recruitment
            </h1>
            <p className="text-lg md:text-xl mb-8 drop-shadow">
              Aplikasi modern untuk membangun profil akademik dan pengalaman
              kerja Anda.
            </p>
            <Link href="/user/profile">
              <Button
                variant="secondary"
                size="lg"
                className="text-lg font-medium"
              >
                Masuk ke Profil
              </Button>
            </Link>
          </div>

          {/* Image */}
          <div className="relative w-[250px] h-[250px] md:w-[600px] md:h-[600px] ">
            <Image
              src="/img/org.png"
              alt="Gambar Orang"
              width={800}
              height={800}
              className="object-cover z-20 w-full h-full rounded-full "
              priority
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-gradient-to-r from-[#0099A8] to-[#00788C] pt-16 pb-10 px-4 flex flex-col items-center text-center">
        <div className="max-w-3xl w-full mb-3">
          <h2 className="text-4xl font-semibold text-white mb-4">Timeline</h2>
          <p className="text-lg text-white">
            Kami membuka kesempatan bagi Anda yang ingin bergabung bersama tim
            profesional King's Hotel. Berikut tahapan proses seleksi yang perlu
            Anda ikuti:
          </p>
        </div>
        <div className="max-w-5xl w-full">
          <Image
            src="/img/time line.png"
            alt="Timeline"
            width={1200}
            height={400}
            className="w-full object-contain"
          />
        </div>
      </section>

      {/* Lowongan Terbaru */}
      <section className="w-full py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Lowongan Terbaru
          </h2>

          {lowongans?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {lowongans.map((lowongan) => (
                <Card
                  key={lowongan.id}
                  className="shadow-md hover:shadow-lg transition"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {lowongan.posisi}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 space-y-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span>
                        Pendidikan minimal:{" "}
                        <strong>
                          {lowongan.minimal_pendidikan.toUpperCase()}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>
                        Jatuh tempo:{" "}
                        <strong>
                          {new Date(lowongan.jatuh_tempo).toLocaleDateString()}
                        </strong>
                      </span>
                    </div>

                    <Link
                      href={`/user/lowongan/${lowongan.id}`}
                      className="inline-block mt-4 text-blue-600 hover:underline font-medium"
                    >
                      Lihat Detail →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              Belum ada lowongan tersedia.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
