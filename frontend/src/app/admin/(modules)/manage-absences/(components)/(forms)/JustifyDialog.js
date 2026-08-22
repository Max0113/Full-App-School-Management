"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Connect_Absences } from "@/components/Api/SchoolLife";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function JustifyDialog({
  absence,
  open,
  onOpenChange,
  refresh,
  setrefresh,
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      await Connect_Absences.justifyabsence(absence.id, !absence.justified);
      toast.success("Statut mis à jour", {
        description: "Le statut de justification a été mis à jour.",
      });
    } catch (error) {
      toast.error("Impossible de mettre à jour le statut", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      onOpenChange(false);
      setrefresh(!refresh);
      setSubmitting(false);
    }
  };

  if (!absence) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Basculer la justification</DialogTitle>
          <DialogDescription>
            Confirmez-vous le changement de statut de justification de cette
            absence ?
          </DialogDescription>
        </DialogHeader>

        <form id="justify-absence-form" onSubmit={handleSubmit}>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={submitting}>
                  Annuler
                </Button>
              }
            />
            <Button
              type="submit"
              form="justify-absence-form"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Confirmer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
