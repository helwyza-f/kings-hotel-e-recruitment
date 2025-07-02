import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <Image
      src="/img/logo2.png"
      alt="logo"
      width={100}
      height={100}
      priority={true}
    />
  );
}
