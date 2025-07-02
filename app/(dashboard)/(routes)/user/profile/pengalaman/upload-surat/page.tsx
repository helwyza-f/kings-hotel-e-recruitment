import { createClient } from "@/lib/supabase/server";
import UploadSuratPengalamanForm from "./uploadSuratPengalamanForm";

export default async function UploadSuratPengalamanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="text-center py-4 text-red-500">Kamu harus login</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Upload Surat Pengalaman</h1>
      <p className="text-sm text-muted-foreground">
        Kami akan membaca data dari surat pengalaman kerjamu.
      </p>
      <UploadSuratPengalamanForm />
    </div>
  );
}
