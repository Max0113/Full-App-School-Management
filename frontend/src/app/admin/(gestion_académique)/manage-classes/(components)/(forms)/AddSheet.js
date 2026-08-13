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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Connect_Classe } from "@/components/Api/SchoolSetting";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export function AddSheet({
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      await Connect_Classe.addclasse(data);
      onOpenChange(false);
      toast.success("Classe created", {
        description: `${data.name} has been added successfully.`,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
      toast.error("Couldn't create classe", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
      route.refresh();
      setrefresh(!refresh);
    }
  };

  if (!levels && !specialites && !school_years) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Classe</SheetTitle>
          <SheetDescription>
            Fill in the classe's details, then click "Create classe" to add them
            to the system.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-form"
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
              "Create classe"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
