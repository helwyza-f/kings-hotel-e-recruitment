import React from "react";
import NavbarRoutes from "./navbar-routes";
import MobileSidebar from "./mobile-sidebar";
export default function Navbar() {
  return (
    <div className="flex h-full items-center border-b dark:border-primary bg-background text-foreground p-4 shadow-md">
      {/* Mobile routes */}
      <MobileSidebar />
      {/* Desktop routes */}
      <NavbarRoutes />
    </div>
  );
}
