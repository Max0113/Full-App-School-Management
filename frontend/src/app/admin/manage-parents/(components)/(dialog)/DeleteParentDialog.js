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

export function DeleteParentDialog({
  parent,
  open,
  onOpenChange,
  refresh,
  setrefresh,
}) {
  const route = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Connect_Parents.Deleteparents(parent);
      console.log(res);
      onOpenChange(false);
      toast.success("Parent Delete", {
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
    }
  };

  if (!parent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete parent</DialogTitle>
          <DialogDescription>
            If you want Delete parent, click "confirm" to confirm.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-parent-form" onSubmit={handleSubmit}>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" form="edit-parent-form">
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
