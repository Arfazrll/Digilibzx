"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"
import NavbarAdmin from "@/components/navbar-admin"
import { verifyToken } from "@/common/tokenizer"
import { appInfo, assets } from "@/app/config"
import { loginUserAdmin } from "@/lib/api/auth"

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (verifyToken()) {
      router.push("/admin")
    }
  }, [router]);

  useEffect(() => {
    toast("Demo Account:", {
      description: (
        <pre className="text-sm whitespace-pre-wrap">
          <code>
            {JSON.stringify({ email: "admin@admin.com", password: "admin123" }, null, 2)}
          </code>
        </pre>
      ),
      duration: Infinity,
      position: "bottom-right",
      dismissible: true,
      closeButton: true
    });
  }, []);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoading(true);
    toast.dismiss();
    try {
      // Proses login API
      const response = await loginUserAdmin(values.email, values.password);

      // Simpan token dan navigasi ke halaman collections
      Cookies.set("authToken", response.token, { expires: 7, secure: true, path: "/" });
      localStorage.setItem("userId", response.id);

      toast.success("Login Successful");
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.message || "Login failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* <NavbarAdmin/> */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mx-auto max-w-sm flex flex-col items-center justify-center mb-10">
            <Link href="/" className="flex flex-col items-center gap-2">
              <img
                src={assets.logoUrl}
                className="w-8"
                alt="logo"
              />
              <span className="text-xl font-bold uppercase">{appInfo.appName}</span>
            </Link>
          </div>
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Login as Admin</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log in"
                    )}
                  </Button>
                </form>
              </Form>
              <p className="mt-6 text-center text-sm text-gray-600">
                Login with user account?{" "}
                <Link href="/login" className="font-medium underline">
                  Login here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

