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

export function AddSheet({ open, onOpenChange, refresh, setrefresh }) {
  const [submitting, setSubmitting] = useState(false);
  const [Error, setError] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { class_session_id: "", user_id: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({ class_session_id: "", user_id: "" });
    Connect_Lookups.getSessions()
      .then((res) => setSessions(res.data?.data ?? []))
      .catch(() => setSessions([]));
    Connect_Lookups.getStudents()
      .then((res) => setStudents(res.data?.data ?? []))
      .catch(() => setStudents([]));
  }, [open, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      await Connect_Absences.addabsences(data);
      onOpenChange(false);
      toast.success("Absence créée", {
        description: "L'absence a été ajoutée avec succès.",
      });
    } catch (error) {
      const apiMessage =
        error?.response?.data?.errors &&
        Object.values(error.response.data.errors)[0]?.[0];
      const message =
        apiMessage || error?.response?.data?.message || "Une erreur est survenue.";
      setError(message);
      toast.error("Impossible de créer l'absence", { description: message });
    } finally {
      setSubmitting(false);
      setrefresh(!refresh);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ajouter une absence</SheetTitle>
          <SheetDescription>
            Remplissez les détails de l&apos;absence, puis cliquez sur
            &quot;Créer&quot;.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-absence-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="add-absence-session">Séance</Label>
            <Select
              value={watch("class_session_id") || ""}
              onValueChange={(val) =>
                setValue("class_session_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger
                id="add-absence-session"
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
            <Label htmlFor="add-absence-student">Étudiant</Label>
            <Select
              value={watch("user_id") || ""}
              onValueChange={(val) =>
                setValue("user_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger
                id="add-absence-student"
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
            form="add-absence-form"
            disabled={submitting}
            className="min-w-[140px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              "Créer l'absence"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
