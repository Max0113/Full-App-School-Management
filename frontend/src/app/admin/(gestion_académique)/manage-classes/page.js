"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableData } from "./(components)/TableData";

function page() {
  return (
    <main className="px-10 py-5">
      <div className="mb-9">
        <h1 className="text-3xl font-bold py-1 mb-0">Controller Classes 📖</h1>
        <p className="font-light text-white/20">
          tu peux update et create , delete tout classes{" "}
        </p>
      </div>
      <TableData />
    </main>
  );
}

export default page;
