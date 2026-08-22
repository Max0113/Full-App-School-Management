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
import { Connect_Salaries, Connect_Lookups } from "@/components/Api/SchoolLife";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  teacher_id: z.coerce.number().int().positive("Sélectionnez un enseignant"),
  amount: z.coerce.number().min(0.01, "Le montant doit être positif"),
  mois: z.string().min(1, "Le mois est requis").max(20),
  date_payment: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date invalide",
  }),
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

const teacherLabel = (t) =>
  `${t.firstname ?? ""} ${t.lastname ?? ""}`.trim();

export function EditSheet({ salary, open, onOpenChange, refresh, setrefresh }) {
  const [submitting, setSubmitting] = useState(false);
  const [Error, setError] = useState(false);
  const [teachers, setTeachers] = useState([]);

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
    if (salary) {
      reset({
        teacher_id: String(salary.teacher_id ?? ""),
        amount: String(salary.amount ?? ""),
        mois: salary.mois || "",
        date_payment: salary.date_payment?.slice(0, 10) || "",
      });
    }
  }, [salary, reset]);

  useEffect(() => {
    if (!open) return;
    Connect_Lookups.getTeachers()
      .then((res) => setTeachers(res.data?.data ?? []))
      .catch(() => setTeachers([]));
  }, [open]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      await Connect_Salaries.Updatesalaries({ ...data, id: salary.id });
      onOpenChange(false);
      toast.success("Salaire modifié", {
        description: `Le salaire de ${data.amount} DH a été modifié avec succès.`,
      });
    } catch (error) {
      const apiMessage =
        error?.response?.data?.errors &&
        Object.values(error.response.data.errors)[0]?.[0];
      const message =
        apiMessage || error?.response?.data?.message || "Une erreur est survenue.";
      setError(message);
      toast.error("Impossible de modifier le salaire", { description: message });
    } finally {
      setSubmitting(false);
      setrefresh(!refresh);
    }
  };

  if (!salary) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Modifier le salaire</SheetTitle>
          <SheetDescription>
            Modifiez les informations puis cliquez sur &quot;Enregistrer&quot;.
          </SheetDescription>
        </SheetHeader>

        <form
          id="edit-salary-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="edit-salary-teacher">Enseignant</Label>
            <Select
              value={watch("teacher_id") || ""}
              onValueChange={(val) =>
                setValue("teacher_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger
                id="edit-salary-teacher"
                className="py-5 px-4 w-full"
              >
                <SelectValue placeholder="Sélectionner l'enseignant" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {teacherLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.teacher_id?.message} />
          </Field>

          <div className="flex gap-4">
            <Field className="flex-1">
              <Label htmlFor="edit-salary-amount">Montant</Label>
              <Input
                id="edit-salary-amount"
                type="number"
                step="0.01"
                placeholder="e.g. 8000.00"
                className="py-5 px-4"
                aria-invalid={!!errors.amount}
                {...register("amount")}
              />
              <FieldError message={errors.amount?.message} />
            </Field>
            <Field className="flex-1">
              <Label htmlFor="edit-salary-date">Date du paiement</Label>
              <Input
                id="edit-salary-date"
                type="date"
                className="py-5 px-4"
                aria-invalid={!!errors.date_payment}
                {...register("date_payment")}
              />
              <FieldError message={errors.date_payment?.message} />
            </Field>
          </div>

          <Field>
            <Label htmlFor="edit-salary-mois">Mois</Label>
            <Input
              id="edit-salary-mois"
              type="text"
              placeholder="2026-08 ou Août 2026"
              className="py-5 px-4"
              aria-invalid={!!errors.mois}
              {...register("mois")}
            />
            <FieldError message={errors.mois?.message} />
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
            form="edit-salary-form"
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
