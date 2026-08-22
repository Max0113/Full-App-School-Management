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

export const getColumns = (
  handleEditClick,
  handleDeleteClick,
  handleJustifyClick,
) => [
  { accessorKey: "id", header: "Id" },
  {
    id: "student",
    header: "Étudiant",
    cell: ({ row }) =>
      `${row.original.student_firstname ?? ""} ${
        row.original.student_lastname ?? ""
      }`.trim(),
  },
  { accessorKey: "classe_name", header: "Classe" },
  { accessorKey: "start_time", header: "Début" },
  { accessorKey: "end_time", header: "Fin" },
  {
    accessorKey: "justified",
    header: "Justification",
    cell: ({ row }) =>
      row.original.justified ? (
        <span className="text-green-600 font-medium">Justifiée</span>
      ) : (
        <span className="text-red-500 font-medium">Non justifiée</span>
      ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const absence = row.original;

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
                  navigator.clipboard.writeText(absence.id.toString())
                }
              >
                Copier l&apos;Id
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditClick(absence)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleJustifyClick(absence)}>
                Basculer justification
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => handleDeleteClick(absence)}
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
