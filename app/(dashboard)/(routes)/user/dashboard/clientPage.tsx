"use client";

import { Button } from "@/components/ui/button"; // Button component
import Link from "next/link"; // For navigation
import { format } from "date-fns";

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
    <div>
      <h2 className="font-medium text-lg">Lowongan Terbaru</h2>
      {lowongan.length === 0 ? (
        <p>Tidak ada lowongan yang tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tampilkan 5 lowongan terbaru */}
          {lowongan.slice(0, 5).map((job) => (
            <div key={job.id} className="border p-4 rounded-lg shadow-lg">
              <h3 className="font-medium text-lg">{job.posisi}</h3>
              <p>Minimal Pendidikan: {job.minimal_pendidikan}</p>
              <p>
                Tanggal Jatuh Tempo:{" "}
                {format(new Date(job.jatuh_tempo), "dd MMM yyyy")}
              </p>

              <Link href={`/user/lowongan/${job.id}`}>
                <Button variant="outline" size="sm" className="mt-4">
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
