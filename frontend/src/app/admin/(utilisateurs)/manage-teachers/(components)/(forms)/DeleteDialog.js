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
import { Connect_Teachers } from "@/components/Api/Connect";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

export function DeleteDialog({
  teacher,
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
      const res = await Connect_Teachers.Deleteteachers(teacher);
      console.log(res);
      onOpenChange(false);
      toast.success("Teacher Delete", {
        description: `${teacher?.firstname} ${teacher?.lastname} has been delete successfully.`,
      });
    } catch (error) {
      console.error(error?.response?.teacher?.message);
      toast.error("Error", {
        description: "",
      });
    } finally {
      route.refresh();
      setrefresh(!refresh);
      setSubmitting(false);
    }
  };

  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Teacher</DialogTitle>
          <DialogDescription>
            If you want Delete teacher, click "confirm" to confirm.
          </DialogDescription>
        </DialogHeader>

        <form id="delete-form" onSubmit={handleSubmit}>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              }
            />
            <Button type="submit" form="delete-form" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Delete...
                </>
              ) : (
                "Delete teacher"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
