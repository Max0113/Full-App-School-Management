"use client";
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { useRouter } from "next/navigation";
import { Connect_Parents, Connect_Students } from "@/components/Api/Connect";
import { EditSheet } from "./(forms)/EditSheet";
import { AddSheet } from "./(forms)/AddSheet";
import { DeleteDialog } from "./(forms)/DeleteDialog";
import CreateTable from "@/components/Table/CreateTable";
import { Connect_Classe } from "@/components/Api/SchoolSetting";

export function TableData() {
  const [data, Setdata] = useState([]);
  const [parent, Setparent] = useState([]);
  const [classe, Setclasse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const [editingParent, setEditingParent] = useState(null);
  const [dialogOpenEd, setDialogOpenEd] = useState(false);
  const [dialogOpenAd, setDialogOpenAd] = useState(false);
  const [dialogOpenDe, setDialogOpenDe] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const handleEditClick = (parent) => {
    setEditingParent(parent);
    setDialogOpenEd(true);
  };

  const handleAddClick = () => {
    setDialogOpenAd(true);
  };

  const handleDeleteClick = (parent) => {
    setEditingParent(parent);
    setDialogOpenDe(true);
  };

  const columns = getColumns(handleEditClick, handleDeleteClick);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await Connect_Students.getallstudents();
      const pare = await Connect_Parents.getallparents();
      const clas = await Connect_Classe.getallclasse();
      Setparent(pare.data.data);
      Setclasse(clas.data.data);
      Setdata(res.data.data);
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
        title={"student"}
      />
      <EditSheet
        data={editingParent}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        parents={parent}
        classes={classe}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <DeleteDialog
        data={editingParent}
        open={dialogOpenDe}
        onOpenChange={setDialogOpenDe}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <AddSheet
        open={dialogOpenAd}
        parents={parent}
        classes={classe}
        onOpenChange={setDialogOpenAd}
        setrefresh={setrefresh}
        refresh={refresh}
      />
    </>
  );
}
