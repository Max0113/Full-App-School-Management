"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoSearch } from "react-icons/io5";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableData } from "./(components)/TableData";
import { Connect_Lookups } from "@/components/Api/SchoolLife";
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

const schema = z.object({
  class_id: z.coerce.number().int().min(1, "Choisis une classe"),
});

function Page() {
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
  
    useEffect(() => {
      let active = true;
      const load = async () => {
        setSubmitting(true);
        try {
          const res = await Connect_Lookups.getClasses();
          if (!active) return;
          setClasses(res.data?.data ?? []);
        } catch (error) {
          if (!active) return;
          if (isUnauthorized(error)) {
            route.push("/login");
            return;
          }
          toast.error("Impossible de charger les classes", {
            description: getApiErrorMessage(error),
          });
        } finally {
          if (active) setSubmitting(false);
        }
      };
      load();
      return () => {
        active = false;
      };
    }, [route]);
  
    const onSearch = useCallback(
      (data) => {
        const cls = classes.find((c) => String(c.id) === String(data.class_id));
        setRefresh((r) => r + 1);
      },
      [classes]
    );
  
  return (
    <main className="px-10 py-5">
      <div className="mb-4">
        <h1 className="text-3xl font-bold py-1 mb-0">Examens ⚰️</h1>
        <p className="font-light text-white/20">
          Gérez les examens : créer, modifier et supprimer.
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

        <Button
          form="search-form"
          type="submit"
          disabled={isLoading || submitting}
        >
          <IoSearch className="h-4 w-4" />
          Search Examens
        </Button>
      </form>

      {classId ?  (
        <TableData
          key={classId}
          classeId={classId}
          refresh={refresh}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <Label className="text-md text-white/50">Choisis une classe pour voir ses séances</Label>
        </div>
      )}
    </main>
  );
}

export default Page;
