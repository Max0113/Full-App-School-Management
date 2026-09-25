"use client";

import { Badge } from "@/components/ui/badge";

const TYPES = { written: "Écrit", oral: "Oral", practical: "Pratique" };

export const getColumns = () => [
  { id: "student", header: "Enfant", cell: ({ row }) => `${row.original.student_firstname ?? ""} ${row.original.student_lastname ?? ""}`.trim() || "—" },
  { accessorKey: "name", header: "Examen" },
  { accessorKey: "subject_name", header: "Matière" },
  { accessorKey: "exam_date", header: "Date" },
  { accessorKey: "type", header: "Type", cell: ({ row }) => <Badge variant="secondary">{TYPES[row.original.type] ?? row.original.type}</Badge> },
  { id: "result", header: "Résultat", cell: ({ row }) => row.original.note === null ? <span className="text-muted-foreground">En attente</span> : <Badge>{row.original.note}/20</Badge> },
];
