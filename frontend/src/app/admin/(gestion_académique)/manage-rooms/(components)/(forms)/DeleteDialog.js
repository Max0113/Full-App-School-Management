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
import { useRouter } from "next/navigation";
import { Connect_Rooms } from "@/components/Api/admin/Enseignement";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function DeleteDialog({ data, open, onOpenChange, refresh, setrefresh }) {
  const route = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      await Connect_Rooms.Deleteroom(data);
      onOpenChange(false);
      toast.success("Salle Delete", {
        description: `${data?.name} has been deleted successfully.`,
      });
    } catch (error) {
      toast.error("Couldn't delete salle", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      route.refresh();
      setrefresh(!refresh);
      setSubmitting(false);
    }
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Salle</DialogTitle>
          <DialogDescription>
            If you want to delete the salle, click &quot;confirm&quot; to
            confirm.
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
                "Delete Salle"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}