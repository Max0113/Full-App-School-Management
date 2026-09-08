"use client";
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { Connect_Grades } from "@/components/Api/SchoolLife";
import { EditSheet } from "./(forms)/EditSheet";
import { AddSheet } from "./(forms)/AddSheet";
import { DeleteDialog } from "./(forms)/DeleteDialog";
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
  const [refresh, setrefresh] = useState(false);

  const handleEditClick = (grade) => {
    SetEditingdata(grade);
    setDialogOpenEd(true);
  };

  const handleAddClick = () => {
    setDialogOpenAd(true);
  };

  const handleDeleteClick = (grade) => {
    SetEditingdata(grade);
    setDialogOpenDe(true);
  };

  const columns = getColumns(handleEditClick, handleDeleteClick);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await Connect_Grades.getallgrades({
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
        toast.error("Impossible de charger les notes", {
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
  }, [page, refresh, route , classeId, pageRefresh]);

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
        title={"note"}
        handleAddClick={handleAddClick}
        isLoading={isLoading}
        serverPagination={serverPagination}
      />

      <EditSheet
        grade={editingdata}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        setrefresh={setrefresh}
        refresh={refresh}
        selectedClasse={classeId ? { id: classeId } : null}
      />

      <DeleteDialog
        grade={editingdata}
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
        selectedClasse={classeId ? { id: classeId } : null}
      />
    </>
  );
}
