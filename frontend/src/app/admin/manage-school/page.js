"use client";
import React from "react";
import LevelCard from "./(components)/(card-level)/LevelCard";
import YearCard from "./(components)/(card-year)/YearCard";
import SubjectCard from "./(components)/(card-subject)/SubjectCard";

function page() {
  return (
    <main className="px-10 py-5 flex flex-col gap-8">
      <div className="flex w-full gap-8">
        <LevelCard />
        <YearCard />
      </div>
      <SubjectCard />
    </main>
  );
}

export default page;
