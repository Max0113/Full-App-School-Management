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

const NEXT_STATUS = {
  pending: "in_progress",
  in_progress: "completed",
};

const STATUS_LABELS = {
  pending: "En attente",
  in_progress: "En cours",
  completed: "Complété",
};

export function StatusDialog({
  salary,
  open,
  onOpenChange,
  refresh,
  setrefresh,
}) {
  const [submitting, setSubmitting] = useState(false);

  const next = salary ? NEXT_STATUS[salary.status] : undefined;

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      await Connect_Salaries.setSalaryStatus(salary.id, next);
      onOpenChange(false);
      toast.success("Statut mis à jour");
    } catch (error) {
      toast.error("Impossible de changer le statut");
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
          <DialogTitle>Changer le statut</DialogTitle>
          <DialogDescription>
            {next
              ? `Statut actuel : ${
                  STATUS_LABELS[salary.status] ?? salary.status
                }. Nouveau statut : ${STATUS_LABELS[next]}.`
              : "Statut final atteint."}
          </DialogDescription>
        </DialogHeader>

        <form id="status-salary-form" onSubmit={handleSubmit}>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={submitting}>
                  Annuler
                </Button>
              }
            />
            {next && (
              <Button
                type="submit"
                form="status-salary-form"
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
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
