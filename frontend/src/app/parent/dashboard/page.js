"use client";
import React from "react";
import { useAuth } from "@/components/Context/AuthContext";
import { RoleGuard } from "@/components/RoleGuard";

function Page() {
  const { user } = useAuth();

  return (
    <main className="px-10">
      <h1 className="text-3xl font-bold py-10">Welcome to dashboard</h1>

      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="min-w-full shadow-lg overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">ID</th>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b transition">
              <td className="px-6 py-4">{user?.id}</td>
              <td className="px-6 py-4">
                {(user?.firstname ?? "") + " " + (user?.lastname ?? "")}
              </td>
              <td className="px-6 py-4">{user?.email}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default function ParentDashboard() {
  return (
    <RoleGuard role="parent">
      <Page />
    </RoleGuard>
  );
}
