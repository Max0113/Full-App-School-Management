"use client";
import { RoleGuard } from "@/components/RoleGuard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Connect_Parent } from "@/components/Api/parent/Parent";
import { useEffect, useState } from "react";
import { TableData } from "./(components)/TableData";
import { useRouter } from "next/navigation";
import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import { toast } from "sonner";

function Page() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [sessions, setSessions] = useState([]);
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
        else
          toast.error("Impossible de charger les enfants", {
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
    <main className="space-y-6 px-10 py-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Examens</h1>
          <p className="text-muted-foreground">
            Examens passés et à venir, avec les résultats publiés.
          </p>
        </div>
        <div>
          <Select
            value={selectedChild}
            onValueChange={setSelectedChild}
            disabled={isLoading && !children.length}
          >
            <SelectTrigger className="min-w-[250px]">
              <SelectValue placeholder="Sélectionner un enfant" />
            </SelectTrigger>
            <SelectContent className="min-w-[250px]">
              {children.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.firstname} {item.lastname}
                  {item.classe_name ? ` — ${item.classe_name}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <TableData
        selectedChild={selectedChild}
        setSelectedChild={setSelectedChild}
      />
    </main>
  );
}

export default function ExamsPage() {
  return (
    <RoleGuard role="parent">
      <Page />
    </RoleGuard>
  );
}
