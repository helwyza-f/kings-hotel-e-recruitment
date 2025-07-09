// /user/profile/biodata/UserProfileViewPage.tsx
"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfileViewPageProps {
  profile: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    no_hp: string | null;
    alamat: string | null;
    jenis_kelamin: string | null;
    tanggal_lahir: string | null;
    tempat_lahir: string | null;
  };
}

export default function UserProfileViewPage({
  profile,
}: UserProfileViewPageProps) {
  const router = useRouter();

  return (
    <div className="w-full">
      <Card className="w-full shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-xl font-semibold">Profil Saya</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/user/profile/biodata/edit")}
            className="gap-1"
          >
            <Pencil className="w-4 h-4" />
            Edit Profil
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm py-6">
          <ProfileRow
            label="Nama"
            value={`${profile.first_name} ${profile.last_name}`}
          />
          <ProfileRow label="Email" value={profile.email} />
          <ProfileRow label="No HP" value={profile.no_hp} />
          <ProfileRow label="Alamat" value={profile.alamat} />
          <ProfileRow
            label="Jenis Kelamin"
            value={
              profile.jenis_kelamin === "L"
                ? "Laki-laki"
                : profile.jenis_kelamin === "P"
                ? "Perempuan"
                : "-"
            }
          />
          <ProfileRow
            label="Tanggal Lahir"
            value={
              profile.tanggal_lahir
                ? format(new Date(profile.tanggal_lahir), "dd MMMM yyyy")
                : "-"
            }
          />
          <ProfileRow label="Tempat Lahir" value={profile.tempat_lahir} />
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="text-base">{value || "-"}</span>
    </div>
  );
}
