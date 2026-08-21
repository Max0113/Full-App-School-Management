"use client";
import React from "react";
import { ClanderSession } from "./(components)/(clander)/ClanderSession";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TableData } from "./(components)/(tabledata)/TableData";

function page() {
  return (
    <main className="px-10 py-5">
      <div className="mb-5">
        <h1 className="text-3xl font-bold py-1 mb-0">
          Controller Seances 📙
        </h1>
        <p className="font-light text-white/20">
          tu peux update et create , delete tout seances{" "}
        </p>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-5" variant="line" >
          <TabsTrigger value="calendar">Emploi de temps</TabsTrigger>
          <TabsTrigger value="session">Seances</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <ClanderSession />
        </TabsContent>
        <TabsContent value="session">
          <TableData />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default page;
