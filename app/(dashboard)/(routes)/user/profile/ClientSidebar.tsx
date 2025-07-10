// app/user/profile/ClientSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/user/profile/biodata", label: "Biodata" },
  { href: "/user/profile/pendidikan", label: "Pendidikan" },
  { href: "/user/profile/pengalaman", label: "Pengalaman" },
  { href: "/user/profile/lamaran-saya", label: "Lamaran Saya" },
];

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-72">
      <div className="bg-muted/30 rounded-xl p-6 flex flex-col items-center gap-6 shadow-sm">
        <h2 className="text-lg font-bold tracking-wide">PROFIL SAYA</h2>

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
