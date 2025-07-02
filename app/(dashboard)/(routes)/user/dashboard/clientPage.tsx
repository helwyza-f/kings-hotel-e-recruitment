"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Briefcase, GraduationCap, Hourglass } from "lucide-react";

interface Lowongan {
  id: string;
  posisi: string;
  minimal_pendidikan: string;
  jatuh_tempo: string;
}

interface UserDashboardClientPageProps {
  lowongan: Lowongan[];
}

export default function UserDashboardClientPage({
  lowongan,
}: UserDashboardClientPageProps) {
  return (
    <div className="space-y-6 ">
      <h2 className="text-xl font-semibold tracking-tight">Lowongan Terbaru</h2>

      {lowongan.length === 0 ? (
        <p className="text-muted-foreground">
          Tidak ada lowongan yang tersedia.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lowongan.slice(0, 5).map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border bg-white dark:bg-card p-5 shadow transition hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {job.posisi}
              </h3>

              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Min. Pendidikan: {job.minimal_pendidikan}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hourglass className="w-4 h-4" />
                  <span>
                    Jatuh Tempo:{" "}
                    {format(new Date(job.jatuh_tempo), "dd MMM yyyy")}
                  </span>
                </div>
              </div>

              <Link href={`/user/lowongan/${job.id}`}>
                <Button size="sm" variant="outline" className="mt-4 w-full">
                  Lihat Detail
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
