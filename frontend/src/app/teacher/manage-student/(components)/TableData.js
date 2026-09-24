"use client";
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { useRouter } from "next/navigation";
import CreateTable from "@/components/Table/CreateTable";
import { Connect_MyInfo } from "@/components/Api/teacher/Enseignement";
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

const PER_PAGE = 15;

export function TableData({ refresh, classeId }) {
  const [data, Setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(null);
  const route = useRouter();

  const columns = getColumns();

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await Connect_MyInfo.getMyStudents({
          page,
          per_page: PER_PAGE,
          ...(classeId ? { classe_id: classeId } : {}),
        });
        if (!active) return;
        const students = res.data?.data;
        const meta = res.data?.meta ?? students ?? {};
        Setdata(students?.data ?? []);
        setPage(meta.current_page ?? page);
        setLastPage(meta.last_page ?? page);
        setTotal(meta.total ?? null);
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
  }, [classeId, page, refresh, route]);

  const serverPagination = {
    page,
    lastPage,
    total,
    onPageChange: (nextPage) => {
      if (nextPage === page || nextPage < 1 || nextPage > lastPage) return;
      setPage(nextPage);
    },
  };

  return (
    <>
      <CreateTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        serverPagination={serverPagination}
      />
    </>
  );
}
