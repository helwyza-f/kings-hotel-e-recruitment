import { UpdatePasswordForm } from "@/components/update-password-form";
import Image from "next/image";
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
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
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
