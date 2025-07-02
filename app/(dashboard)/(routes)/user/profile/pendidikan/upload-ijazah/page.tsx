// /user/profile/pendidikan/upload-ijazah/page.tsx
import UploadIjazahForm from "./UploadIjazahForm";

export default function UploadIjazahPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Ijazah</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Upload ijazah kamu, sistem akan memproses dan mengekstrak data
        pendidikan secara otomatis menggunakan AI.
      </p>
      <UploadIjazahForm />
    </div>
  );
}
