"use client";
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { useRouter } from "next/navigation";
import { Connect_Parents } from "@/components/Api/Connect";
import { EditSheet } from "./(forms)/EditSheet";
import { AddSheet } from "./(forms)/AddSheet";
import { DeleteDialog } from "./(forms)/DeleteDialog";
import CreateTable from "@/components/Table/CreateTable";
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

const PER_PAGE = 15;

export function TableData() {
  const [data, Setdata] = useState([]);
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
        const res = await Connect_Parents.getallparents({
          page,
          per_page: PER_PAGE,
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
        toast.error("Impossible de charger les parents", {
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
        title={"parent"}
        handleAddClick={handleAddClick}
        isLoading={isLoading}
        serverPagination={serverPagination}
      />

      <EditSheet
        parent={editingParent}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <DeleteDialog
        parent={editingParent}
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
