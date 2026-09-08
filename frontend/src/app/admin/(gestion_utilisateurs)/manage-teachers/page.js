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
import NewFeature from "./(components)/NewFeature";

function page() {
  return (
    <main className="px-10 py-5">
      <div className="mb-4">
        <h1 className="text-3xl font-bold py-1 mb-0">Controller Teachers 👨‍🏫</h1>
        <p className="font-light text-white/20">
          tu peux update et create , delete tout teachers{" "}
        </p>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={"px-3 py-6 mb-3 space-x-3"} variant="line">
          <TabsTrigger value="parents">Teachers</TabsTrigger>
          <TabsTrigger value="add_parents">New Feature</TabsTrigger>
        </TabsList>
        <TabsContent value="parents" className={"w-full"}>
          <TableData />
        </TabsContent>
        <TabsContent value="add_parents" className={"w-full"}>
          <NewFeature />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default page;
