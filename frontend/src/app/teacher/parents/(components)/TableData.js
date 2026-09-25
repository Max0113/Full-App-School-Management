"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateTable from "@/components/Table/CreateTable";
import { Connect_MyAssessments } from "@/components/Api/teacher/Enseignement";
import { getColumns } from "./columns";
import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import { toast } from "sonner";

const PER_PAGE = 15;

export function TableData() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await Connect_MyAssessments.getMyParents({ page, per_page: PER_PAGE });
        if (!active) return;
        const result = response.data?.data ?? {};
        setData(result.data ?? []);
        setPage(result.current_page ?? page);
        setLastPage(result.last_page ?? 1);
        setTotal(result.total ?? null);
      } catch (error) {
        if (!active) return;
        if (isUnauthorized(error)) { router.push("/login"); return; }
        toast.error("Impossible de charger les parents", { description: getApiErrorMessage(error) });
      } finally { if (active) setIsLoading(false); }
    };
    load();
    return () => { active = false; };
  }, [page, router]);

  return <CreateTable data={data} columns={getColumns()} isLoading={isLoading} serverPagination={{ page, lastPage, total, onPageChange: setPage }} />;
}
