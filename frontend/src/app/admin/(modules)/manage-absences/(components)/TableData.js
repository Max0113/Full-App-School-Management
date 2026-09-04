"use client";
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { Connect_Absences } from "@/components/Api/SchoolLife";
import { EditSheet } from "./(forms)/EditSheet";
import { AddSheet } from "./(forms)/AddSheet";
import { DeleteDialog } from "./(forms)/DeleteDialog";
import { JustifyDialog } from "./(forms)/JustifyDialog";
import CreateTable from "@/components/Table/CreateTable";
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const PER_PAGE = 15;

export function TableData({ classeId, refresh: pageRefresh = 0 }) {
  const [data, Setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(null);
  const route = useRouter();
  const [editingdata, SetEditingdata] = useState(null);
  const [dialogOpenEd, setDialogOpenEd] = useState(false);
  const [dialogOpenAd, setDialogOpenAd] = useState(false);
  const [dialogOpenDe, setDialogOpenDe] = useState(false);
  const [justifyTarget, SetJustifyTarget] = useState(null);
  const [dialogOpenJu, setDialogOpenJu] = useState(false);
  const [refresh, setrefresh] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await Connect_Absences.getallabsences({
          page,
          per_page: PER_PAGE,
          ...(classeId ? { classe_id: classeId } : {}),
        });
        if (!active) return;
        const meta = res.data?.meta ?? {};
        Setdata(res.data?.data ?? []);
        setPage(meta.current_page ?? page);
        setLastPage(meta.last_page ?? page);
        setTotal(meta.total ?? null);
      } catch (error) {
        if (!active) return;
        if (isUnauthorized(error)) {
          route.push("/login");
          return;
        }
        toast.error("Impossible de charger les absences", {
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
  }, [page, refresh, classeId, pageRefresh, route]);

  const handleEditClick = (absence) => {
    SetEditingdata(absence);
    setDialogOpenEd(true);
  };

  const handleAddClick = () => {
    setDialogOpenAd(true);
  };

  const handleDeleteClick = (absence) => {
    SetEditingdata(absence);
    setDialogOpenDe(true);
  };

  const handleJustifyClick = (absence) => {
    SetJustifyTarget(absence);
    setDialogOpenJu(true);
  };

  const columns = getColumns(
    handleEditClick,
    handleDeleteClick,
    handleJustifyClick,
  );

  const serverPagination = {
    page,
    lastPage,
    total,
    onPageChange: (nextPage) => {
      if (nextPage === page || nextPage < 1 || nextPage > lastPage) return;
      setIsLoading(true);
      setPage(nextPage);
    },
  };

  return (
    <>
      <CreateTable
        data={data}
        columns={columns}
        title={"absence"}
        handleAddClick={handleAddClick}
        isLoading={isLoading}
        serverPagination={serverPagination}
      />

      <EditSheet
        absence={editingdata}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        setrefresh={setrefresh}
        refresh={refresh}
        selectedClasse={classeId ? { id: classeId } : { id: null }}
      />

      <DeleteDialog
        absence={editingdata}
        open={dialogOpenDe}
        onOpenChange={setDialogOpenDe}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <JustifyDialog
        absence={justifyTarget}
        open={dialogOpenJu}
        onOpenChange={setDialogOpenJu}
        refresh={refresh}
        setrefresh={setrefresh}
      />

      <AddSheet
        open={dialogOpenAd}
        onOpenChange={setDialogOpenAd}
        setrefresh={setrefresh}
        refresh={refresh}
        selectedClasse={classeId ? { id: classeId } : { id: null }}
      />
    </>
  );
}
