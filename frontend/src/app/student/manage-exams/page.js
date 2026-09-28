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

const TYPES = { written: "Écrit", oral: "Oral", practical: "Pratique" };
function Page() {
  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Examen" },
      { accessorKey: "subject_name", header: "Matière" },
      { accessorKey: "exam_date", header: "Date" },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {TYPES[row.original.type] ?? row.original.type}
          </Badge>
        ),
      },
      {
        id: "result",
        header: "Résultat",
        cell: ({ row }) =>
          row.original.note === null ? (
            <span className="text-muted-foreground">En attente</span>
          ) : (
            <Badge>{row.original.note}/20</Badge>
          ),
      },
      {
        id: "reminder",
        header: "Rappel",
        cell: ({ row }) =>
          new Date(row.original.exam_date) >=
          new Date(new Date().toDateString()) ? (
            <Badge variant="outline">À venir</Badge>
          ) : (
            "—"
          ),
      },
    ],
    [],
  );
  return (
    <main className="space-y-6 px-4 py-5 sm:px-10">
      <div>
        <h1 className="text-3xl font-bold">Mes Examens</h1>
        <p className="text-muted-foreground">
          Examens à venir et résultats publiés.
        </p>
      </div>

      <DataTable
        load={Connect_Student.exams}
        columns={columns}
        errorMessage="Impossible de charger les examens"
      />
    </main>
  );
}
export default function ExamsPage() {
  return (
    <RoleGuard role="student">
      <Page />
    </RoleGuard>
  );
}
