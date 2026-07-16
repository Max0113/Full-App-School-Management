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
import Addparents from "./(components)/Addparents";
import { DataTable } from "./(components)/Tableparents";
function page() {
  const handleSubmit = async () => {};
  return (
    <main className="px-10 py-5">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={"px-3 py-6 mb-3 space-x-3"}>
          <TabsTrigger value="parents">Parents</TabsTrigger>
          <TabsTrigger value="add_parents">Add new Parents</TabsTrigger>
        </TabsList>
        <TabsContent value="parents" className={"w-full"}>
          <DataTable />
        </TabsContent>
        <TabsContent value="add_parents" className={"w-full"}>
          <Addparents />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default page;
