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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditParentDialog({ parent, open, onOpenChange, refresh }) {
  const [formData, setFormData] = useState(parent);

  useEffect(() => {
    setFormData(parent);
  }, [parent]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onOpenChange(false);
    refresh(true);
  };

  if (!parent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit parent info</DialogTitle>
          <DialogDescription>
            Make changes, then click "Save" to confirm.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-parent-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label htmlFor="firstName">First name</Label>
              <Input
                className={"p-5"}
                id="firstName"
                value={formData?.firstname || ""}
                onChange={(e) => handleChange("firstname", e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                className={"p-5"}
                id="lastName"
                value={formData?.lastname || ""}
                onChange={(e) => handleChange("lastname", e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className={"p-5"}
                value={formData?.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Field>
            <div className="flex gap-4">
              <Field className="flex-1">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData?.gender || ""}
                  onValueChange={(val) => handleChange("gender", val)}
                >
                  <SelectTrigger id="gender" className="p-5 w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="flex-1">
                <Label htmlFor="blood_type">Blood type</Label>
                <Select
                  value={formData?.blood_type || ""}
                  onValueChange={(val) => handleChange("blood_type", val)}
                >
                  <SelectTrigger id="blood_type" className="p-5 w-full">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bt) => (
                        <SelectItem key={bt} value={bt}>
                          {bt}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData?.phone || ""}
                className={"p-5"}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData?.address || ""}
                className={"p-5"}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" form="edit-parent-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
