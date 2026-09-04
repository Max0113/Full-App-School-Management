"use client";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import CustomCalendar from "./(components)/(clander)/CustomCalendar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TableData } from "./(components)/(tabledata)/TableData";
import { AddSheet } from "./(components)/(tabledata)/(forms)/AddSheet";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoSearch } from "react-icons/io5";
import { Connect_Classe } from "@/components/Api/SchoolSetting";
import { Connect_Sessions, Connect_Teaching } from "@/components/Api/Enseignement";
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { Label } from "@/components/ui/label";

const schema = z.object({
  class_id: z.coerce.number().int().min(1, "Chose a classe"),
});

function Page() {
  const route = useRouter();
  const [classes, setClasses] = useState([]);
  const [sessionsData, setSessionsData] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [teaching, setTeaching] = useState([]);
  const [refresh] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { class_id: "" },
  });

  const selectedClassId = watch("class_id");

  const loadSessions = useCallback(
    async (classId) => {
      if (!classId) {
        setSessionsData([]);
        setSelectedClasse(null);
        return;
      }
      setIsLoading(true);
      try {
        const resSessions = await Connect_Sessions.getbyclasse({
          classe_id: classId,
        });
        const cls = classes.find((c) => String(c.id) === String(classId));
        setSelectedClasse(cls ?? { id: classId });
        setSessionsData(
          Array.isArray(resSessions.data?.data) ? resSessions.data.data : []
        );
      } catch (error) {
        if (isUnauthorized(error)) {
          route.push("/login");
          return;
        }
        toast.error("Failed to load sessions", {
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [classes, route]
  );

  useEffect(() => {
    let active = true;
    const load = async () => {
      setSubmitting(true);
      try {
        const [resClasses, resTeaching] = await Promise.all([
          Connect_Classe.getallclasse(),
          Connect_Teaching.getallteaching(),
        ]);
        if (!active) return;
        setClasses(resClasses.data.data);
        setTeaching(
          Array.isArray(resTeaching.data?.data) ? resTeaching.data.data : []
        );
      } catch (error) {
        if (!active) return;
        if (isUnauthorized(error)) {
          route.push("/login");
          return;
        }
        toast.error("Impossible de charger les données", {
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
  }, [refresh, route]);

const handleClassSelect = (val) => {
  setValue("class_id", val, { shouldValidate: true });
  loadSessions(val);
};

const onSearch = (data) => {
  loadSessions(data.class_id);
};

const handleAddClick = () => {
  if (!selectedClasse) {
    toast.error("Choisis une classe d'abord", {
      description: "Sélectionnez une classe avant d'ajouter une séance.",
    });
    return;
  }
  setAddOpen(true);
};


  // teachings filtered for the selected class, passed to add/edit forms
  const filteredTeaching = selectedClassId
    ? teaching.filter(
        (t) => String(t.classe_id) === String(selectedClassId)
      )
    : [];
  

  return (
    <main className="px-10 py-5">
      <div className="mb-5">
        <h1 className="text-3xl font-bold py-1 mb-0">Controller Seances 📙</h1>
        <p className="font-light text-white/20">
          Choisis une classe pour voir son emploi du temps et ses séances.
        </p>
      </div>
            <form
        id="search-form"
        onSubmit={handleSubmit(onSearch)}
        className="mb-5 bg-sidebar p-5 rounded-lg flex items-end gap-5 justify-between"
      >
        <Field className="w-60">
          <Label htmlFor="class_id">Select Classe</Label>
          <Select value={selectedClassId || ""} onValueChange={handleClassSelect}>
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

        <Button form="search-form" type="submit" disabled={isLoading || submitting}>
          <IoSearch className="h-4 w-4" />
          Search Seance
        </Button>
      </form>

        {selectedClasse ?  (<Tabs defaultValue="calendar" className="w-full">
          <TabsList className="mb-5" variant="line">
            <TabsTrigger value="calendar">Emploi de temps</TabsTrigger>
            <TabsTrigger value="session">Seances</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar">
            <CustomCalendar
              sessionsData={sessionsData}
              selectedClasse={selectedClasse}
              teaching={filteredTeaching}
              onAddClick={handleAddClick}
              setrefresh={() => { if (selectedClassId) loadSessions(selectedClassId); }}
            />
          </TabsContent>
          <TabsContent value="session">
            <TableData
              sessionsData={sessionsData}
              selectedClasse={selectedClasse}
              teaching={filteredTeaching}
              onAddClick={handleAddClick}
              onRefresh={() => { if (selectedClassId) loadSessions(selectedClassId); }}
            />
          </TabsContent>
        </Tabs>) : (
          <div className="flex flex-col items-center justify-center h-96">
            <Label className="text-md text-white/50">Choisis une classe pour voir ses séances</Label>
          </div>
        )}

        <AddSheet
          open={addOpen}
          onOpenChange={setAddOpen}
          teaching={filteredTeaching}
          selectedClasse={selectedClasse}
          onRefresh={() => { if (selectedClassId) loadSessions(selectedClassId); }}
        />
      </main>
    );
}

export default Page;
