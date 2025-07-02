// /user/profile/layout.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // pastikan kamu punya fungsi cn()

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

const links = [
  { href: "/user/profile/biodata", label: "Biodata" },
  { href: "/user/profile/pendidikan", label: "Pendidikan" },
  { href: "/user/profile/pengalaman", label: "Pengalaman" },
  { href: "/user/profile/lamaran-saya", label: "Lamaran Saya" }, // ⬅️ Tambahan
];

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 md:px-6 py-8 max-w-6xl mx-auto mt-20 md:mt-0">
      {/* Sidebar */}
      <aside className="w-full md:w-72">
        <div className="bg-muted/30 rounded-xl p-6 flex flex-col items-center gap-6 shadow-sm">
          <Avatar className="w-20 h-20">
            <AvatarFallback>
              <UserIcon className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
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

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
