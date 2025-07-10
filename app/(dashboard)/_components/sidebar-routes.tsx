"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, List, User } from "lucide-react";
import SidebarRouteItems from "./sidebar-route-items";
import { createClient } from "@/lib/supabase/client";

const adminRoutes = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: List, label: "Lowongan", href: "/admin/lowongan" },
];

const guestRoutes = [
  { icon: Home, label: "Home", href: "/user/dashboard" },
  { icon: List, label: "Lowongan", href: "/user/lowongan" },
  { icon: User, label: "Profile", href: "/user/profile" },
];

interface SidebarRoutesProps {
  onLinkClick: () => void;
}

export default function SidebarRoutes({ onLinkClick }: SidebarRoutesProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<"admin" | "user" | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const supabase = createClient();
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
          setRole("admin");
        } else {
          setRole("user");
        }
      }
    };

    fetchRole();
  }, []);

  const routes = role === "admin" ? adminRoutes : guestRoutes;

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
