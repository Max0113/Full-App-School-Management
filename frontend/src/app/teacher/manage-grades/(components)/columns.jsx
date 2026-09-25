"use client";

import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const getColumns = (onEdit, onDelete) => [
  {
    id: "student",
    header: "Élève",
    cell: ({ row }) => `${row.original.student_firstname ?? ""} ${row.original.student_lastname ?? ""}`.trim() || "—",
  },
  { accessorKey: "classe_name", header: "Classe" },
  { accessorKey: "subject_name", header: "Matière" },
  { accessorKey: "exam_name", header: "Examen" },
  {
    accessorKey: "note",
    header: "Note /20",
    cell: ({ row }) => row.original.note ?? "—",
  },
  {
    accessorKey: "appreciation",
    header: "Appréciation",
    cell: ({ row }) => row.original.appreciation || "—",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"><span className="sr-only">Actions</span><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit(row.original)}>Modifier</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={() => onDelete(row.original)}>Supprimer</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
