"use client";

import Logo from "@/app/(dashboard)/_components/logo";
import Box from "@/components/box";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const menuOne = [
  { href: "#", label: "About Us" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Employer home" },
  { href: "#", label: "Sitemap" },
  { href: "#", label: "Credits" },
];

export const Footer = () => {
  return (
    <Box className="h-72 flex-col items-start p-4">
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        {/* first section */}
        <Box className="flex-col items-start gap-6">
          <div className="flex items-center gap-3">
            <Logo />
            <h2 className="text-xl font-semibold text-muted-foreground">
              WorkNow
            </h2>
          </div>
          <p className="text-base font-semibold">Connect with us</p>
          <div className="flex w-full items-center gap-6">
            <Link href={"https://github.com/helwyza-f"}>
              <Facebook className="h-5 w-5 text-muted-foreground transition-all hover:scale-125 hover:text-purple-500" />
            </Link>

            <Link href={"https://github/helwyza-f"}>
              <Twitter className="h-5 w-5 text-muted-foreground transition-all hover:scale-125 hover:text-purple-500" />
            </Link>

            <Link href={"https://www.linkedin.com/in/helwiza-fahry-192a19230/"}>
              <Linkedin className="h-5 w-5 text-muted-foreground transition-all hover:scale-125 hover:text-purple-500" />
            </Link>

            <Link href={"https://www.linkedin.com/in/helwiza-fahry-192a19230/"}>
              <Youtube className="h-5 w-5 text-muted-foreground transition-all hover:scale-125 hover:text-purple-500" />
            </Link>
          </div>
        </Box>

        {/* second */}

        <Box className="ml-4 flex-col items-start justify-between gap-y-4">
          {menuOne.map((item) => (
            <Link key={item.label} href={item.href}>
              <p className="font-sans text-sm text-neutral-500 hover:text-purple-500">
                {item.label}
              </p>
            </Link>
          ))}
        </Box>

        <Box className="ml-4 flex-col items-start justify-between gap-y-4">
          {menuOne.map((item) => (
            <Link key={item.label} href={item.href}>
              <p className="font-sans text-sm text-neutral-500 hover:text-purple-500">
                {item.label}
              </p>
            </Link>
          ))}
        </Box>

        <Card className="col-span-2 p-6">
          <CardTitle className="text-base">Apply on the go</CardTitle>
          <CardDescription>
            Get real-time job updates on our App
          </CardDescription>
          <Link href={"#"}>
            <div className="relative h-24 w-full overflow-hidden">
              <Image
                src={"/img/play-store-app.png"}
                fill
                className="h-full w-full object-contain"
                alt="Play Store & Apple Store"
              />
            </div>
          </Link>
        </Card>
      </div>

      <Separator />
      <Box className="justify-center p-4 text-sm text-muted-foreground">
        All rights reserved &copy; 2024
      </Box>
    </Box>
  );
};
