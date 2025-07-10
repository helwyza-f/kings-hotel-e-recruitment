import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/user/profile");
    }
  }

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
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
