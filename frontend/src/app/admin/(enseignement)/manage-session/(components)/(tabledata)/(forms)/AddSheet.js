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
import { Connect_Sessions } from "@/components/Api/Enseignement";

const schema = z.object({
  start_time: z.coerce.date() , 
  end_time : z.coerce.date(),
  teaching_id: z.int().min(1, "Chose a teacher"),
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

const formatForApi = (datetimeLocal) => datetimeLocal + ":00Z";

export function AddSheet({
  open,
  onOpenChange,
  refresh,
  setrefresh,
  teaching
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
      await Connect_Sessions.addsessions({
        ...data,
        start_time: formatForApi(data.start_time),
        end_time: formatForApi(data.end_time),
      });
      onOpenChange(false);
      toast.success("Seance created", {
        description: `has been added successfully.`,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
      toast.error("Couldn't create seances", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
      route.refresh();
      setrefresh(!refresh);
    }
  };

  if (!teaching) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Seance</SheetTitle>
          <SheetDescription>
            Fill in the seance's details, then click "Create seance"
            to add them to the system.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          

           <Field className="flex-1">
            <Label htmlFor="start_time">Start Time</Label>
            <Input
                id="start_time"
                type="datetime-local"
                className="py-5 px-4"
                aria-invalid={!!errors.start_time}
                {...register("start_time")}
              />
              <FieldError message={errors.start_time?.message} />
            </Field>

            <Field className="flex-1">
            <Label htmlFor="end_time">End Time</Label>
            <Input
                id="end_time"
                type="datetime-local"
                className="py-5 px-4"
                aria-invalid={!!errors.end_time}
                {...register("end_time")}
              />
              <FieldError message={errors.end_time?.message} />
            </Field>

          <Field>
            <Label htmlFor="teaching_id">Select Teaching ID</Label>
            <Select
              onValueChange={(val) =>
                setValue("teaching_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="teaching_id" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select Teacher id" />
              </SelectTrigger>
              <SelectContent>
                {teaching?.map((bt) => (
                  <SelectItem key={bt.id} value={bt.id}>
                    {bt.teachers_firstname + " / " +  bt.classes_name + " / " + bt.subjects_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.teaching_id?.message} />
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
              "Create seance"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
