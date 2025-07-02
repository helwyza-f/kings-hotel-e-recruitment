"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import dynamic from "next/dynamic";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="text-muted-foreground">Memuat editor...</div>,
});
import "react-quill-new/dist/quill.snow.css";

const formSchema = z.object({
  posisi: z.string().min(1, { message: "Posisi diperlukan" }),
  minimal_pendidikan: z
    .string()
    .min(1, { message: "Minimal pendidikan diperlukan" }),
  jatuh_tempo: z.date().refine((val) => val > new Date(), {
    message: "Tanggal jatuh tempo harus lebih besar dari hari ini",
  }),
  informasi: z.string().optional(),
});

const ClientForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      posisi: "",
      minimal_pendidikan: "",
      jatuh_tempo: new Date(),
      informasi: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    setValue,
  } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Data sebelum submit: ", data.jatuh_tempo);

    try {
      const supabase = createClient();

      // Ensure the date is converted to the proper ISO string before sending
      const formattedDate = new Date(data.jatuh_tempo).toISOString();

      const { data: lowonganData, error: lowonganError } = await supabase
        .from("lowongan")
        .insert([
          {
            posisi: data.posisi,
            minimal_pendidikan: data.minimal_pendidikan,
            jatuh_tempo: formattedDate, // Use formatted date
            informasi: data.informasi,
          },
        ])
        .select();

      if (lowonganError || !lowonganData || lowonganData.length === 0) {
        throw lowonganError || new Error("Gagal membuat lowongan");
      }

      const { error: examError } = await supabase.from("exams").insert([
        {
          lowongan_id: lowonganData[0].id,
          title: `Exam untuk ${data.posisi}`,
          description: `Ujian seleksi untuk posisi ${data.posisi}`,
        },
      ]);

      if (examError) throw examError;

      toast.success("Lowongan dan exam berhasil dibuat!");
      router.push("/admin/lowongan");
    } catch (error) {
      console.error("Error submit:", error);
      toast.error("Gagal membuat lowongan");
    }
  };

  return (
    <div className="w-full px-4 py-6 md:px-6 lg:px-8 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col min-h-screen"
        >
          <FormField
            name="posisi"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posisi</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Software Engineer"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="minimal_pendidikan"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimal Pendidikan</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. S1"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="jatuh_tempo"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jatuh Tempo</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "dd MMMM yyyy")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) =>
                          date && setValue("jatuh_tempo", date)
                        }
                        className="w-full min-w-[280px]"
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="informasi"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kualifikasi & Deskripsi</FormLabel>
                <FormControl>
                  <div className="min-h-[200px]">
                    <ReactQuill
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="bg-background text-foreground"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sticky Save Button */}
          <div className="sticky bottom-0 bg-background py-4 z-10 border-t mt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full md:w-fit"
            >
              Simpan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ClientForm;
