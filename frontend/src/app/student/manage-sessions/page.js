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
import CustomCalendar from "@/app/teacher/manage-sessions/(components)/(clander)/CustomCalendar";
import { Connect_Student } from "@/components/Api/student/Student";
import { getApiErrorMessage, isUnauthorized } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Page() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    let active = true;
    Connect_Student.sessions()
      .then((r) => {
        if (active) setSessions(r.data?.data ?? []);
      })
      .catch((error) => {
        if (isUnauthorized(error)) router.push("/login");
        else
          toast.error("Impossible de charger les séances", {
            description: getApiErrorMessage(error),
          });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);
  return (
    <main className="space-y-6 px-4 py-5 sm:px-10">
      <div>
        <h1 className="text-3xl font-bold">Mes Séances</h1>
        <p className="text-muted-foreground">
          Votre emploi du temps hebdomadaire.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">
          Chargement du calendrier...
        </div>
      ) : (
        <CustomCalendar
          sessionsData={sessions}
          onSessionClick={(session) =>
            toast.info(`${session.subject_name} · ${session.day}`, {
              description: `${session.start_time} – ${session.end_time}${session.room_name ? ` · ${session.room_name}` : ""}`,
            })
          }
        />
      )}
    </main>
  );
}
export default function SessionsPage() {
  return (
    <RoleGuard role="student">
      <Page />
    </RoleGuard>
  );
}
