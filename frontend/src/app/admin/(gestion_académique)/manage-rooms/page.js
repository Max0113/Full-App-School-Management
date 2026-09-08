"use client";
import React from "react";
import { TableData } from "./(components)/TableData";

function page() {
  return (
    <main className="px-10 py-5">
      <div className="mb-9">
        <h1 className="text-3xl font-bold py-1 mb-0">Controller Salles</h1>
        <p className="font-light text-white/20">
          Tu peux créer, modifier et supprimer des salles.
        </p>
      </div>
      <TableData />
    </main>
  );
}

export default page;