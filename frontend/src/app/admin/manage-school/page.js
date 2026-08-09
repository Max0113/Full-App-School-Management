"use client";
import React from "react";
import LevelCard from "./(components)/(card-level)/LevelCard";
import YearCard from "./(components)/(card-year)/YearCard";
import SubjectCard from "./(components)/(card-subject)/SubjectCard";

function page() {
  return (
    <main className="px-10 py-5 flex flex-col gap-8">
      <h1 className="text-3xl font-bold py-1">
        Controller Niveaux & Anne School 🥽
      </h1>
      <div className="flex w-full gap-8">
        <LevelCard />
        <YearCard />
      </div>
    </main>
  );
}

export default page;
