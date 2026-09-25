"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateTable from "@/components/Table/CreateTable";
import { Connect_MyAssessments } from "@/components/Api/teacher/Enseignement";
import { getColumns } from "./columns";
import { ExamSheet } from "./ExamSheet";
import { DeleteDialog } from "./DeleteDialog";
import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import { toast } from "sonner";

const PER_PAGE = 15;

export function TableData() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [selectedExam, setSelectedExam] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    async function loadExams() {
      setIsLoading(true);
      try {
        const response = await Connect_MyAssessments.getMyExams({ page, per_page: PER_PAGE });
        if (!active) return;
        const result = response.data?.data ?? {};
        setData(result.data ?? []);
        setPage(result.current_page ?? page);
        setLastPage(result.last_page ?? 1);
        setTotal(result.total ?? null);
      } catch (error) {
        if (!active) return;
        if (isUnauthorized(error)) {
          router.push("/login");
          return;
        }
        toast.error("Impossible de charger les examens", { description: getApiErrorMessage(error) });
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadExams();
    return () => { active = false; };
  }, [page, refresh, router]);

  const openCreate = () => {
    setSelectedExam(null);
    setSheetOpen(true);
  };
  const openEdit = (exam) => {
    setSelectedExam(exam);
    setSheetOpen(true);
  };
  const openDelete = (exam) => {
    setSelectedExam(exam);
    setDeleteOpen(true);
  };

  return (
    <>
    <CreateTable
      data={data}
      columns={getColumns(openEdit, openDelete)}
      title="examen"
      handleAddClick={openCreate}
      isLoading={isLoading}
      serverPagination={{
        page,
        lastPage,
        total,
        onPageChange: (nextPage) => setPage(nextPage),
      }}
    />
      <ExamSheet
        exam={selectedExam}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSaved={() => setRefresh((value) => value + 1)}
      />
      <DeleteDialog
        exam={selectedExam}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => setRefresh((value) => value + 1)}
      />
    </>
  );
}
