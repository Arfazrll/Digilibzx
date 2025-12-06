"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { verifyToken } from "@/common/tokenizer";
import { appInfo, assets } from "@/app/config";
import { loginUser } from "@/lib/api/auth"; // Import fungsi API login

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect user jika token valid
    if (verifyToken()) {
      router.push("/collections");
    }
  }, [router]);

  useEffect(() => {
    // Menampilkan demo toast hanya pada client-side
    toast("Demo Account:", {
      description: (
        <pre className="text-sm whitespace-pre-wrap">
          <code>
            {JSON.stringify({ user: { email: "User@gmail.com", password: "user123" }, }, null, 2)}
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
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoading(true);
    toast.dismiss();
    try {
      // Proses login API
      const response = await loginUser(values.email, values.password);
      console.log(response)
      // Simpan token dan navigasi ke halaman collections
      Cookies.set("authToken", response.token, { expires: 7, secure: true, path: "/" });
      localStorage.setItem("userId", response.id);

      toast.success("Login Successful");
      router.push("/collections");
    } catch (error: any) {
      toast.error(error.message || "Login failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
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
              <CardTitle className="text-2xl">Login</CardTitle>
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
                Don't have an account?{" "}
                <Link href="/register" className="font-medium underline">
                  Register here
                </Link>
              </p>
              <p className="mt-2 text-center text-sm text-gray-600">
                You're admin?{" "}
                <Link href="/login_admin" className="font-medium underline">
                  Login here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
