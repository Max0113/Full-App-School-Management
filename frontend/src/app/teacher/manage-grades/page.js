"use client";

import { RoleGuard } from "@/components/RoleGuard";
import { TableData } from "./(components)/TableData";

function GradesPage() {
  return (
    <main className="px-10 py-5">
      <div className="mb-9">
        <h1 className="mb-1 text-3xl font-bold">Notes des élèves 📊</h1>
        <p className="text-sm text-muted-foreground">
          Consultez les notes saisies pour vos examens.
        </p>
      </div>
      <TableData />
    </main>
  );
}

export default function ManageGrades() {
  return (
    <RoleGuard role="teacher">
      <GradesPage />
    </RoleGuard>
  );
}
