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
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

const PER_PAGE = 15;

export function TableData() {
  const [data, Setdata] = useState([]);
  const [parent, Setparent] = useState([]);
  const [classe, Setclasse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(null);
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

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await Connect_Students.getallstudents({
          page,
          per_page: PER_PAGE,
        });
        if (!active) return;
        const meta = res.data?.meta ?? {};
        Setdata(res.data?.data ?? []);
        setPage(meta.current_page ?? page);
        setLastPage(meta.last_page ?? page);
        setTotal(meta.total ?? null);

        const pare = await Connect_Parents.getallparents();
        if (!active) return;
        Setparent(pare.data?.data ?? []);

        const clas = await Connect_Classe.getallclasse();
        if (!active) return;
        Setclasse(clas.data?.data ?? []);
      } catch (error) {
        if (!active) return;
        if (isUnauthorized(error)) {
          route.push("/login");
          return;
        }
        toast.error("Impossible de charger les élèves", {
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
  }, [page, refresh, route]);

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
        handleAddClick={handleAddClick}
        title={"student"}
        isLoading={isLoading}
        serverPagination={serverPagination}
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
