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

export function DeleteDialog({
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
      await Connect_Absences.Deleteabsences(absence.id);
      onOpenChange(false);
      toast.success("Absence supprimée", {
        description: "L'absence a été supprimée avec succès.",
      });
    } catch (error) {
      toast.error("Impossible de supprimer l'absence", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setrefresh(!refresh);
      setSubmitting(false);
    }
  };

  if (!absence) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;absence</DialogTitle>
          <DialogDescription>
            Si vous voulez supprimer cette absence, cliquez sur
            &quot;Confirmer&quot;.
          </DialogDescription>
        </DialogHeader>

        <form id="delete-absence-form" onSubmit={handleSubmit}>
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
              form="delete-absence-form"
              disabled={submitting}
              className={"bg-red-500 hover:bg-red-600 text-white"}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Suppression...
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
