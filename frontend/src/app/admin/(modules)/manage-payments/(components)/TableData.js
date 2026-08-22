"use client";
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { Connect_Payments } from "@/components/Api/SchoolLife";
import { EditSheet } from "./(forms)/EditSheet";
import { AddSheet } from "./(forms)/AddSheet";
import { DeleteDialog } from "./(forms)/DeleteDialog";
import { StatusDialog } from "./(forms)/StatusDialog";
import CreateTable from "@/components/Table/CreateTable";
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const PER_PAGE = 15;

export function TableData() {
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
  const [statusTarget, setStatusTarget] = useState(null);
  const [openStatus, setOpenStatus] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const handleEditClick = (payment) => {
    SetEditingdata(payment);
    setDialogOpenEd(true);
  };

  const handleAddClick = () => {
    setDialogOpenAd(true);
  };

  const handleDeleteClick = (payment) => {
    SetEditingdata(payment);
    setDialogOpenDe(true);
  };

  const handleStatusClick = (payment) => {
    setStatusTarget(payment);
    setOpenStatus(true);
  };

  const columns = getColumns(
    handleEditClick,
    handleDeleteClick,
    handleStatusClick,
  );

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await Connect_Payments.getallpayments({
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
        toast.error("Impossible de charger les paiements", {
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
        title={"paiement"}
        handleAddClick={handleAddClick}
        isLoading={isLoading}
        serverPagination={serverPagination}
      />

      <EditSheet
        payment={editingdata}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <DeleteDialog
        payment={editingdata}
        open={dialogOpenDe}
        onOpenChange={setDialogOpenDe}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <StatusDialog
        payment={statusTarget}
        open={openStatus}
        onOpenChange={setOpenStatus}
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
