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

export const getColumns = (handleEditClick, handleDeleteClick) => [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "exam_name", header: "Examen" },
  { accessorKey: "subject_name", header: "Matière" },
  {
    id: "student",
    header: "Étudiant",
    cell: ({ row }) =>
      `${row.original.student_firstname ?? ""} ${
        row.original.student_lastname ?? ""
      }`.trim(),
  },
  { accessorKey: "note", header: "Note" },
  { accessorKey: "appreciation", header: "Appréciation" },
  { accessorKey: "exam_date", header: "Date" },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const grade = row.original;

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
                  navigator.clipboard.writeText(grade.id.toString())
                }
              >
                Copier l&apos;Id
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditClick(grade)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => handleDeleteClick(grade)}
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
