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
import { Connect_Sessions, Connect_Teaching } from "@/components/Api/Enseignement";
import { Connect_Teachers } from "@/components/Api/Connect";
import { IoArrowUpCircle } from "react-icons/io5";

/*
specialites,
*/

export function TableData() {
  const [data, Setdata] = useState([]);
  const [teaching, Setteaching] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await Connect_Sessions.getallsessions();      
      const res1 = await Connect_Teaching.getallteaching();
      Setdata(res.data.data);
      Setteaching(res1.data.data);
    } catch (error) {
      console.error(error);
      route.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [refresh]);

  return (
    <>
      <CreateTable
        data={data}
        columns={columns}
        handleAddClick={handleAddClick}
        title={"Seance"}
      />
      <EditSheet
        data={editingdata}
        teaching={teaching}
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
        teaching={teaching}
        onOpenChange={setDialogOpenAd}
        setrefresh={setrefresh}
        refresh={refresh}
      />
    </>
  );
}
