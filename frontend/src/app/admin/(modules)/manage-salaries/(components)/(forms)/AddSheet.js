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

export function AddSheet({ open, onOpenChange, refresh, setrefresh }) {
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
    defaultValues: {
      teacher_id: "",
      amount: "",
      mois: "",
      date_payment: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      teacher_id: "",
      amount: "",
      mois: "",
      date_payment: "",
    });
    Connect_Lookups.getTeachers()
      .then((res) => setTeachers(res.data?.data ?? []))
      .catch(() => setTeachers([]));
  }, [open, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      await Connect_Salaries.addsalaries(data);
      onOpenChange(false);
      toast.success("Salaire créé", {
        description: `Le salaire de ${data.amount} DH a été ajouté avec succès.`,
      });
    } catch (error) {
      const apiMessage =
        error?.response?.data?.errors &&
        Object.values(error.response.data.errors)[0]?.[0];
      const message =
        apiMessage || error?.response?.data?.message || "Une erreur est survenue.";
      setError(message);
      toast.error("Impossible de créer le salaire", { description: message });
    } finally {
      setSubmitting(false);
      setrefresh(!refresh);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ajouter un salaire</SheetTitle>
          <SheetDescription>
            Remplissez les détails du salaire, puis cliquez sur
            &quot;Créer&quot;.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-salary-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="salary-teacher">Enseignant</Label>
            <Select
              value={watch("teacher_id") || ""}
              onValueChange={(val) =>
                setValue("teacher_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="salary-teacher" className="py-5 px-4 w-full">
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
              <Label htmlFor="salary-amount">Montant</Label>
              <Input
                id="salary-amount"
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
              <Label htmlFor="salary-date">Date du paiement</Label>
              <Input
                id="salary-date"
                type="date"
                className="py-5 px-4"
                aria-invalid={!!errors.date_payment}
                {...register("date_payment")}
              />
              <FieldError message={errors.date_payment?.message} />
            </Field>
          </div>

          <Field>
            <Label htmlFor="salary-mois">Mois</Label>
            <Input
              id="salary-mois"
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
            form="add-salary-form"
            disabled={submitting}
            className="min-w-[140px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              "Créer le salaire"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
