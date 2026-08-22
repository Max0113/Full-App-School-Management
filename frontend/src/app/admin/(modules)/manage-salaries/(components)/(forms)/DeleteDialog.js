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
import { Connect_Salaries } from "@/components/Api/SchoolLife";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function DeleteDialog({
  salary,
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
      await Connect_Salaries.Deletesalaries(salary.id);
      onOpenChange(false);
      toast.success("Salaire supprimé", {
        description: "Ce salaire a été supprimé avec succès.",
      });
    } catch (error) {
      toast.error("Impossible de supprimer le salaire", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setrefresh(!refresh);
      setSubmitting(false);
    }
  };

  if (!salary) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supprimer le salaire</DialogTitle>
          <DialogDescription>
            Si vous voulez supprimer ce salaire, cliquez sur
            &quot;Confirmer&quot;.
          </DialogDescription>
        </DialogHeader>

        <form id="delete-salary-form" onSubmit={handleSubmit}>
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
              form="delete-salary-form"
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
