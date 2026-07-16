"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Connect_Parents } from "@/components/Api/Connect";

const schema = z.object({
  firstname: z.string().min(1, "First name is required").max(50),
  lastname: z.string().min(1, "Last name is required").max(50),

  date_of_birth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),

  gender: z.enum(["m", "f"], {
    errorMap: () => ({ message: "Select a valid gender" }),
  }),

  blood_type: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    errorMap: () => ({ message: "Select a valid blood type" }),
  }),

  address: z.string().min(1, "Address is required").max(200),

  phone: z.string().regex(/^\+?[0-9]{8,15}$/, "Enter a valid phone number"),

  email: z.string().email("Invalid email"),
});

function Addparents() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await Connect_Parents.addparents(data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="firstname">Firstname</Label>
        <Input
          id="firstname"
          type="text"
          placeholder="Enter firstname"
          className="py-6 px-5"
          {...register("firstname")}
        />
        {errors.firstname && (
          <p className="text-red-500 text-xs mt-1">
            {errors.firstname.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastname">Lastname</Label>
        <Input
          id="lastname"
          type="text"
          placeholder="Enter lastname"
          className="py-6 px-5"
          {...register("lastname")}
        />
        {errors.lastname && (
          <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date_of_birth">Date of birth</Label>
        <Input
          id="date_of_birth"
          type="date"
          className="py-6 px-5"
          {...register("date_of_birth")}
        />
        {errors.date_of_birth && (
          <p className="text-red-500 text-xs mt-1">
            {errors.date_of_birth.message}
          </p>
        )}
      </div>
      <div className="flex gap-3 w-full">
        <div className="flex-1 space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            onValueChange={(val) =>
              setValue("gender", val, { shouldValidate: true })
            }
          >
            <SelectTrigger id="gender" className="py-6 px-5 w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="m">Male</SelectItem>
              <SelectItem value="f">Female</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="blood_type">Blood type</Label>
          <Select
            onValueChange={(val) =>
              setValue("blood_type", val, { shouldValidate: true })
            }
          >
            <SelectTrigger id="blood_type" className="py-6 px-5 w-full">
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => (
                <SelectItem key={bt} value={bt}>
                  {bt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.blood_type && (
            <p className="text-red-500 text-xs mt-1">
              {errors.blood_type.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          placeholder="Enter address"
          className="py-6 px-5"
          {...register("address")}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          className="py-6 px-5"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="py-6 px-5"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-md bg-black text-white font-medium hover:bg-white hover:text-black transition-all duration-300"
      >
        Submit
      </button>
    </form>
  );
}

export default Addparents;
