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
import { Loader2, AlertCircle } from "lucide-react";
import { Connect_Teaching } from "@/components/Api/Enseignement";

export function DeleteDialog({
  data,
  open,
  onOpenChange,
  refresh,
  setrefresh,
}) {
  const route = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      const res = await Connect_Teaching.Deleteteaching(data);
      console.log(res);
      onOpenChange(false);
      toast.success("Enseignement Delete", {
        description: `has been delete successfully.`,
      });
    } catch (error) {
      console.error(error?.response?.data?.message);
      toast.error("Couldn't delete enseignement", {
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
          <DialogTitle>Delete Enseignement</DialogTitle>
          <DialogDescription>
            If you want Delete enseignement, click "confirm" to confirm.
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
                "Delete enseignement"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
