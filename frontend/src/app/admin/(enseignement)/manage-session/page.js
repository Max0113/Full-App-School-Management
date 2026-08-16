"use client";
import React from "react";
import { ClanderSession } from "./(components)/ClanderSession";

function page() {
  return (
    <main className="px-10 py-5">
      <div className="mb-9">
        <h1 className="text-3xl font-bold py-1 mb-0">
          Controller Enseignements 🧬
        </h1>
        <p className="font-light text-white/20">
          tu peux update et create , delete tout enseignements{" "}
        </p>
      </div>
      <ClanderSession />
    </main>
  );
}

export default page;
