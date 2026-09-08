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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Connect_Sessions } from "@/components/Api/Enseignement";

const schema = z.object({
  day: z.string().min(1, "Chose a day"),
  start_time: z.string(),
  end_time: z.string(),
  teaching_subject_classe_id: z.int().min(1, "Chose a teacher"),
  room_id: z.coerce.number().int().min(1, "Chose a room"),
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
  teaching,
  rooms = [],
  selectedClasse,
  onRefresh,
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
        day: data.day || "",
        start_time: data.start_time || "",
        end_time: data.end_time || "",
        teaching_subject_classe_id: data.teaching_subject_classe_id || "",
        room_id: data.room_id || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (newdata) => {
    console.log("Form data:", newdata);
    setSubmitting(true);
    setError(false);
    try {
      const payload = { ...newdata, id: data.id };
      if (!payload.password) delete payload.password;

      await Connect_Sessions.Updatesessions(payload);
      onOpenChange(false);
      toast.success("Seance updated", {
        description: `has been updated successfully.`,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update seance info.";
      setError(message);
      toast.error("Couldn't update seance", {
        description: "Failed to update seance info.",
      });
    } finally {
      setSubmitting(false);
      route.refresh();
      if (onRefresh) onRefresh();
    }
  };

 function isoToDatetimeLocal(isoString) {
  if (!isoString) return "";
  if (isoString.length === 8) {
    return `${isoString}`;
  }
  return (
    `${isoString}:00`
  );
}

  if (!data) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto p-0"
      >
        <SheetHeader>
          <SheetTitle>Edit Seances</SheetTitle>
          <SheetDescription>
            Update the seance&apos;s details, then click &quot;Save changes&quot;
            to confirm.
          </SheetDescription>
        </SheetHeader>

        <form
          id="edit-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >

          <Field>
            <Label htmlFor="day">Select Jour</Label>
            <Select
              value={watch("day") || ""}
              onValueChange={(val) =>
                setValue("day", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="day" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select Jour" />
              </SelectTrigger>
              <SelectContent>
                {["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]?.map((bt) => (
                  <SelectItem key={bt} value={bt}>
                    {bt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.day?.message} />
          </Field>

          <Field>
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              type="time"
              className="py-5 px-4"
              aria-invalid={!!errors.start_time}
              {...register("start_time", {
                setValueAs: (value) =>
                  value ?  isoToDatetimeLocal(value) : value,
              })}
            />
            <FieldError message={errors.start_time?.message} />
          </Field>

            <Field>
            <Label htmlFor="end_time">End Time</Label>
            <Input
                id="end_time"
                type="time"
                className="py-5 px-4"
                aria-invalid={!!errors.end_time}
                {...register("end_time", {
                  setValueAs: (value) =>
                    value ?  isoToDatetimeLocal(value) : value, // returns STRING
                })}
              />
              <FieldError message={errors.end_time?.message} />
            </Field>

          <Field>
            <Label htmlFor="teaching_subject_classe_id">Select Teaching ID</Label>
            <Select
              value={watch("teaching_subject_classe_id") || ""}
              onValueChange={(val) =>
                setValue("teaching_subject_classe_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="teaching_subject_classe_id" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select Teaching Subject Class" />
              </SelectTrigger>
              <SelectContent>
                {teaching?.map((bt) => (
                  <SelectItem key={bt.id} value={bt.id}>
                    {bt.teachers_firstname + " / " +  bt.classes_name + " / " + bt.subjects_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.teaching_subject_classe_id?.message} />
          </Field>

          <Field>
            <Label htmlFor="room_id">Select Room</Label>
            <Select
              value={watch("room_id") || ""}
              onValueChange={(val) =>
                setValue("room_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="room_id" className="py-5 px-4 w-full">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                {rooms?.map((room) => (
                  <SelectItem key={room.id} value={String(room.id)}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.room_id?.message} />
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
