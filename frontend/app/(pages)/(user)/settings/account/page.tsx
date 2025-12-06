"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { fetchUserById, updateUserById } from "@/lib/api/users";
import LoadingComponent from "@/components/loading";

// Schema validasi menggunakan zod
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  role: z.enum(["admin", "student", "lecturer"]),
  nim: z.string().optional(),
  nip: z.string().optional(),
  year: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "student",
      nim: "",
      nip: "",
      year: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID tidak ditemukan");

        setIsLoading(true);
        const userData = await fetchUserById(userId);

        form.reset({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          nim: userData.nim || "",
          nip: userData.nip || "",
          year: userData.year || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Gagal memuat data pengguna");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID tidak ditemukan");
  
      setIsLoading(true);
  
      // Pastikan properti opsional memiliki nilai string kosong jika undefined
      const sanitizedData = {
        ...data,
        phone: data.phone || "",
        nim: data.nim || "",
        nip: data.nip || "",
        year: data.year || "",
      };
  
      // Panggil API untuk memperbarui user
      const updatedUser = await updateUserById(userId, sanitizedData);
  
      console.log("Profil berhasil diperbarui:", updatedUser);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  const role = form.watch("role");

  if (isLoading) {
    return <LoadingComponent/>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input disabled value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {role === "student" && (
            <FormField
              control={form.control}
              name="nim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIM</FormLabel>
                  <FormControl>
                    <Input placeholder="Your NIM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {role === "lecturer" && (
            <FormField
              control={form.control}
              name="nip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIP</FormLabel>
                  <FormControl>
                    <Input placeholder="Your NIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {role === "student" && (
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input placeholder="Year of entry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Separator />
          <Button type="submit">Update profile</Button>
        </form>
      </Form>
    </div>
  );
}