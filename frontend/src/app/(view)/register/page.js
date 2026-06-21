"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";

// Zod Schema
const schema = z
  .object({
    email: z.string().email("Email invalid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Valid data:", data);
  };

  return (
    <div className="text-gray-900 flex justify-center">
      <div className="max-w-200 m-10 bg-white shadow sm:rounded-2xl flex justify-center flex-1">
        <div className="w-100 p-2">
          <div className="mt-12 mb-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Sign up
            </h1>

            <div className="w-full flex-1 mt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg">

                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="w-full px-8 py-4 rounded-lg bg-gray-100 mt-3"
                />
                <p className="text-red-500">{errors.email?.message}</p>

                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="w-full px-8 py-4 rounded-lg bg-gray-100 mt-5"
                />
                <p className="text-red-500">{errors.password?.message}</p>

                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Check Password"
                  className="w-full px-8 py-4 rounded-lg bg-gray-100 mt-5"
                />
                <p className="text-red-500">
                  {errors.confirmPassword?.message}
                </p>

                <button
                  type="submit"
                  className="mt-5 w-full bg-indigo-500 text-white py-4 rounded-lg"
                >
                  Sign Up
                </button>
              </form>

              {/* Social buttons (unchanged) */}
              <div className="mt-10 flex flex-col items-center">
                <button className="w-full max-w-lg bg-indigo-100 py-3 rounded-lg flex items-center justify-center">
                  <FcGoogle />
                  <span className="ml-4">Sign Up with Google</span>
                </button>

                <button className="w-full max-w-lg bg-indigo-100 py-3 rounded-lg flex items-center justify-center mt-5">
                  <BsGithub />
                  <span className="ml-4">Sign Up with GitHub</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}