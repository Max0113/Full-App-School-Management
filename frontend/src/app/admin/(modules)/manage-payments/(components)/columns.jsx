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
  cash: "Espèces",
  online: "En ligne",
};

const STATUS_CONFIG = {
  pending: { label: "En attente", className: "text-orange-500 font-medium" },
  in_progress: { label: "En cours", className: "text-blue-500 font-medium" },
  completed: { label: "Complété", className: "text-green-600 font-medium" },
};

export const getColumns = (
  handleEditClick,
  handleDeleteClick,
  handleStatusClick,
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
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => `${row.original.amount} DH`,
  },
  { accessorKey: "date_payment", header: "Date paiement" },
  {
    accessorKey: "type_payment",
    header: "Type",
    cell: ({ row }) =>
      TYPE_LABELS[row.original.type_payment] ?? row.original.type_payment,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const config = STATUS_CONFIG[row.original.status];
      if (!config) return row.original.status;
      return <span className={config.className}>{config.label}</span>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const payment = row.original;

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
                  navigator.clipboard.writeText(payment.id.toString())
                }
              >
                Copier l&apos;Id
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditClick(payment)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusClick(payment)}>
                Changer le statut
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => handleDeleteClick(payment)}
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
