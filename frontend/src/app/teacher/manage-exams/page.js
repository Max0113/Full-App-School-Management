"use client";

import { RoleGuard } from "@/components/RoleGuard";
import { TableData } from "./(components)/TableData";

function ExamsPage() {
  return (
    <main className="px-10 py-5">
      <div className="mb-9">
        <h1 className="mb-1 text-3xl font-bold">Mes examens 🎰</h1>
        <p className="text-sm text-muted-foreground">
          Consultez les examens de vos classes et matières.
        </p>
      </div>
      <TableData />
    </main>
  );
}

export default function ManageExams() {
  return (
    <RoleGuard role="teacher">
      <ExamsPage />
    </RoleGuard>
  );
}
