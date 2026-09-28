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
      { accessorKey: "subject_name", header: "Matière" },
      { accessorKey: "exam_name", header: "Évaluation" },
      { accessorKey: "exam_date", header: "Date" },
      {
        accessorKey: "note",
        header: "Note /20",
        cell: ({ row }) => <Badge>{row.original.note}/20</Badge>,
      },
      {
        accessorKey: "appreciation",
        header: "Appréciation",
        cell: ({ row }) => row.original.appreciation || "—",
      },
    ],
    [],
  );
  return (
    <main className="space-y-6 px-4 py-5 sm:px-10">
      <div>
        <h1 className="text-3xl font-bold">Mes Notes</h1>
        <p className="text-muted-foreground">
          Vos évaluations organisées par matière.
        </p>
      </div>
      <DataTable
        load={Connect_Student.grades}
        columns={columns}
        errorMessage="Impossible de charger les notes"
      />
    </main>
  );
}
export default function GradesPage() {
  return (
    <RoleGuard role="student">
      <Page />
    </RoleGuard>
  );
}
