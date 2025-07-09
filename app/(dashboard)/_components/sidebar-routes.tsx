"use client";

import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, List, User, User2 } from "lucide-react";
import SidebarRouteItems from "./sidebar-route-items";

const adminRoutes = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: List, label: "Lowongan", href: "/admin/lowongan" },
  // { icon: User2, label: "Pelamar", href: "/admin/pelamar" },
];

const guestRoutes = [
  { icon: Home, label: "Home", href: "/user/dashboard" },
  { icon: List, label: "Lowongan", href: "/user/lowongan" },
  { icon: User, label: "Profile", href: "/user/profile" },
  // { icon: BookMarked, label: "Saved Jobs", href: "/saved-jobs" },
];

interface SidebarRoutesProps {
  onLinkClick: () => void;
}

export default function SidebarRoutes({ onLinkClick }: SidebarRoutesProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const routes = isAdminPage ? adminRoutes : guestRoutes;

  return (
    <div className="flex w-full flex-col text-foreground">
      {routes.map((route) => (
        <SidebarRouteItems
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          onLinkClick={onLinkClick}
        />
      ))}
    </div>
  );
}
