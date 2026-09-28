"use client";

import { useMemo } from "react";
import { RoleGuard } from "@/components/RoleGuard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Connect_Student } from "@/components/Api/student/Student";
import { DataTable } from "../(components)/DataTable";

function Page() {
  const columns = useMemo(
    () => [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "subject_name", header: "Matière" },
      { accessorKey: "day", header: "Jour" },
      {
        id: "time",
        header: "Horaire",
        cell: ({ row }) =>
          `${row.original.start_time} – ${row.original.end_time}`,
      },
      {
        accessorKey: "justified",
        header: "Statut",
        cell: ({ row }) =>
          row.original.justified ? (
            <Badge variant="secondary">Justifiée</Badge>
          ) : (
            <Badge variant="destructive">Non justifiée</Badge>
          ),
      },
    ],
    [],
  );
  return (
    <main className="space-y-6 px-4 py-5 sm:px-10">
      <div>
        <h1 className="text-3xl font-bold">Mes Absences</h1>
        <p className="text-muted-foreground">
          Historique de vos absences enregistrées.
        </p>
      </div>
      <DataTable
        load={Connect_Student.absences}
        columns={columns}
        errorMessage="Impossible de charger les absences"
      />
    </main>
  );
}
export default function AbsencesPage() {
  return (
    <RoleGuard role="student">
      <Page />
    </RoleGuard>
  );
}
