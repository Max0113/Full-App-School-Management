"use client";

export const getColumns = () => [
  { id: "parent", header: "Parent", cell: ({ row }) => `${row.original.parent_firstname ?? ""} ${row.original.parent_lastname ?? ""}`.trim() || "—" },
  { id: "student", header: "Élève", cell: ({ row }) => `${row.original.student_firstname ?? ""} ${row.original.student_lastname ?? ""}`.trim() || "—" },
  { accessorKey: "parent_email", header: "E-mail" },
  { accessorKey: "parent_phone", header: "Téléphone" },
];
