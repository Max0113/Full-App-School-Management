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
import { DataTable } from "./(components)/Tableparents";
import NewFeature from "./(components)/NewFeature";

function page() {
  return (
    <main className="px-10 py-5">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={"px-3 py-6 mb-3 space-x-3"} variant="line">
          <TabsTrigger value="parents">Parents</TabsTrigger>
          <TabsTrigger value="add_parents">New Feature</TabsTrigger>
        </TabsList>
        <TabsContent value="parents" className={"w-full"}>
          <DataTable />
        </TabsContent>
        <TabsContent value="add_parents" className={"w-full"}>
          <NewFeature />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default page;
