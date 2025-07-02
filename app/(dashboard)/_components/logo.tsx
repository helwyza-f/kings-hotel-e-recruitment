import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <Image
      src="/img/logo.png"
      alt="logo"
      width={80}
      height={80}
      priority={true}
    />
  );
}
