"use client";

import { Badge } from "@/components/ui/badge";

export const getColumns = () => [
  {
    id: "student",
    header: "Enfant",
    cell: ({ row }) =>
      `${row.original.student_firstname ?? ""} ${row.original.student_lastname ?? ""}`.trim() ||
      "—",
  },
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
];
