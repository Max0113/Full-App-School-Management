"use client";
import React , { useState , useEffect , useCallback  }from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableData } from "./(components)/TableData";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  class_id: z.coerce.number().int().min(1, "Choisis une classe"),
});

function page() {
    const route = useRouter();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const {
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(schema),
      defaultValues: { class_id: "" },
    });

    const classId = watch("class_id");

    const onSearch = useCallback(
      (data) => {
        const cls = classes.find((c) => String(c.id) === String(data.class_id));
        setRefresh((r) => r + 1);
      },
      [classes]
    );

  return (
    <main className="px-10 py-5">
      <div className="mb-9">
        <h1 className="text-3xl font-bold py-1 mb-0">My Students 📖</h1>
        <p className="font-light dark:text-white/20 text-black/40">
          tu peux see all student in your classe{" "}
        </p>
      </div>
      <form
        id="search-form"
        onSubmit={handleSubmit(onSearch)}
        className="mb-5 bg-sidebar p-5 rounded-lg flex items-end gap-5 justify-between"
      >
        <Field className="w-60">
          <Label htmlFor="class_id">Select Classe</Label>
          <Select
            value={classId || ""}
            onValueChange={(val) =>
              setValue("class_id", val, { shouldValidate: true })
            }
          >
            <SelectTrigger id="class_id" className="py-4 px-4">
              <SelectValue placeholder="Select Classe" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((bt) => (
                <SelectItem key={bt.id} value={String(bt.id)}>
                  {bt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.class_id?.message} />
        </Field>
      </form>
      <TableData />
    </main>
  );
}

export default page;
