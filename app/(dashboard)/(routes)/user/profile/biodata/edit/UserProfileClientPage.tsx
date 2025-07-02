"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  no_hp: z.string().optional(),
  alamat: z.string().optional(),
  jenis_kelamin: z.string().optional(),
  tanggal_lahir: z.date().optional(),
  tempat_lahir: z.string().optional(),
});

interface UserProfileClientPageProps {
  profile: {
    id: string;
    role: string;
    first_name: string;
    last_name: string;
    email: string;
    no_hp: string | null;
    alamat: string | null;
    jenis_kelamin: string | null;
    tanggal_lahir: string | null;
    foto_url: string | null;
    updated_at: string;
    tempat_lahir: string | null;
  };
}

export default function UserProfileClientPage({
  profile,
}: UserProfileClientPageProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      no_hp: profile.no_hp ?? "",
      alamat: profile.alamat ?? "",
      jenis_kelamin: profile.jenis_kelamin ?? "",
      tanggal_lahir: profile.tanggal_lahir
        ? new Date(profile.tanggal_lahir)
        : undefined,
      tempat_lahir: profile.tempat_lahir ?? "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
    register,
    watch,
  } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Data sebelum submit: ", data);
    try {
      const supabase = createClient();

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          no_hp: data.no_hp,
          alamat: data.alamat,
          jenis_kelamin: data.jenis_kelamin,
          tanggal_lahir: data.tanggal_lahir,
          tempat_lahir: data.tempat_lahir,
        })
        .eq("id", profile.id);

      if (profileError) {
        console.error("Error updating profile:", profileError.message);
        toast.error("Gagal mengupdate profil.");
        return;
      }
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        },
      });
      if (userError) {
        console.error("Error updating user:", userError.message);
        toast.error("Gagal mengupdate pengguna.");
        return;
      }
      toast.success("Profil berhasil diperbarui!");
      router.push("/user/profile/biodata");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Terjadi kesalahan.");
    }
  };

  return (
    <Card className="max-w-3xl mx-auto p-6 shadow-sm rounded-xl">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <FormField
            name="first_name"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            name="last_name"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* No HP */}
          <FormField
            name="no_hp"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>No HP</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alamat */}
          <FormField
            name="alamat"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Jenis Kelamin */}
          <FormField
            name="jenis_kelamin"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Jenis Kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki</SelectItem>
                    <SelectItem value="P">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tanggal Lahir */}
          <FormField
            name="tanggal_lahir"
            control={control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Lahir</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full max-w-sm justify-start text-left font-normal"
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
                      captionLayout="dropdown"
                      fromYear={1950}
                      toYear={new Date().getFullYear()}
                      selected={field.value}
                      onSelect={field.onChange}
                      className="w-full min-w-[280px]"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tempat Lahir */}
          <FormField
            name="tempat_lahir"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempat Lahir</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full md:w-fit"
          >
            Simpan Perubahan
          </Button>
        </form>
      </Form>
    </Card>
  );
}
