"use client";
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { useRouter } from "next/navigation";
import { EditSheet } from "./(forms)/EditSheet";
import { AddSheet } from "./(forms)/AddSheet";
import { DeleteDialog } from "./(forms)/DeleteDialog";
import CreateTable from "@/components/Table/CreateTable";
import {
  Connect_Subject,
  Connect_Speialite,
  Connect_Classe,
} from "@/components/Api/SchoolSetting";
import { Connect_Teaching } from "@/components/Api/Enseignement";
import { Connect_Teachers } from "@/components/Api/Connect";
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

/*
specialites,
*/

export function TableData() {
  const [data, Setdata] = useState([]);
  const [teachers, Setteachers] = useState([]);
  const [subjects, Setsubjects] = useState([]);
  const [classes, Setclasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouter();
  const [editingdata, setEditingdata] = useState(null);
  const [dialogOpenEd, setDialogOpenEd] = useState(false);
  const [dialogOpenAd, setDialogOpenAd] = useState(false);
  const [dialogOpenDe, setDialogOpenDe] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const handleEditClick = (info) => {
    setEditingdata(info);
    setDialogOpenEd(true);
  };

  const handleAddClick = () => {
    setDialogOpenAd(true);
  };
 
  const handleDeleteClick = (info) => {
    setEditingdata(info);
    setDialogOpenDe(true);
  };
 
  const columns = getColumns(handleEditClick, handleDeleteClick);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await Connect_Teaching.getallteaching();
        const res1 = await Connect_Teachers.getallteachers();
        const res2 = await Connect_Subject.getallsubject();
        const res3 = await Connect_Classe.getallclasse();
        if (!active) return;
        Setdata(res.data.data);
        Setteachers(res1.data.data);
        Setsubjects(res2.data.data);
        Setclasses(res3.data.data);
      } catch (error) {
        if (!active) return;
        if (isUnauthorized(error)) {
          route.push("/login");
          return;
        }
        toast.error("Impossible de charger les enseignements", {
          description: getApiErrorMessage(error),
        });
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [refresh, route]);

  return (
    <>
      <CreateTable
        data={data}
        columns={columns}
        handleAddClick={handleAddClick}
        title={"Enseignements"}
      />
      <EditSheet
        data={editingdata}
        teachers={teachers}
        subjects={subjects}
        classes={classes}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <DeleteDialog
        data={editingdata}
        open={dialogOpenDe}
        onOpenChange={setDialogOpenDe}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <AddSheet
        open={dialogOpenAd}
        teachers={teachers}
        subjects={subjects}
        classes={classes}
        onOpenChange={setDialogOpenAd}
        setrefresh={setrefresh}
        refresh={refresh}
      />
    </>
  );
}
