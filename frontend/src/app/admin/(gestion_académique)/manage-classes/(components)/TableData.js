"use client";
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { useRouter } from "next/navigation";
import { EditSheet } from "./(forms)/EditSheet";
import { AddSheet } from "./(forms)/AddSheet";
import { DeleteDialog } from "./(forms)/DeleteDialog";
import CreateTable from "@/components/Table/CreateTable";
import {
  Connect_Classe,
  Connect_Level,
  Connect_Speialite,
  Connect_SchoolYear,
} from "@/components/Api/SchoolSetting";

/*
levels,
specialites,
school_years,
*/

export function TableData() {
  const [data, Setdata] = useState([]);
  const [levels, Setlevels] = useState([]);
  const [specialites, Setspecialites] = useState([]);
  const [school_years, Setschool_years] = useState([]);
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
      const res = await Connect_Classe.getallclasse();
      const res1 = await Connect_Level.getalllevel();
      const res2 = await Connect_Speialite.getallspeialite();
      const res3 = await Connect_SchoolYear.getallschoolyear();
      Setdata(res.data.data);
      Setlevels(res1.data.data);
      Setspecialites(res2.data.data);
      Setschool_years(res3.data.data);
      console.log(data);
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
        data={editingdata}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        levels={levels}
        specialites={specialites}
        school_years={school_years}
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
        levels={levels}
        specialites={specialites}
        school_years={school_years}
        onOpenChange={setDialogOpenAd}
        setrefresh={setrefresh}
        refresh={refresh}
      />
    </>
  );
}
