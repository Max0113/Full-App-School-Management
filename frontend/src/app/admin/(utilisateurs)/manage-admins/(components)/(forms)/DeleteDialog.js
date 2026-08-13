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
import { Connect_Admins } from "@/components/Api/Connect";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

export function DeleteDialog({
  admin,
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
      const res = await Connect_Admins.Deleteadmins(admin);
      console.log(res);
      onOpenChange(false);
      toast.success("Admin Delete", {
        description: `${admin?.firstname} ${admin?.lastname} has been delete successfully.`,
      });
    } catch (error) {
      console.error(error?.response?.admin?.message);
      toast.error("Couldn't delete admin", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      route.refresh();
      setrefresh(!refresh);
      setSubmitting(false);
    }
  };

  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Admin</DialogTitle>
          <DialogDescription>
            If you want Delete admin, click "confirm" to confirm.
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
                "Delete admin"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
