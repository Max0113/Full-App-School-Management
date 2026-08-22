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
import { Connect_Exams, Connect_Lookups } from "@/components/Api/SchoolLife";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Le nom est requis").max(255),
  type: z.enum(["written", "oral", "practical"], {
    message: "Sélectionnez un type valide",
  }),
  exam_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date invalide",
  }),
  teaching_subject_classe_id: z.coerce
    .number({ message: "Sélectionnez un enseignement" })
    .int()
    .positive("Sélectionnez un enseignement"),
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

const teachingLabel = (t) =>
  `${t.subjects_name ?? "Matière"} — ${t.classes_name ?? "Classe"} (${
    t.teachers_firstname ?? ""
  } ${t.teachers_lastname ?? ""})`.trim();

export function EditSheet({ exam, open, onOpenChange, refresh, setrefresh }) {
  const [submitting, setSubmitting] = useState(false);
  const [Error, setError] = useState(false);
  const [teachings, setTeachings] = useState([]);

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
    if (exam) {
      reset({
        name: exam.name || "",
        type: exam.type || undefined,
        exam_date: exam.exam_date?.slice(0, 10) || "",
        teaching_subject_classe_id: String(
          exam.teaching_subject_classe_id ?? "",
        ),
      });
    }
  }, [exam, reset]);

  useEffect(() => {
    if (!open) return;
    Connect_Lookups.getTeachings()
      .then((res) => setTeachings(res.data?.data ?? []))
      .catch(() => setTeachings([]));
  }, [open]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      await Connect_Exams.Updateexams({ ...data, id: exam.id });
      onOpenChange(false);
      toast.success("Examen mis à jour", {
        description: `${data.name} a été modifié avec succès.`,
      });
    } catch (error) {
      const apiMessage =
        error?.response?.data?.errors &&
        Object.values(error.response.data.errors)[0]?.[0];
      const message =
        apiMessage || error?.response?.data?.message || "Une erreur est survenue.";
      setError(message);
      toast.error("Impossible de modifier l'examen", { description: message });
    } finally {
      setSubmitting(false);
      setrefresh(!refresh);
    }
  };

  if (!exam) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Modifier l&apos;examen</SheetTitle>
          <SheetDescription>
            Modifiez les informations puis cliquez sur &quot;Enregistrer&quot;.
          </SheetDescription>
        </SheetHeader>

        <form
          id="edit-exam-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="edit-exam-name">Nom</Label>
            <Input
              id="edit-exam-name"
              type="text"
              placeholder="e.g. Contrôle n°1"
              className="py-5 px-4"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </Field>

          <div className="flex gap-4">
            <Field className="flex-1">
              <Label htmlFor="edit-exam-type">Type</Label>
              <Select
                value={watch("type") || ""}
                onValueChange={(val) =>
                  setValue("type", val, { shouldValidate: true })
                }
              >
                <SelectTrigger id="edit-exam-type" className="py-5 px-4 w-full">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="written">Écrit</SelectItem>
                  <SelectItem value="oral">Oral</SelectItem>
                  <SelectItem value="practical">Pratique</SelectItem>
                </SelectContent>
              </Select>
              <FieldError message={errors.type?.message} />
            </Field>
            <Field className="flex-1">
              <Label htmlFor="edit-exam-date">Date de l&apos;examen</Label>
              <Input
                id="edit-exam-date"
                type="date"
                className="py-5 px-4"
                aria-invalid={!!errors.exam_date}
                {...register("exam_date")}
              />
              <FieldError message={errors.exam_date?.message} />
            </Field>
          </div>

          <Field>
            <Label htmlFor="edit-exam-teaching">
              Enseignement (matière/classe)
            </Label>
            <Select
              value={watch("teaching_subject_classe_id") || ""}
              onValueChange={(val) =>
                setValue("teaching_subject_classe_id", val, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                id="edit-exam-teaching"
                className="py-5 px-4 w-full"
              >
                <SelectValue placeholder="Sélectionner l'enseignement" />
              </SelectTrigger>
              <SelectContent>
                {teachings.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {teachingLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.teaching_subject_classe_id?.message} />
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
                Annuler
              </Button>
            }
          />
          <Button
            type="submit"
            form="edit-exam-form"
            disabled={submitting}
            className="min-w-[140px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

