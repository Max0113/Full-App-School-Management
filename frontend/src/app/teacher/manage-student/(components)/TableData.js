"use client";
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { useRouter } from "next/navigation";
import CreateTable from "@/components/Table/CreateTable";
import { Connect_MyInfo } from "@/components/Api/teacher/Enseignement";
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

/*
levels,
specialites,
school_years,
*/

export function TableData() {
  const [data, Setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouter();
  const [refresh, setrefresh] = useState(false);

  const columns = getColumns();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await Connect_MyInfo.getMyStudents();
        if (!active) return;
        Setdata(res.data.data.data);
      } catch (error) {
        if (!active) return;
        if (isUnauthorized(error)) {
          route.push("/login");
          return;
        }
        toast.error("Impossible de charger les classes", {
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
  }, [refresh, route]);

  return (
    <>
      <CreateTable
        data={data}
        columns={columns}
      />
    </>
  );
}
