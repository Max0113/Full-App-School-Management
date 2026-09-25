"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateTable from "@/components/Table/CreateTable";
import { Connect_Parent } from "@/components/Api/parent/Parent";
import { getColumns } from "./columns";
import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import { toast } from "sonner";

export function TableData() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    let active = true;
    Connect_Parent.exams()
      .then((response) => {
        if (active) setData(response.data?.data ?? []);
      })
      .catch((error) => {
        if (isUnauthorized(error)) router.push("/login");
        else
          toast.error("Impossible de charger les examens", {
            description: getApiErrorMessage(error),
          });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);
  return (
    <CreateTable data={data} columns={getColumns()} isLoading={isLoading} />
  );
}
