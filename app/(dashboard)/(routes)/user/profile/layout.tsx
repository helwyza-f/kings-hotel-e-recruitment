// app/user/profile/layout.tsx
import { ReactNode } from "react";
import ClientSidebar from "./ClientSidebar";

interface Props {
  children: ReactNode;
}

export default function UserProfileLayout({ children }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 md:px-6 py-8 max-w-6xl mx-auto mt-20 md:mt-0">
      <ClientSidebar /> {/* Tidak perlu props */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
