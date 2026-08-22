"use client";
import React from "react";
import { TableData } from "./(components)/TableData";

function Page() {
  return (
    <main className="px-10 py-5">
      <div className="mb-4">
        <h1 className="text-3xl font-bold py-1 mb-0">Salaires enseignants</h1>
        <p className="font-light text-white/20">
          Gérez les salaires des enseignants.
        </p>
      </div>
      <TableData />
    </main>
  );
}

export default Page;
