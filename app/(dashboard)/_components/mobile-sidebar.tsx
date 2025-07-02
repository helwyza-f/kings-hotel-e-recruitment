"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Sidebar from "./sidebar";
import { useState } from "react";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        className="pr-4 opacity-75 transition-all hover:opacity-100 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent className="bg-background p-0" side={"left"}>
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>Menu Sidebar</SheetTitle>
          </VisuallyHidden>
        </SheetHeader>
        <Sidebar onLinkClick={handleLinkClick} />
      </SheetContent>
    </Sheet>
  );
}
