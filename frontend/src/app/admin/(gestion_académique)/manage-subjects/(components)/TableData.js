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
} from "@/components/Api/SchoolSetting";
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

/*
specialites,
*/

export function TableData() {
  const [data, Setdata] = useState([]);
  const [specialites, Setspecialites] = useState([]);
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
        const res = await Connect_Subject.getallsubject();
        const res2 = await Connect_Speialite.getallspeialite();
        if (!active) return;
        Setdata(res.data.data);
        Setspecialites(res2.data.data);
      } catch (error) {
        if (!active) return;
        if (isUnauthorized(error)) {
          route.push("/login");
          return;
        }
        toast.error("Impossible de charger les matieres", {
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
        title={"Matieres"}
      />
      <EditSheet
        data={editingdata}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        specialites={specialites}
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
        specialites={specialites}
        onOpenChange={setDialogOpenAd}
        setrefresh={setrefresh}
        refresh={refresh}
      />
    </>
  );
}
