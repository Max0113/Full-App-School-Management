"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateTable from "@/components/Table/CreateTable";
import { Connect_Parent } from "@/components/Api/parent/Parent";
import { getColumns } from "./columns";
import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import { toast } from "sonner";

export function TableData({ selectedChild }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!selectedChild) {
      setData([]);
      setIsLoading(false);
      return;
    }
    let active = true;
    setIsLoading(true);
    Connect_Parent.absences(selectedChild)
      .then((response) => {
        if (active) setData(response.data?.data ?? []);
      })
      .catch((error) => {
        if (isUnauthorized(error)) router.push("/login");
        else toast.error("Impossible de charger les absences", { description: getApiErrorMessage(error) });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router, selectedChild]);

  return <CreateTable data={data} columns={getColumns()} isLoading={isLoading} />;
}
