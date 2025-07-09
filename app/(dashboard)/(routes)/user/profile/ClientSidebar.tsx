"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/user/profile/biodata", label: "Biodata" },
  { href: "/user/profile/pendidikan", label: "Pendidikan" },
  { href: "/user/profile/pengalaman", label: "Pengalaman" },
  { href: "/user/profile/lamaran-saya", label: "Lamaran Saya" },
];

export default function ClientSidebar({ fotoUrl }: { fotoUrl: string | null }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-full md:w-72">
      <div className="bg-muted/30 rounded-xl p-6 flex flex-col items-center gap-6 shadow-sm">
        <button
          onClick={() => router.push("/user/profile/foto-profil")}
          className="focus:outline-none"
          title="Edit Foto Profil"
        >
          <Avatar className="w-20 h-20 ring-2 ring-accent hover:brightness-90 transition">
            {fotoUrl ? (
              <AvatarImage src={fotoUrl} alt="Foto Profil" />
            ) : (
              <AvatarFallback>
                <UserIcon className="w-8 h-8" />
              </AvatarFallback>
            )}
          </Avatar>
        </button>

        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold tracking-wide">PROFIL SAYA</h2>
        </div>

        <nav className="w-full space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block w-full rounded-md px-4 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith(link.href)
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
