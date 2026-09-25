"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/RoleGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Connect_Parent } from "@/components/Api/parent/Parent";
import CustomCalendar from "@/app/teacher/manage-sessions/(components)/(clander)/CustomCalendar";
import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    if (!selectedChild) {
      setSessions([]);
      return;
    }
    let active = true;
    setIsLoading(true);
    Connect_Parent.sessions(selectedChild)
      .then((response) => {
        if (active) setSessions(response.data?.data ?? []);
      })
      .catch((error) => {
        if (isUnauthorized(error)) router.push("/login");
        else
          toast.error("Impossible de charger les séances", {
            description: getApiErrorMessage(error),
          });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedChild, router]);

  const child = children.find((item) => String(item.id) === selectedChild);
  return (
    <main className="space-y-6 px-10 py-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendrier & séances</h1>
          <p className="text-muted-foreground">
            Emploi du temps de vos enfants.
          </p>
        </div>
        <div>
          <Select
            value={selectedChild}
            onValueChange={setSelectedChild}
            disabled={isLoading && !children.length}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un enfant" />
            </SelectTrigger>
            <SelectContent>
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

      <div className="space-y-6">
        {selectedChild && !isLoading ? (
          <CustomCalendar
            sessionsData={sessions}
            selectedClasse={
              child?.classe_name ? { name: child.classe_name } : null
            }
            onSessionClick={(session) =>
              toast.info(`${session.subject_name} · ${session.day}`, {
                description: `${session.start_time} – ${session.end_time}${session.room_name ? ` · ${session.room_name}` : ""}`,
              })
            }
          />
        ) : (
          <div className="py-16 text-center text-muted-foreground">
            {isLoading
              ? "Chargement du calendrier..."
              : "Aucune séance disponible."}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SessionsPage() {
  return (
    <RoleGuard role="parent">
      <Page />
    </RoleGuard>
  );
}
