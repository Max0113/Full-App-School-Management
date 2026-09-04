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
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Connect_Absences, Connect_Lookups } from "@/components/Api/SchoolLife";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  class_session_id: z.coerce
    .number()
    .int()
    .positive("Sélectionnez une séance"),
  user_id: z.coerce
    .number()
    .int()
    .positive("Sélectionnez un étudiant"),
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

const sessionLabel = (s) => {
  let time = "";
  try {
    const date = new Date(s.start_time);
    if (!isNaN(date.getTime())) {
      time = ` (${date.toLocaleString("fr-FR")})`;
    }
  } catch {
    time = "";
  }
  return `${s.subject_name ?? ""} — ${s.classe_name ?? ""}${time}`.trim();
};

export function EditSheet({ absence, open, onOpenChange, refresh, setrefresh, selectedClasse }) {
  const [submitting, setSubmitting] = useState(false);
  const [Error, setError] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [sessions, setSessions] = useState([]);
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
    console.log("absence:", selectedClasse);
    if (absence) {
      const initialClass = absence.classe_id
        ? String(absence.classe_id)
        : selectedClasse?.id
          ? String(selectedClasse.id)
          : "";
      setSelectedClassId(initialClass);
      reset({
        class_session_id: String(absence.class_session_id ?? ""),
        user_id: String(absence.user_id ?? ""),
      });
    }
  }, [absence, reset, selectedClasse]);

  useEffect(() => {
    if (!open) return;
    Connect_Lookups.getClasses()
      .then((res) => setClasses(res.data?.data ?? []))
      .catch(() => setClasses([]));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!selectedClassId) {
      setSessions([]);
      setStudents([]);
      return;
    }
    Connect_Lookups.getSessionsByClasse(selectedClassId)
      .then((res) => setSessions(res.data?.data ?? []))
      .catch(() => setSessions([]));
    Connect_Lookups.getStudents(selectedClassId)
      .then((res) => setStudents(res.data?.data ?? []))
      .catch(() => setStudents([]));
  }, [open, selectedClassId]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      await Connect_Absences.Updateabsences({ ...data, id: absence.id });
      onOpenChange(false);
      toast.success("Absence mise à jour", {
        description: "L'absence a été modifiée avec succès.",
      });
    } catch (error) {
      const apiMessage =
        error?.response?.data?.errors &&
        Object.values(error.response.data.errors)[0]?.[0];
      const message =
        apiMessage || error?.response?.data?.message || "Une erreur est survenue.";
      setError(message);
      toast.error("Impossible de modifier l'absence", { description: message });
    } finally {
      setSubmitting(false);
      setrefresh(!refresh);
    }
  };

  if (!absence) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Modifier l&apos;absence</SheetTitle>
          <SheetDescription>
            Modifiez les informations puis cliquez sur &quot;Enregistrer&quot;.
          </SheetDescription>
        </SheetHeader>

        <form
          id="edit-absence-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="edit-absence-session">Séance</Label>
            <Select
              value={watch("class_session_id") || ""}
              onValueChange={(val) =>
                setValue("class_session_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger
                id="edit-absence-session"
                className="py-5 px-4 w-full"
              >
                <SelectValue placeholder="Sélectionner la séance" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {sessionLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.class_session_id?.message} />
          </Field>

          <Field>
            <Label htmlFor="edit-absence-student">Étudiant</Label>
            <Select
              value={watch("user_id") || ""}
              onValueChange={(val) =>
                setValue("user_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger
                id="edit-absence-student"
                className="py-5 px-4 w-full"
              >
                <SelectValue placeholder="Sélectionner l'étudiant" />
              </SelectTrigger>
              <SelectContent>
                {students.map((st) => (
                  <SelectItem key={st.id} value={String(st.id)}>
                    {`${st.firstname} ${st.lastname}`.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.user_id?.message} />
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
            form="edit-absence-form"
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
