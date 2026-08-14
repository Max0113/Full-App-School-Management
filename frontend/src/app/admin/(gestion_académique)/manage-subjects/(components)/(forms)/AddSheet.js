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
import { Connect_Subject } from "@/components/Api/SchoolSetting";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "name is required").max(50),

  specialite_id: z.int().min(1, "Chose a specialite"),

  facture: z.int().min(1, "Chose a facture"),
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
  specialites,
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
      await Connect_Subject.addsubject(data);
      onOpenChange(false);
      toast.success("Matieres created", {
        description: `${data.name} has been added successfully.`,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
      toast.error("Couldn't create matieres", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
      route.refresh();
      setrefresh(!refresh);
    }
  };

  if (!specialites) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Matieres</SheetTitle>
          <SheetDescription>
            Fill in the matieres's details, then click "Create matieres" to add
            them to the system.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="name">Name Matieres</Label>
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
            <Label htmlFor="facture">Facture de matieres</Label>
            <Input
              id="facture"
              type="number"
              placeholder="e.g. 2"
              className="py-5 px-4"
              aria-invalid={!!errors.facture}
              {...register("facture", { valueAsNumber: true })}
            />
            <FieldError message={errors.facture?.message} />
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
              "Create matieres"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
