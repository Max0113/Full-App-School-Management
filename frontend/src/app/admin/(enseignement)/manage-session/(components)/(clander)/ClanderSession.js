"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar-dark.css";
import { Connect_Sessions } from "@/components/Api/Enseignement";
import { Button } from "@/components/ui/button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError } from "@/components/ui/field";
import { Connect_Classe } from "@/components/Api/SchoolSetting";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AddSheet } from "../(tabledata)/(forms)/AddSheet";
import { useRouter } from "next/navigation";
import { Connect_Teaching } from "@/components/Api/Enseignement";
import { IoSearch } from "react-icons/io5";


const subjectColors = {
  Mathématiques: { bg: "#EDE9FE", text: "#6D28D9" },
  Français: { bg: "#DBEAFE", text: "#1D4ED8" },
  Physique: { bg: "#D1FAE5", text: "#047857" },
  Anglais: { bg: "#FEF3C7", text: "#B45309" },
};

const shema = z.object({
  classe_id: z.coerce.number().min(1, "Chose a classe"),
});

export function ClanderSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionsData, setSessionsData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [dialogOpenAd, setDialogOpenAd] = useState(false);
  const [teaching, Setteaching] = useState([]);
  const [refresh, setrefresh] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shema),
  });

  const handleAddClick = () => {
    setDialogOpenAd(true);
  };

  const getDataClasses = async () => {
    setIsLoading(true);
    try {
      const resClasses = await Connect_Classe.getallclasse();
      const resTeaching = await Connect_Teaching.getallteaching();
      Setteaching(resTeaching.data.data);
      setClasses(resClasses.data.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const events = sessionsData?.map((s) => {
      const colors = subjectColors[s.subject_name] || {
        bg: "#F3F4F6",
        text: "#374151",
      };
      return {
        id: s.id,
        title: s.subject_name,
        start: s.start_time,
        end: s.end_time,
        backgroundColor: colors.bg,
        textColor: colors.text,
        extendedProps: { classe_name: "3A" },
      };
    });

  useEffect(() => {
    getDataClasses();
  }, [refresh]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const resSessions = await Connect_Sessions.getbyclasse(data);
      toast.success("Search session successful");
      setSessionsData(Array.isArray(resSessions.data?.data) ? resSessions.data.data : []);
    } catch (error) {
      console.error("Error searching session:", error);
      toast.error("Failed to search session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="rounded-xl bg-[#0a0a0a]">
      <div className="mb-4 flex items-center justify-between gap-50">
        <form
          id="search-form"
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex items-center gap-4"
        >
        <Field>
          <Select
            onValueChange={(val) =>
              setValue("classe_id", val, { shouldValidate: true })
            }
          >
            <SelectTrigger id="classe_id" className="py-4 px-4">
              <SelectValue placeholder="Select Classe ID" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((bt) => (
                <SelectItem key={bt.id} value={String(bt.id)}>
                  {bt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.classe_id?.message} />
        </Field>
        </form>

         <Button  form="search-form" type="submit" disabled={isLoading}>
            <IoSearch className="h-4 w-4" />
            Search Seance
          </Button>


      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        nowIndicator={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        slotMinTime="07:00:00"
        slotMaxTime="19:00:00"
        allDaySlot={false}
        height="auto"
      />
    </div>

    <AddSheet
        open={dialogOpenAd}
        teaching={teaching}
        onOpenChange={setDialogOpenAd}
        setrefresh={setrefresh}
        refresh={refresh}
      />

    </>
  );
}