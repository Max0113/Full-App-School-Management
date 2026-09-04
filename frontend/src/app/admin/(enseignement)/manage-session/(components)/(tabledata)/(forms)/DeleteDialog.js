"use client";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Connect_Sessions } from "@/components/Api/Enseignement";

export function DeleteDialog({
  data,
  open,
  onOpenChange,
  onRefresh,
}) {
  const route = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      await Connect_Sessions.Deletesessions(data);
      onOpenChange(false);
      toast.success("Seance Delete", {
        description: `has been delete successfully.`,
      });
    } catch (error) {
      toast.error("Couldn't delete seance", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      route.refresh();
      if (onRefresh) onRefresh();
      setSubmitting(false);
    }
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Seance</DialogTitle>
          <DialogDescription>
            If you want Delete seance, click &quot;confirm&quot; to confirm.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-form" onSubmit={handleSubmit}>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={submitting} form="edit-form">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Delete...
                </>
              ) : (
                "Delete seance"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
