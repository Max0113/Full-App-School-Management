"use client";

import { Badge } from "@/components/ui/badge";

export const getColumns = () => [
  {
    id: "student",
    header: "Enfant",
    cell: ({ row }) =>
      `${row.original.student_firstname ?? ""} ${row.original.student_lastname ?? ""}`.trim() || "—",
  },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "subject_name", header: "Matière" },
  { accessorKey: "classe_name", header: "Classe" },
  { accessorKey: "day", header: "Jour" },
  {
    id: "time",
    header: "Horaire",
    cell: ({ row }) => `${row.original.start_time ?? "—"} – ${row.original.end_time ?? "—"}`,
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
];
