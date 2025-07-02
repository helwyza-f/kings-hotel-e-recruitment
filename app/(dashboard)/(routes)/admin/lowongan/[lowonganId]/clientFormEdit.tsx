"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { convertDateToLocalISOString } from "@/lib/utils/convertDateToLocalISOString"; // ✅ helper

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const formSchema = z.object({
  posisi: z.string().min(1, { message: "Posisi diperlukan" }),
  minimal_pendidikan: z
    .string()
    .min(1, { message: "Minimal pendidikan diperlukan" }),
  jatuh_tempo: z.date().refine((val) => val > new Date(), {
    message: "Tanggal jatuh tempo harus lebih besar dari sekarang",
  }),
  informasi: z.string().optional(),
});

interface ClientFormEditProps {
  lowongan: {
    id: string;
    posisi: string;
    minimal_pendidikan: string;
    jatuh_tempo: string;
    informasi: string;
  };
}

const ClientFormEdit = ({ lowongan }: ClientFormEditProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      posisi: lowongan.posisi,
      minimal_pendidikan: lowongan.minimal_pendidikan,
      jatuh_tempo: new Date(lowongan.jatuh_tempo),
      informasi: lowongan.informasi || "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = form;

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("lowongan")
        .update({
          posisi: data.posisi,
          minimal_pendidikan: data.minimal_pendidikan,
          jatuh_tempo: convertDateToLocalISOString(data.jatuh_tempo), // ✅ pakai helper untuk format
          informasi: data.informasi,
        })
        .eq("id", lowongan.id);

      if (error) {
        console.error("Error updating data:", error.message);
        return;
      }

      toast.success("Lowongan berhasil diperbarui!");
      router.push("/admin/lowongan");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-full px-4 py-6 md:px-6 lg:px-8 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
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
                      className="bg-background text-foreground min-h-[200px]"
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
              disabled={isSubmitting || !isValid}
              type="submit"
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

export default ClientFormEdit;
