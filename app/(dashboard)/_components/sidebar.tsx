import React from "react";
import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

interface SidebarProps {
  onLinkClick: () => void;
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r dark:border-primary bg-background text-foreground shadow-md">
      <div className="p-6 justify-center items-center flex">
        <Logo />
      </div>
      <div className="flex w-full flex-col">
        <SidebarRoutes onLinkClick={onLinkClick} />
      </div>
    </div>
  );
}
