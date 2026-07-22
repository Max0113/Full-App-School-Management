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
import { Connect_Parents } from "@/components/Api/Connect";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

export function DeleteParentDialog({
  parent,
  open,
  onOpenChange,
  refresh,
  setrefresh,
}) {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await Connect_Parents.Deleteparents(parent);
      console.log(res);
      onOpenChange(false);
      toast.success("Student Delete", {
        description: `${parent?.firstname} ${parent?.lastname} has been delete successfully.`,
      });
    } catch (error) {
      console.error(error?.response?.data?.message);
      toast.error("Error", {
        description: error?.response?.data?.message,
      });
    } finally {
      route.refresh();
      setrefresh(!refresh);
      setIsLoading(false);
    }
  };

  if (!parent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete student</DialogTitle>
          <DialogDescription>
            If you want Delete student, click "confirm" to confirm.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-parent-form" onSubmit={handleSubmit}>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" form="edit-parent-form">
              {isLoading ? (
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
