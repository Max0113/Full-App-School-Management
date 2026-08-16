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
import { Connect_Teaching } from "@/components/Api/Enseignement";

const schema = z.object({
  teacher_id: z.int().min(1, "Chose a teacher"),
  subject_id: z.int().min(1, "Chose a subject"),
  classe_id: z.int().min(1, "Chose a classe"),
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
  teachers,
  subjects,
  classes,
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
      await Connect_Teaching.addteaching(data);
      onOpenChange(false);
      toast.success("Enseignements created", {
        description: `has been added successfully.`,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
      toast.error("Couldn't create enseignements", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
      route.refresh();
      setrefresh(!refresh);
    }
  };

  if (!teachers && !subjects && !classes) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Enseignement</SheetTitle>
          <SheetDescription>
            Fill in the enseignement's details, then click "Create enseignement"
            to add them to the system.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="teacher_id">Select Teacher ID</Label>
            <Select
              onValueChange={(val) =>
                setValue("teacher_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="teacher_id" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select Teacher id" />
              </SelectTrigger>
              <SelectContent>
                {teachers?.map((bt) => (
                  <SelectItem key={bt.id} value={bt.id}>
                    {bt.firstname + " " + bt.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.teacher_id?.message} />
          </Field>

          <Field>
            <Label htmlFor="subject_id">Select Subject ID</Label>
            <Select
              onValueChange={(val) =>
                setValue("subject_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="subject_id" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select Subject id" />
              </SelectTrigger>
              <SelectContent>
                {subjects?.map((bt) => (
                  <SelectItem key={bt.id} value={bt.id}>
                    {bt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.subject_id?.message} />
          </Field>

          <Field>
            <Label htmlFor="classe_id">Select Classe ID</Label>
            <Select
              onValueChange={(val) =>
                setValue("classe_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="classe_id" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select Classe id" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map((bt) => (
                  <SelectItem key={bt.id} value={bt.id}>
                    {bt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.classe_id?.message} />
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
              "Create enseignement"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
