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
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Connect_Rooms } from "@/components/Api/Enseignement";
import { useRouter } from "next/navigation";
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

export function EditSheet({ data, open, onOpenChange, refresh, setrefresh }) {
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

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        capacity: data.capacity ?? "",
        type: data.type || "",
        availability: data.availability ? "Disponible" : "Indisponible",
      });
    }
  }, [data, reset]);

  const onSubmit = async (newdata) => {
    setSubmitting(true);
    setError(false);
    try {
      const payload = {
        ...newdata,
        availability: newdata.availability === "Disponible",
        id: data.id,
      };

      await Connect_Rooms.Updateroom(payload);
      onOpenChange(false);
      toast.success("Salle updated", {
        description: `${newdata.name} has been updated successfully.`,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update salle info.";
      setError(message);
      toast.error("Couldn't update salle", {
        description: message,
      });
    } finally {
      setSubmitting(false);
      route.refresh();
      setrefresh(!refresh);
    }
  };

  if (!data) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto p-0"
      >
        <SheetHeader>
          <SheetTitle>Edit Salle</SheetTitle>
          <SheetDescription>
            Update the salle&apos;s details, then click &quot;Save changes&quot;
            to confirm.
          </SheetDescription>
        </SheetHeader>

        <form
          id="edit-form"
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
              value={watch("type") || ""}
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
              value={watch("availability") || ""}
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
            form="edit-form"
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