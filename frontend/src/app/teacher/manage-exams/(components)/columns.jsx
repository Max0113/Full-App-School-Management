"use client";

import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const EXAM_TYPES = { written: "Écrit", oral: "Oral", practical: "Pratique" };

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("fr-FR").format(date);
}

export const getColumns = (onEdit, onDelete) => [
  { accessorKey: "name", header: "Examen" },
  { accessorKey: "classe_name", header: "Classe" },
  { accessorKey: "subject_name", header: "Matière" },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => EXAM_TYPES[row.original.type] ?? row.original.type ?? "—",
  },
  {
    accessorKey: "exam_date",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.exam_date),
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
