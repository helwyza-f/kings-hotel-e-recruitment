import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function RootPage() {
  return (
    <div className="relative h-screen w-full">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/bg.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={80}
        />
        <div className="absolute inset-0 bg-black/60" /> {/* overlay */}
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Selamat Datang di King's Recruitment
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow">
          Aplikasi modern untuk membangun profil akademik dan pengalaman kerja
          Anda.
        </p>

        <Link href="/user/profile">
          <Button
            variant={"outline"}
            size="lg"
            className="px-8 py-4 text-foreground"
          >
            Masuk ke Profil
          </Button>
        </Link>
      </div>
    </div>
  );
}
