"use client";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TYPE_LABELS = {
  written: "Écrit",
  oral: "Oral",
  practical: "Pratique",
};

export const getColumns = (handleEditClick, handleDeleteClick) => [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "name", header: "Nom" },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => TYPE_LABELS[row.original.type] ?? row.original.type,
  },
  { accessorKey: "exam_date", header: "Date" },
  { accessorKey: "subject_name", header: "Matière" },
  { accessorKey: "classe_name", header: "Classe" },
  {
    id: "teacher",
    header: "Enseignant",
    cell: ({ row }) =>
      `${row.original.teacher_firstname ?? ""} ${
        row.original.teacher_lastname ?? ""
      }`.trim(),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const exam = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-white/10 transition-colors">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(exam.id.toString())
                }
              >
                Copier l&apos;Id
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditClick(exam)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => handleDeleteClick(exam)}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
