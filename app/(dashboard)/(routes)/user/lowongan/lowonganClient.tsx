// /app/user/lowongan/lowonganClient.tsx

"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link"; // For navigation
import { format } from "date-fns";

interface Lowongan {
  id: string;
  posisi: string;
  minimal_pendidikan: string;
  jatuh_tempo: string;
  informasi?: string; // Optional field for additional information
}

interface LowonganClientPageProps {
  lowongan: Lowongan[];
}

export default function LowonganClientPage({
  lowongan,
}: LowonganClientPageProps) {
  return (
    <div>
      {lowongan.length === 0 ? (
        <p>Tidak ada lowongan yang tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowongan.map((job) => (
            <div key={job.id} className="border p-4 rounded-md shadow-lg">
              <h3 className="font-medium text-xl">{job.posisi}</h3>
              <p className="text-sm">
                Minimal Pendidikan: {job.minimal_pendidikan}
              </p>
              <p className="text-sm text-gray-500">
                Tanggal Jatuh Tempo:{" "}
                {format(new Date(job.jatuh_tempo), "dd MMM yyyy")}
              </p>

              <div className="mt-4">
                <Link href={`/user/lowongan/${job.id}`}>
                  <Button variant="outline" size="sm">
                    Lihat Detail
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
