"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarRouteItemsProps {
  icon: LucideIcon;
  label: string;
  href: string;
  onLinkClick: () => void;
}

export default function SidebarRouteItems({
  icon: Icon,
  label,
  href,
  onLinkClick,
}: SidebarRouteItemsProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "flex items-center gap-x-2 py-2 pl-6 text-sm font-medium text-neutral-500 transition-all hover:bg-neutral-300/50 hover:text-neutral-600",
        isActive &&
          "bg-purple-200/20 text-purple-700 hover:bg-purple-700/30 hover:text-purple-700",
      )}
      onClick={onLinkClick}
    >
      <div className="flex items-center gap-x-2 py-2">
        <Icon
          size={22}
          className={cn("text-neutral-500", isActive && "text-purple-700")}
        />
        {label}
      </div>
      {/* highlight */}
      <div
        className={cn(
          "ml-auto h-full border-2 border-purple-700 opacity-0 transition-all",
          isActive && "opacity-100",
        )}
      ></div>
    </Link>
  );
}
