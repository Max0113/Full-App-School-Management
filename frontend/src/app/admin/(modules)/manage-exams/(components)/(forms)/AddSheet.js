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

export function AddSheet({ open, onOpenChange, refresh, setrefresh }) {
  const [submitting, setSubmitting] = useState(false);
  const [Error, setError] = useState(false);
  const [teachings, setTeachings] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: undefined, exam_date: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({ name: "", type: undefined, exam_date: "" });
    Connect_Lookups.getTeachings()
      .then((res) => setTeachings(res.data?.data ?? []))
      .catch(() => setTeachings([]));
  }, [open, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      await Connect_Exams.addexams(data);
      onOpenChange(false);
      toast.success("Examen créé", {
        description: `${data.name} a été ajouté avec succès.`,
      });
    } catch (error) {
      const apiMessage =
        error?.response?.data?.errors &&
        Object.values(error.response.data.errors)[0]?.[0];
      const message =
        apiMessage || error?.response?.data?.message || "Une erreur est survenue.";
      setError(message);
      toast.error("Impossible de créer l'examen", { description: message });
    } finally {
      setSubmitting(false);
      setrefresh(!refresh);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ajouter un examen</SheetTitle>
          <SheetDescription>
            Remplissez les détails de l&apos;examen, puis cliquez sur
            &quot;Créer&quot;.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-exam-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="exam-name">Nom</Label>
            <Input
              id="exam-name"
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
              <Label htmlFor="exam-type">Type</Label>
              <Select
                onValueChange={(val) =>
                  setValue("type", val, { shouldValidate: true })
                }
              >
                <SelectTrigger id="exam-type" className="py-5 px-4 w-full">
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
              <Label htmlFor="exam-date">Date de l&apos;examen</Label>
              <Input
                id="exam-date"
                type="date"
                className="py-5 px-4"
                aria-invalid={!!errors.exam_date}
                {...register("exam_date")}
              />
              <FieldError message={errors.exam_date?.message} />
            </Field>
          </div>

          <Field>
            <Label htmlFor="exam-teaching">Enseignement (matière/classe)</Label>
            <Select
              onValueChange={(val) =>
                setValue("teaching_subject_classe_id", val, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="exam-teaching" className="py-5 px-4 w-full">
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
            form="add-exam-form"
            disabled={submitting}
            className="min-w-[140px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              "Créer l'examen"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
