"use client";
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { useRouter } from "next/navigation";
import { Connect_Teachers } from "@/components/Api/Connect";
import { EditSheet } from "./(forms)/EditSheet";
import { AddSheet } from "./(forms)/AddSheet";
import { DeleteDialog } from "./(forms)/DeleteDialog";
import CreateTable from "@/components/Table/CreateTable";

export function TableData() {
  const [data, Setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const [editingteacher, SetEditingteacher] = useState(null);
  const [dialogOpenEd, setDialogOpenEd] = useState(false);
  const [dialogOpenAd, setDialogOpenAd] = useState(false);
  const [dialogOpenDe, setDialogOpenDe] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const handleEditClick = (data) => {
    SetEditingteacher(data);
    setDialogOpenEd(true);
  };

  const handleAddClick = () => {
    setDialogOpenAd(true);
  };

  const handleDeleteClick = (data) => {
    SetEditingteacher(data);
    setDialogOpenDe(true);
  };

  const columns = getColumns(handleEditClick, handleDeleteClick);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await Connect_Teachers.getallteachers();
      Setdata(res.data);
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
        title={"teacher"}
        handleAddClick={handleAddClick}
      />

      <EditSheet
        teacher={editingteacher}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <DeleteDialog
        teacher={editingteacher}
        open={dialogOpenDe}
        onOpenChange={setDialogOpenDe}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <AddSheet
        open={dialogOpenAd}
        onOpenChange={setDialogOpenAd}
        setrefresh={setrefresh}
        refresh={refresh}
      />
    </>
  );
}
