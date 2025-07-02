"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";

const pendidikanSchema = z.object({
  institusi: z.string().min(1, "Institusi wajib diisi"),
  periode: z.string().min(1, "Periode wajib diisi"),
  jurusan: z.string().min(1, "Jurusan wajib diisi"),
  kualifikasi: z.string().min(1, "Kualifikasi wajib diisi"),
});

type PendidikanFormData = z.infer<typeof pendidikanSchema>;

export default function AddPendidikanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<PendidikanFormData>({
    resolver: zodResolver(pendidikanSchema),
    defaultValues: {
      institusi: "",
      periode: "",
      jurusan: "",
      kualifikasi: "",
    },
  });

  const onSubmit = async (data: PendidikanFormData) => {
    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("User tidak ditemukan");
      return;
    }

    const { error } = await supabase.from("pendidikan").insert({
      user_id: user.id,
      ...data,
    });

    if (error) {
      toast.error("Gagal menambahkan data");
    } else {
      toast.success("Berhasil menambahkan data pendidikan");
      router.push("/user/profile/pendidikan");
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Tambah Riwayat Pendidikan</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="institusi"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institusi</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Institusi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="periode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Periode</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: 2019 - 2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="jurusan"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jurusan</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Teknik Informatika" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="kualifikasi"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kualifikasi</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: S1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
