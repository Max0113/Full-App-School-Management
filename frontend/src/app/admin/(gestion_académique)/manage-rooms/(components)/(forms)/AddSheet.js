"use client";
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
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Connect_Rooms } from "@/components/Api/Enseignement";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

const ROOM_TYPES = [
  "Département Normal",
  "Département informatique",
  "Département mathématiques",
  "Département physique",
  "Département chimie",
  "Département biologie",
];

const schema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  capacity: z.coerce.number().int().min(1, "Capacity is required"),
  type: z.string().min(1, "Choose a type"),
  availability: z.enum(["Disponible", "Indisponible"]).default("Disponible"),
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

export function AddSheet({ open, onOpenChange, refresh, setrefresh }) {
  const route = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [Error, setError] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { availability: "Disponible" },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      const payload = {
        ...data,
        availability: data.availability === "Disponible",
      };
      await Connect_Rooms.addroom(payload);
      onOpenChange(false);
      toast.success("Salle created", {
        description: `${payload.name} has been added successfully.`,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
      toast.error("Couldn't create salle", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
      route.refresh();
      setrefresh(!refresh);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Salle</SheetTitle>
          <SheetDescription>
            Fill in the salle&apos;s details, then click &quot;Create salle&quot;
            to add it to the system.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="name">Name Salle</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Salle 1"
              className="py-5 px-4"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </Field>

          <Field>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              placeholder="e.g. 40"
              className="py-5 px-4"
              aria-invalid={!!errors.capacity}
              {...register("capacity")}
            />
            <FieldError message={errors.capacity?.message} />
          </Field>

          <Field>
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={(val) =>
                setValue("type", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="type" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES?.map((bt) => (
                  <SelectItem key={bt} value={bt}>
                    {bt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.type?.message} />
          </Field>

          <Field>
            <Label htmlFor="availability">Availability</Label>
            <Select
              defaultValue="Disponible"
              onValueChange={(val) =>
                setValue("availability", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="availability" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Disponible">Disponible</SelectItem>
                <SelectItem value="Indisponible">Indisponible</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={errors.availability?.message} />
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
            form="add-form"
            disabled={submitting}
            className="min-w-[140px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create salle"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}