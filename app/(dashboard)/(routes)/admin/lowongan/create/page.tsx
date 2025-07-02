// app/admin/lowongan/create/page.tsx
import ClientForm from "./clientForm";

export default function CreateLowongan() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-foreground mb-4">
        Tambah Lowongan Baru
      </h1>
      <ClientForm />
    </div>
  );
}
