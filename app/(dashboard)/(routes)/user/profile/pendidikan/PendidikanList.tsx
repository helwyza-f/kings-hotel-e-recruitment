"use client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash } from "lucide-react"; // Import Trash icon
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // Supabase client for deletion

type Pendidikan = {
  id: string;
  institusi: string;
  jurusan: string;
  kualifikasi: string;
  periode: string;
};

export default function PendidikanList({
  pendidikan,
}: {
  pendidikan: Pendidikan[];
}) {
  const router = useRouter();

  const deletePendidikan = async (id: string) => {
    const supabase = createClient();

    try {
      const { error } = await supabase.from("pendidikan").delete().eq("id", id); // Delete the education entry based on its ID

      if (error) {
        console.error("Error deleting pendidikan:", error.message);
      } else {
        // Optionally, you can refetch the data or update the UI state
        toast.success("Pendidikan berhasil dihapus");
        // Reload the page or trigger any necessary UI update
        router.refresh();
      }
    } catch (error) {
      console.error("Error during delete:", error);
      toast.error("Failed to delete pendidikan.");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        Untuk menambahkan data pendidikan, silakan unggah ijazah kamu.
      </p>
      <Button
        onClick={() => router.push("/user/profile/pendidikan/upload-ijazah")}
        className="flex items-center gap-2"
      >
        <PlusCircle className="w-4 h-4" />
        Upload Ijazah
      </Button>

      {pendidikan.length === 0 ? (
        <p className="text-muted-foreground">Belum ada data pendidikan.</p>
      ) : (
        pendidikan.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader>
              <CardTitle className="text-lg">{item.institusi}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>
                <span className="font-medium">Periode:</span> {item.periode}
              </p>
              <p>
                <span className="font-medium">Jurusan:</span> {item.jurusan}
              </p>
              <p>
                <span className="font-medium">Kualifikasi:</span>{" "}
                {item.kualifikasi}
              </p>
            </CardContent>

            {/* Delete button with Trash icon */}
            <Button
              onClick={() => deletePendidikan(item.id)}
              variant="destructive"
              className="absolute top-2 right-2 p-1"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}
