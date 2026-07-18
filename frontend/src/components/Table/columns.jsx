"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const afficher = (parent) => {
  console.log(parent);
};

export const getColumns = (handleEditClick, handleDeleteClick) => [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "firstname", header: "First name" },
  { accessorKey: "lastname", header: "Last name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "gender", header: "Gender" },
  { accessorKey: "blood_type", header: "Blood type" },
  { accessorKey: "date_of_birth", header: "Date of birth" },
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
                Copier l'Id
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditClick(parent)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => handleDeleteClick(parent)}
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
