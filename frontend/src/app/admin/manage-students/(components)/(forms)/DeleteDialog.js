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
import { Connect_Students } from "@/components/Api/Connect";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

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
      const res = await Connect_Students.Deletestudents(data);
      console.log(res);
      onOpenChange(false);
      toast.success("Student Delete", {
        description: `${data?.firstname} ${data?.lastname} has been delete successfully.`,
      });
    } catch (error) {
      console.error(error?.response?.data?.message);
      toast.error("Error", {
        description: error?.response?.data?.message,
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
          <DialogTitle>Delete student</DialogTitle>
          <DialogDescription>
            If you want Delete student, click "confirm" to confirm.
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
                "Delete student"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
