"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/RoleGuard";
import { Connect_Parent } from "@/components/Api/parent/Parent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import { toast } from "sonner";
import { TableData } from "./(components)/TableData";

function Page() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    Connect_Parent.children()
      .then((response) => {
        if (!active) return;
        const result = response.data?.data ?? [];
        setChildren(result);
        setSelectedChild(result[0] ? String(result[0].id) : "");
      })
      .catch((error) => {
        if (isUnauthorized(error)) router.push("/login");
        else toast.error("Impossible de charger les enfants", { description: getApiErrorMessage(error) });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  return <main className="space-y-6 px-10 py-5"><div className="flex items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">Absences</h1><p className="text-muted-foreground">Consultez les absences de l'enfant sélectionné.</p></div><Select value={selectedChild} onValueChange={setSelectedChild} disabled={isLoading && !children.length}><SelectTrigger className="min-w-[250px]"><SelectValue placeholder="Sélectionner un enfant" /></SelectTrigger><SelectContent>{children.map((child) => <SelectItem key={child.id} value={String(child.id)}>{child.firstname} {child.lastname}{child.classe_name ? ` — ${child.classe_name}` : ""}</SelectItem>)}</SelectContent></Select></div><TableData selectedChild={selectedChild} /></main>;
}

export default function AbsencesPage() {
  return <RoleGuard role="parent"><Page /></RoleGuard>;
}
