"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

// Password is optional on edit: only validated if the user actually types one
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

  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
});

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

export function EditParentDialog({
  parent,
  open,
  onOpenChange,
  refresh,
  setrefresh,
}) {
  const route = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [Error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Prefill the form whenever the parent being edited changes.
  // This replaces the old formData/handleChange state entirely —
  // react-hook-form is now the single source of truth for these fields.
  useEffect(() => {
    if (parent) {
      reset({
        firstname: parent.firstname || "",
        lastname: parent.lastname || "",
        date_of_birth: parent.date_of_birth || "",
        gender: parent.gender || "",
        blood_type: parent.blood_type || "",
        address: parent.address || "",
        phone: parent.phone || "",
        email: parent.email || "",
        password: "", // never prefill the real password
      });
    }
  }, [parent, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      const payload = { ...data, id: parent.id };
      if (!payload.password) delete payload.password;

      await Connect_Parents.Updateparents(payload);
      onOpenChange(false);
      toast.success("Student updated", {
        description: `${data.firstname} ${data.lastname} has been updated successfully.`,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update parent info.";
      setError(message);
      toast.error("Couldn't update student", {
        description: message,
      });
    } finally {
      setSubmitting(false);
      route.refresh();
      setrefresh(!refresh);
    }
  };

  if (!parent) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto p-0"
      >
        <SheetHeader>
          <SheetTitle>Edit student</SheetTitle>
          <SheetDescription>
            Update the student's details, then click "Save changes" to confirm.
          </SheetDescription>
        </SheetHeader>

        <form
          id="edit-parent-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <div className="flex gap-4">
            <Field className="flex-1">
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                type="text"
                placeholder="e.g. Youness"
                className="py-5 px-4"
                aria-invalid={!!errors.firstname}
                {...register("firstname")}
              />
              <FieldError message={errors.firstname?.message} />
            </Field>
            <Field className="flex-1">
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                type="text"
                placeholder="e.g. Amzil"
                className="py-5 px-4"
                aria-invalid={!!errors.lastname}
                {...register("lastname")}
              />
              <FieldError message={errors.lastname?.message} />
            </Field>
          </div>

          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="py-5 px-4"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </Field>

          <Field>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Leave blank to keep current password"
              className="py-5 px-4"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldError message={errors.password?.message} />
          </Field>

          <div className="flex gap-4">
            <Field className="flex-1">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={watch("gender") || ""}
                onValueChange={(val) =>
                  setValue("gender", val, { shouldValidate: true })
                }
              >
                <SelectTrigger id="gender" className="py-5 px-4 w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m">Male</SelectItem>
                  <SelectItem value="f">Female</SelectItem>
                </SelectContent>
              </Select>
              <FieldError message={errors.gender?.message} />
            </Field>
            <Field className={"flex-1"}>
              <Label htmlFor="blood_type">Blood type</Label>
              <Select
                value={watch("blood_type") || ""}
                onValueChange={(val) =>
                  setValue("blood_type", val, { shouldValidate: true })
                }
              >
                <SelectTrigger id="blood_type" className="py-5 px-4 w-full">
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
              <FieldError message={errors.blood_type?.message} />
            </Field>
          </div>

          <div className="flex gap-4">
            <Field className="flex-1">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Street, city"
                className="py-5 px-4"
                aria-invalid={!!errors.address}
                {...register("address")}
              />
              <FieldError message={errors.address?.message} />
            </Field>
            <Field className="flex-1">
              <Label htmlFor="date_of_birth">Date of birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                className="py-5 px-4"
                aria-invalid={!!errors.date_of_birth}
                {...register("date_of_birth")}
              />
              <FieldError message={errors.date_of_birth?.message} />
            </Field>
          </div>

          <Field>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              className="py-5 px-4"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
            <FieldError message={errors.phone?.message} />
          </Field>

          {Error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{Error}</span>
            </div>
          )}
        </form>

        <SheetFooter className="flex flex-row justify-end gap-2 px-4">
          <SheetClose
            render={
              <Button variant="outline" disabled={submitting}>
                Cancel
              </Button>
            }
          />
          <Button
            type="submit"
            form="edit-parent-form"
            disabled={submitting}
            className="min-w-[140px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
