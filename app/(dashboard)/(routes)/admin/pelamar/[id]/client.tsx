// app/admin/pelamar/[id]/Client.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, GraduationCap, Mail, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  no_hp: string | null;
  alamat: string | null;
  jenis_kelamin: string | null;
  tanggal_lahir: string | null;
  foto_url: string | null;
  tempat_lahir: string | null;
}

interface Pendidikan {
  id: string;
  institusi: string | null;
  periode: string | null;
  jurusan: string | null;
  kualifikasi: string | null;
}

interface Pengalaman {
  id: string;
  perusahaan: string | null;
  periode: string | null;
  jabatan: string | null;
}

export default function ClientPelamarDetail({
  profile,
  pendidikan,
  pengalaman,
}: {
  profile: Profile;
  pendidikan: Pendidikan[];
  pengalaman: Pengalaman[];
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Data Diri */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Data Diri</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6 items-start">
          {profile.foto_url && (
            <Image
              src={profile.foto_url}
              alt="Foto Pelamar"
              width={120}
              height={120}
              className="rounded-md object-cover border"
            />
          )}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                {profile.first_name} {profile.last_name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{profile.no_hp}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {profile.tempat_lahir}, {profile.tanggal_lahir}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                {profile.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{profile.alamat}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Riwayat Pendidikan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Riwayat Pendidikan</CardTitle>
        </CardHeader>
        <CardContent>
          {pendidikan.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada data pendidikan.
            </p>
          ) : (
            <ul className="space-y-3">
              {pendidikan.map((edu: any) => (
                <li
                  key={edu.id}
                  className="border rounded-lg p-4 text-sm space-y-1"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>{edu.institusi}</span>
                  </div>
                  <p>Jurusan: {edu.jurusan}</p>
                  <p>Kualifikasi: {edu.kualifikasi}</p>
                  <p>Periode: {edu.periode}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Pengalaman Kerja */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Pengalaman Kerja</CardTitle>
        </CardHeader>
        <CardContent>
          {pengalaman.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada data pengalaman kerja.
            </p>
          ) : (
            <ul className="space-y-3">
              {pengalaman.map((exp: any) => (
                <li
                  key={exp.id}
                  className="border rounded-lg p-4 text-sm space-y-1"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>{exp.perusahaan}</span>
                  </div>
                  <p>Jabatan: {exp.jabatan}</p>
                  <p>Periode: {exp.periode}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
