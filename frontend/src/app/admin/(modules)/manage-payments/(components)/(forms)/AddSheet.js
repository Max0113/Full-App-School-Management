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
import { Connect_Payments, Connect_Lookups } from "@/components/Api/SchoolLife";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  user_id: z.coerce.number().int().positive("Sélectionnez un étudiant"),
  amount: z.coerce.number().min(0.01, "Le montant doit être positif"),
  date_payment: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date invalide",
  }),
  type_payment: z.enum(["cash", "online"], {
    message: "Sélectionnez un type valide",
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

const studentLabel = (s) =>
  `${s.firstname ?? ""} ${s.lastname ?? ""}`.trim();

export function AddSheet({ open, onOpenChange, refresh, setrefresh }) {
  const [submitting, setSubmitting] = useState(false);
  const [Error, setError] = useState(false);
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
    defaultValues: {
      user_id: "",
      amount: "",
      date_payment: "",
      type_payment: undefined,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      user_id: "",
      amount: "",
      date_payment: "",
      type_payment: undefined,
    });
    Connect_Lookups.getStudents()
      .then((res) => setStudents(res.data?.data ?? []))
      .catch(() => setStudents([]));
  }, [open, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      await Connect_Payments.addpayments(data);
      onOpenChange(false);
      toast.success("Paiement créé", {
        description: `Le paiement de ${data.amount} DH a été ajouté avec succès.`,
      });
    } catch (error) {
      const apiMessage =
        error?.response?.data?.errors &&
        Object.values(error.response.data.errors)[0]?.[0];
      const message =
        apiMessage || error?.response?.data?.message || "Une erreur est survenue.";
      setError(message);
      toast.error("Impossible de créer le paiement", { description: message });
    } finally {
      setSubmitting(false);
      setrefresh(!refresh);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ajouter un paiement</SheetTitle>
          <SheetDescription>
            Remplissez les détails du paiement, puis cliquez sur
            &quot;Créer&quot;.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-payment-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4"
        >
          <Field>
            <Label htmlFor="payment-student">Étudiant</Label>
            <Select
              value={watch("user_id") || ""}
              onValueChange={(val) =>
                setValue("user_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="payment-student" className="py-5 px-4 w-full">
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

          <div className="flex gap-4">
            <Field className="flex-1">
              <Label htmlFor="payment-amount">Montant</Label>
              <Input
                id="payment-amount"
                type="number"
                step="0.01"
                placeholder="e.g. 500.00"
                className="py-5 px-4"
                aria-invalid={!!errors.amount}
                {...register("amount")}
              />
              <FieldError message={errors.amount?.message} />
            </Field>
            <Field className="flex-1">
              <Label htmlFor="payment-date">Date du paiement</Label>
              <Input
                id="payment-date"
                type="date"
                className="py-5 px-4"
                aria-invalid={!!errors.date_payment}
                {...register("date_payment")}
              />
              <FieldError message={errors.date_payment?.message} />
            </Field>
          </div>

          <Field>
            <Label htmlFor="payment-type">Type</Label>
            <Select
              value={watch("type_payment") || ""}
              onValueChange={(val) =>
                setValue("type_payment", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="payment-type" className="py-5 px-4 w-full">
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="online">En ligne</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={errors.type_payment?.message} />
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
            form="add-payment-form"
            disabled={submitting}
            className="min-w-[140px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              "Créer le paiement"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
