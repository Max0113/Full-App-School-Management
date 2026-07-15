"use client";
import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clientaxios } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Page() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const { isAuthenticated, login, SetToken } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = localStorage.getItem("AUTHENTICATED") === "true";
      if (authenticated) {
        setIsLoading(false);
        return;
      }
    };
    verifyAuth();
  }, [isAuthenticated]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (value) => {
    setError("");
    setIsLoading(true);
    await login(value)
      .then((res) => {
        SetToken(res.data.token);
        if (res.status != 404) {
          switch (res.data.user.role) {
            case "student":
              route.refresh();
              route.replace(process.env.NEXT_PUBLIC_DASHBOARD_STUDENT_URL);
              break;
            case "admin":
              route.refresh();
              route.replace(process.env.NEXT_PUBLIC_DASHBOARD_Admin_URL);
              break;
            case "teacher":
              route.refresh();
              route.replace(process.env.NEXT_PUBLIC_DASHBOARD_TEACHER_URL);
              break;
          }
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message);
      });
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[89vh] items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-xl dark:bg-black px-12 py-13">
        <CardHeader className="text-center mb-2">
          <CardTitle className="text-2xl font-extrabold">Login</CardTitle>
          <CardDescription>
            Sign in to continue to your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={"py-6 px-5"}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={"py-6 px-5"}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 px-5 text-[1rem] font-blod dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Or login with
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 px-5"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Login with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 px-5"
            >
              <BsGithub className="mr-2 h-5 w-5" />
              Login with GitHub
            </Button>
          </div>
        </CardContent>

        <p className="text-xs text-gray-500 text-center w-full">
          I agree to abide by templatana's{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and its{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
        </p>
      </Card>
    </div>
  );
}
