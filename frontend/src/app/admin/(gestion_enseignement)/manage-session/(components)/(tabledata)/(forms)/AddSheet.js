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
import { Connect_Subject } from "@/components/Api/admin/SchoolSetting";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Connect_Sessions } from "@/components/Api/admin/Enseignement";

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


export function AddSheet({
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    setSubmitting(true);
    setError(false);
    try {
      await Connect_Sessions.addsessions(data);
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
      if (onRefresh) onRefresh();
    }
  };

 function isoToDatetimeLocal(isoString) {
  if (!isoString) return "";
  return (
    `${isoString}:00`
  );
}


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Seance</SheetTitle>
          <SheetDescription>
            {selectedClasse
              ? `Ajouter une séance pour la classe ${selectedClasse.name ?? selectedClasse.id}.`
              : "Choisis une classe avant d'ajouter une séance."}
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >

          <Field>
            <Label htmlFor="day">Select Jour</Label>
            <Select
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
                  value ? isoToDatetimeLocal(value) : value,
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
                    value ? isoToDatetimeLocal(value) : value, // returns STRING
                })}
              />
              <FieldError message={errors.end_time?.message} />
            </Field>

          <Field>
            <Label htmlFor="teaching_subject_classe_id">Select Teaching ID</Label>
            <Select
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
