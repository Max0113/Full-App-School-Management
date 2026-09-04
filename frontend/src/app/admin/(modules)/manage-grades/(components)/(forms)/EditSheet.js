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
import { Connect_Grades, Connect_Lookups } from "@/components/Api/SchoolLife";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  exam_id: z.coerce.number().int().positive("Sélectionnez un examen"),
  user_id: z.coerce.number().int().positive("Sélectionnez un étudiant"),
  note: z.coerce
    .number()
    .min(0, "La note doit être ≥ 0")
    .max(20, "La note doit être ≤ 20"),
  appreciation: z.string().min(1, "L'appréciation est requise").max(255),
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

const examLabel = (e) =>
  `${e.name} (${e.subject_name ?? ""})`;

const studentLabel = (s) => `${s.firstname} ${s.lastname}`;

export function EditSheet({ grade, open, onOpenChange, refresh, setrefresh , selectedClasse}) {
  const [submitting, setSubmitting] = useState(false);
  const [Error, setError] = useState(false);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);

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
    if (grade) {
      reset({
        exam_id: String(grade.exam_id ?? ""),
        user_id: String(grade.user_id ?? ""),
        note: String(grade.note ?? ""),
        appreciation: grade.appreciation || "",
      });
    }
  }, [grade, reset]);

  useEffect(() => {
    if (!open) return;
    Connect_Lookups.getExams(selectedClasse.id)
      .then((res) => setExams(res.data?.data ?? []))
      .catch(() => setExams([]));
    Connect_Lookups.getStudents(selectedClasse.id)
      .then((res) => setStudents(res.data?.data ?? []))
      .catch(() => setStudents([]));
  }, [open, selectedClasse]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      await Connect_Grades.Updategrades({ ...data, id: grade.id });
      onOpenChange(false);
      toast.success("Note mise à jour", {
        description: `La note #${grade.id} a été modifiée avec succès.`,
      });
    } catch (error) {
      const apiMessage =
        error?.response?.data?.errors &&
        Object.values(error.response.data.errors)[0]?.[0];
      const message =
        apiMessage || error?.response?.data?.message || "Une erreur est survenue.";
      setError(message);
      toast.error("Impossible de modifier la note", { description: message });
    } finally {
      setSubmitting(false);
      setrefresh(!refresh);
    }
  };

  if (!grade) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Modifier la note</SheetTitle>
          <SheetDescription>
            Modifiez les informations puis cliquez sur &quot;Enregistrer&quot;.
          </SheetDescription>
        </SheetHeader>

        <form
          id="edit-grade-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="edit-grade-exam">Examen</Label>
            <Select
              value={watch("exam_id") || ""}
              onValueChange={(val) =>
                setValue("exam_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="edit-grade-exam" className="py-5 px-4 w-full">
                <SelectValue placeholder="Sélectionner l'examen" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {examLabel(e)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.exam_id?.message} />
          </Field>

          <Field>
            <Label htmlFor="edit-grade-student">Étudiant</Label>
            <Select
              value={watch("user_id") || ""}
              onValueChange={(val) =>
                setValue("user_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger
                id="edit-grade-student"
                className="py-5 px-4 w-full"
              >
                <SelectValue placeholder="Sélectionner l'étudiant" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {studentLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.user_id?.message} />
          </Field>

          <Field>
            <Label htmlFor="edit-grade-note">Note</Label>
            <Input
              id="edit-grade-note"
              type="number"
              step="0.25"
              placeholder="e.g. 15.5"
              className="py-5 px-4"
              aria-invalid={!!errors.note}
              {...register("note")}
            />
            <FieldError message={errors.note?.message} />
          </Field>

          <Field>
            <Label htmlFor="edit-grade-appreciation">Appréciation</Label>
            <Input
              id="edit-grade-appreciation"
              type="text"
              placeholder="e.g. Très bon travail"
              className="py-5 px-4"
              aria-invalid={!!errors.appreciation}
              {...register("appreciation")}
            />
            <FieldError message={errors.appreciation?.message} />
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
            form="edit-grade-form"
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
