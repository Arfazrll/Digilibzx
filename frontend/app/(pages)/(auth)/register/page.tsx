"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { Loader2 } from 'lucide-react'
import Navbar from "@/components/navbar-user"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { verifyToken } from "@/common/tokenizer"
import { appInfo, assets } from "@/app/config"
// Import API functions
import { registerStudent, registerLecturer } from "@/lib/api/users"

const studentFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  nim: z.string().min(5, { message: "NIM must be at least 5 characters." }),
  year: z.string().min(4, { message: "Year must be a valid year." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

const lecturerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  nip: z.string().min(5, { message: "NIP must be at least 5 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (verifyToken()) {
      router.push("/collections")
    }
  }, [router]);

  const studentForm = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      nim: "",
      year: "",
      phone: "",
      email: "",
      password: "",
    },
  })

  const lecturerForm = useForm<z.infer<typeof lecturerFormSchema>>({
    resolver: zodResolver(lecturerFormSchema),
    defaultValues: {
      name: "",
      nip: "",
      phone: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(
    values: z.infer<typeof studentFormSchema> | z.infer<typeof lecturerFormSchema>
  ) {
    setIsLoading(true);
  
    try {
      if ('nim' in values && 'year' in values) {
        // Memastikan ini adalah mahasiswa
        await registerStudent({ ...values, role: "student" }); // Sesuaikan tipe data untuk fungsi ini
      } else if ('nip' in values) {
        // Memastikan ini adalah dosen
        await registerLecturer({ ...values, role: "lecturer" }); // Sesuaikan tipe data untuk fungsi ini
      } else {
        throw new Error('Invalid user role');
      }
      
      router.push("/login")

      setIsLoading(false);
      toast.success("Registration Successful");
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message || 'Something went wrong');
    }
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-2 p-4">
        {/* Logo Section */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-end lg:justify-center text-center">
          <Link href="/" className="flex flex-col items-center gap-2">
            <img
              src={assets.logoUrl}
              className="w-12 lg:w-16"
              alt="logo"
            />
            <span className="text-2xl lg:text-3xl font-bold uppercase">{appInfo.appName}</span>
          </Link>
        </div>

        {/* Card Section */}
        <div className="lg:col-span-8 flex items-center justify-center">
          <Card className="w-full max-w-xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Choose your role and fill in your details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="student" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="lecturer">Lecturer</TabsTrigger>
                </TabsList>
                <TabsContent value="student">
                  <Form {...studentForm}>
                    <form onSubmit={studentForm.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-3">
                        <FormField
                          control={studentForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={studentForm.control}
                          name="nim"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>NIM</FormLabel>
                              <FormControl>
                                <Input placeholder="12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={studentForm.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year</FormLabel>
                              <FormControl>
                                <Input placeholder="2023" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <FormField
                          control={studentForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="081234567890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={studentForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="johndoe@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <FormField
                          control={studentForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          "Register as Student"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="lecturer">
                  <Form {...lecturerForm}>
                    <form onSubmit={lecturerForm.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-3">
                        <FormField
                          control={lecturerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Dr. Jane Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <FormField
                          control={lecturerForm.control}
                          name="nip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>NIP</FormLabel>
                              <FormControl>
                                <Input placeholder="12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={lecturerForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="081234567890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <FormField
                          control={lecturerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="janesmith@university.edu" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={lecturerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          "Register as Lecturer"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium underline">
                  Log in here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
