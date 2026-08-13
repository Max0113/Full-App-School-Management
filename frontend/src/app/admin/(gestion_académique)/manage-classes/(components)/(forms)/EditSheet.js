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
import { Connect_Classe } from "@/components/Api/SchoolSetting";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "name is required").max(50),
  level_id: z.int().min(1, "Chose a level"),

  specialite_id: z.int().min(1, "Chose a specialite"),

  school_year_id: z.int().min(1, "Chose a school year"),
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

export function EditSheet({
  data,
  open,
  onOpenChange,
  refresh,
  setrefresh,
  levels,
  specialites,
  school_years,
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

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        level_id: data.level_id || "",
        specialite_id: data.specialite_id || "",
        school_year_id: data.school_year_id || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (newdata) => {
    setSubmitting(true);
    setError(false);
    try {
      const payload = { ...newdata, id: data.id };
      if (!payload.password) delete payload.password;

      await Connect_Classe.Updateclasse(payload);
      onOpenChange(false);
      toast.success("Classe updated", {
        description: `${newdata.name} has been updated successfully.`,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update classe info.";
      setError(message);
      toast.error("Couldn't update classe", {
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
          <SheetTitle>Edit classe</SheetTitle>
          <SheetDescription>
            Update the classe's details, then click "Save changes" to confirm.
          </SheetDescription>
        </SheetHeader>

        <form
          id="edit-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="firstname">Name Classe</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Bac-1 Pc"
              className="py-5 px-4"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </Field>

          <Field>
            <Label htmlFor="level_id">Select Level ID</Label>
            <Select
              value={watch("level_id") || ""}
              onValueChange={(val) =>
                setValue("level_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="level_id" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select level id" />
              </SelectTrigger>
              <SelectContent>
                {levels?.map((bt) => (
                  <SelectItem key={bt.id} value={bt.id}>
                    {bt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.level_id?.message} />
          </Field>

          <Field>
            <Label htmlFor="specialite_id">Select Specialite ID</Label>
            <Select
              value={watch("specialite_id") || ""}
              onValueChange={(val) =>
                setValue("specialite_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="specialite_id" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select Specialite id" />
              </SelectTrigger>
              <SelectContent>
                {specialites?.map((bt) => (
                  <SelectItem key={bt.id} value={bt.id}>
                    {bt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.specialite_id?.message} />
          </Field>

          <Field>
            <Label htmlFor="school_year_id">Select School Year ID</Label>
            <Select
              value={watch("school_year_id") || ""}
              onValueChange={(val) =>
                setValue("school_year_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="school_year_id" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select school year id" />
              </SelectTrigger>
              <SelectContent>
                {school_years?.map((bt) => (
                  <SelectItem key={bt.id} value={bt.id}>
                    {bt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.school_year_id?.message} />
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
