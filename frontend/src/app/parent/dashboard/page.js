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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CalendarDays, Users } from "lucide-react";
import { Connect_Parent } from "@/components/Api/parent/Parent";
import { toast } from "sonner";

function Page() {
  const [data, setData] = useState(null);
  useEffect(() => {
    Connect_Parent.dashboard()
      .then((r) => setData(r.data?.data ?? {}))
      .catch(() => toast.error("Impossible de charger le tableau de bord."));
  }, []);
  const stats = [
    { label: "Enfants", value: data?.children?.length ?? 0, icon: Users },
    { label: "Notifications", value: data?.notifications ?? 0, icon: Bell },
    {
      label: "Examens à venir",
      value: data?.upcoming_exams?.length ?? 0,
      icon: CalendarDays,
    },
  ];
  return (
    <main className="space-y-6 px-10 py-5">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord parent</h1>
        <p className="text-muted-foreground">
          Suivez les informations importantes de vos enfants.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex-row items-center justify-between">
              <CardDescription>{label}</CardDescription>
              <Icon className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data ? value : <Skeleton className="h-8 w-12" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mes enfants</CardTitle>
            <CardDescription>Enfants associés à votre compte.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.children?.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <p className="font-medium">
                  {child.firstname} {child.lastname}
                </p>
                <Badge variant="secondary">Élève</Badge>
              </div>
            )) ?? <Skeleton className="h-20 w-full" />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prochains examens</CardTitle>
            <CardDescription>Les cinq prochains examens.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.upcoming_exams?.length ? (
              data.upcoming_exams.map((exam) => (
                <div
                  key={`${exam.id}-${exam.student_id}`}
                  className="flex justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{exam.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.student_firstname} {exam.student_lastname} ·{" "}
                      {exam.subject_name}
                    </p>
                  </div>
                  <Badge variant="outline">{exam.exam_date}</Badge>
                </div>
              ))
            ) : data ? (
              <p className="text-sm text-muted-foreground">
                Aucun examen à venir.
              </p>
            ) : (
              <Skeleton className="h-20 w-full" />
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Notes récentes</CardTitle>
          <CardDescription>Les dernières notes enregistrées.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data?.recent_grades?.length ? (
            data.recent_grades.map((grade, index) => (
              <div
                key={`${grade.exam_name}-${index}`}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">
                    {grade.student_firstname} {grade.student_lastname} ·{" "}
                    {grade.subject_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {grade.exam_name}
                    {grade.appreciation ? ` — ${grade.appreciation}` : ""}
                  </p>
                </div>
                <Badge>{grade.note}/20</Badge>
              </div>
            ))
          ) : data ? (
            <p className="text-sm text-muted-foreground">
              Aucune note récente.
            </p>
          ) : (
            <Skeleton className="h-20 w-full" />
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function ParentDashboard() {
  return (
    <RoleGuard role="parent">
      <Page />
    </RoleGuard>
  );
}
