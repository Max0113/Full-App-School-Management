"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateTable from "@/components/Table/CreateTable";
import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import { toast } from "sonner";

export function DataTable({ load, columns, errorMessage }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => { let active = true; load().then((response) => { if (active) setData(response.data?.data ?? []); }).catch((error) => { if (isUnauthorized(error)) router.push("/login"); else toast.error(errorMessage, { description: getApiErrorMessage(error) }); }).finally(() => { if (active) setIsLoading(false); }); return () => { active = false; }; }, [errorMessage, load, router]);
  return <CreateTable data={data} columns={columns} isLoading={isLoading} />;
}
