"use client";
import { useState } from "react";
import { getColumns } from "./columns";
import { EditSheet } from "./(forms)/EditSheet";
import { DeleteDialog } from "./(forms)/DeleteDialog";
import CreateTable from "@/components/Table/CreateTable";
import { toast } from "sonner";

export function TableData({
  sessionsData = [],
  selectedClasse = null,
  teaching = [],
  onRefresh,
  onAddClick,
}) {
  const [editingdata, setEditingdata] = useState(null);
  const [dialogOpenEd, setDialogOpenEd] = useState(false);
  const [dialogOpenDe, setDialogOpenDe] = useState(false);

  const data = Array.isArray(sessionsData) ? sessionsData : [];

  const handleEditClick = (info) => {
    setEditingdata(info);
    setDialogOpenEd(true);
  };

  const handleAddClick = () => {
    if (!selectedClasse) {
      toast.error("Choisis une classe d'abord", {
        description: "Sélectionnez une classe avant d'ajouter une séance.",
      });
      return;
    }
    if (onAddClick) onAddClick();
  };

  const handleDeleteClick = (info) => {
    setEditingdata(info);
    setDialogOpenDe(true);
  };

  const columns = getColumns(handleEditClick, handleDeleteClick);

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
  };

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
        selectedClasse={selectedClasse}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        onRefresh={handleRefresh}
      />

      <DeleteDialog
        data={editingdata}
        open={dialogOpenDe}
        onOpenChange={setDialogOpenDe}
        onRefresh={handleRefresh}
      />
    </>
  );
}
