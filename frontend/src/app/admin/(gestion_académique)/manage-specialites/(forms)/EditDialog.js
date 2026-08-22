"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Connect_Teachers } from "@/components/Api/Connect";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Connect_Speialite } from "@/components/Api/SchoolSetting";
import { Separator } from "@/components/ui/separator";

// Password is optional on edit: only validated if the user actually types one
const schema = z.object({
  name: z.string().min(1, "First name is required").max(50),
});

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

export function EditDialog({
  speialite,
  open,
  onOpenChange,
  refresh,
  setrefresh,
}) {
  const route = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [Error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (speialite) {
      reset({
        name: speialite.name || "",
      });
    }
  }, [speialite, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(false);
    try {
      const payload = { ...data, id: speialite.id };
      if (!payload.password) delete payload.password;

      await Connect_Speialite.Updatespeialite(payload);
      onOpenChange(false);
      toast.success("Speialite updated", {
        description: `${data.name} Speialite has been updated successfully.`,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update Speialite info.";
      setError(message);
      toast.error("Couldn't update Speialite", {
        description: "Failed to update teacher info.",
      });
    } finally {
      setSubmitting(false);
      route.refresh();
      setrefresh(!refresh);
    }
  };

  if (!speialite) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Speialite</DialogTitle>
          <DialogDescription>
            Update the Speialite&apos;s details, then click &quot;Save
            changes&quot; to confirm.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <form
          id="edit-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <Field>
            <Label htmlFor="name">Name Speialite</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Physique"
              className="py-5 px-4"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </Field>

          {Error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{Error}</span>
            </div>
          )}
        </form>

        <DialogFooter className="flex flex-row justify-end gap-2 px-4">
          <DialogClose
            render={
              <Button variant="outline" disabled={submitting}>
                Cancel
              </Button>
            }
          />
          <Button
            type="submit"
            form="edit-form"
            disabled={submitting}
            className="min-w-[140px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
