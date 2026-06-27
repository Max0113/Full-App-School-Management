"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { useAuth } from "@/components/Context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Zod Schema
const schema = z
  .object({
    name: z.string(),
    email: z.string().email("Email invalid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Page() {

  const [error, setError] = useState("");  
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const { Register } = useAuth();

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
    await Register(value).then((res) => {
       if(res.status == 204){
         console.log("Valid data:", res.data);
         route.push('/dashboard')
       }
    }).catch((err) => {
      console.error("Valid data:", err);
      setError(err.response?.data?.message);
    })
    setIsLoading(false);
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
                  {...register("name")}
                  type="text"
                  placeholder="Name"
                  className="w-full px-8 py-4 rounded-lg bg-gray-100 mt-3"
                />
                <p className="text-red-500">{errors.name?.message}</p>

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
                  {...register("password_confirmation")}
                  type="password"
                  placeholder="Check Password"
                  className="w-full px-8 py-4 rounded-lg bg-gray-100 mt-5"
                />
                <p className="text-red-500">
                  {errors.password_confirmation?.message}
                </p>

                <button
                    type='submit'
                    disabled={isLoading}
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none disabled:opacity-50">
                    <span className="ml-3">
                        {isLoading ? "Logging in..." : "Sign in"}
                    </span>
                </button>
              </form>

              {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center max-w-lg mx-auto">
                                {error}
                            </div>
                        )}

              <div className="my-10 border-b text-center">
                            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                Or login with e-mail
                            </div>
                        </div>

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