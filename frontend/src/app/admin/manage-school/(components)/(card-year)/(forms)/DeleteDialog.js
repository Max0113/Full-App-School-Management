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
import {
  Connect_Level,
  Connect_SchoolYear,
} from "@/components/Api/SchoolSetting";

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
      const res = await Connect_SchoolYear.Deleteschoolyear(data);
      console.log(res);
      onOpenChange(false);
      toast.success("School Year Delete", {
        description: `${data?.name} Year has been delete successfully.`,
      });
    } catch (error) {
      console.error(error?.response?.data?.message);
      toast.error("Couldn't delete school year", {
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
      <DialogContent className="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete School Year</DialogTitle>
          <DialogDescription>
            If you want school year , click "confirm" to confirm.
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
                "Delete School Year"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
