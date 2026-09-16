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
  {
    accessorKey: "id",
    header: "Id",
  },
  { accessorKey: "student_firstname", header: "Student First Name" },
  { accessorKey: "student_lastname", header: "Student Last Name" },
  { accessorKey: "classe_name", header: "Classe Name" },
  { accessorKey: "student_email", header: "Student Email" },
  { accessorKey: "school_year_name", header: "School Year Name" },
  { accessorKey: "updated_at", header: "Updated at" },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const parent = row.original;

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
                  navigator.clipboard.writeText(parent.id.toString())
                }
              >
                Copier l&apos;Id
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
