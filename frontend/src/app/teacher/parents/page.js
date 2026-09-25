"use client";

import { RoleGuard } from "@/components/RoleGuard";
import { TableData } from "./(components)/TableData";

function ParentsPage() {
  return (
    <main className="px-10 py-5">
      <div className="mb-9">
        <h1 className="mb-1 text-3xl font-bold">Parents des élèves 👨‍👩‍👧‍👦</h1>
        <p className="text-sm text-muted-foreground">
          Consultez les contacts des parents des élèves de vos classes.
        </p>
      </div>
      <TableData />
    </main>
  );
}

export default function ManageParents() {
  return (
    <RoleGuard role="teacher">
      <ParentsPage />
    </RoleGuard>
  );
}
