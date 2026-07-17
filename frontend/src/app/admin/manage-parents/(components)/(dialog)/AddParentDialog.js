"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Connect_Parents } from "@/components/Api/Connect";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { BsCheckCircleFill } from "react-icons/bs";

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

export function AddParentDialog({ open, onOpenChange, refresh }) {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState(false);
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
    setIsLoading(true);
    try {
      const res = await Connect_Parents.addparents(data);
      console.log(res.data);
      onOpenChange(false);
    } catch (error) {
      console.error(error?.response?.data?.message);
      setError(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
      route.refresh();
      refresh(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add parent info</DialogTitle>
          <DialogDescription>
            Make new parent, then click "create" to confirm.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-parent-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex gap-4">
              <Field className="flex-1">
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
              </Field>
              <Field className="flex-1">
                <Label htmlFor="lastname">Lastname</Label>
                <Input
                  id="lastname"
                  type="text"
                  placeholder="Enter lastname"
                  className="py-6 px-5"
                  {...register("lastname")}
                />
                {errors.lastname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastname.message}
                  </p>
                )}
              </Field>
            </div>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="py-6 px-5"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </Field>
            <div className="flex gap-4">
              <Field className={"flex-1"}>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter address"
                  className="py-6 px-5"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message}
                  </p>
                )}
              </Field>
              <Field className={"flex-1"}>
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
              </Field>
            </div>
            <div className="flex gap-4">
              <Field className="flex-1">
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </Field>

              <Field className="flex-1">
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
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bt) => (
                        <SelectItem key={bt} value={bt}>
                          {bt}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                {errors.blood_type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.blood_type.message}
                  </p>
                )}
              </Field>
            </div>

            <Field>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                className="py-6 px-5"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </Field>
          </FieldGroup>

          {Error && (
            <div className=" text-red-700 px-4 py-3 rounded-lg text-sm text-center">
              {Error}
            </div>
          )}

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              type="submit"
              form="edit-parent-form"
              variant="outline"
              onClick={() =>
                toast("Event has been created", {
                  description: "Sunday, December 03, 2023 at 9:00 AM",
                  icon: (
                    <BsCheckCircleFill className="h-4 w-4 text-green-500" />
                  ),
                })
              }
            >
              {!isLoading ? "Create parent" : "Loading..."}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
