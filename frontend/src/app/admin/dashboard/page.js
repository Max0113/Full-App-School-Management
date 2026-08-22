"use client";
import React, { useEffect, useState } from "react";
import { Clientaxios } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api";
import Card from "./(components)/card";
import { PiStudentBold } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiUserBold } from "react-icons/pi";
import { PiUserPlusBold } from "react-icons/pi";
import { toast } from "sonner";

function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [statique, Setstatique] = useState({});

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const numbers = await Clientaxios.get("api/staticNumbers");
        if (!active) return;
        Setstatique(numbers.data?.data ?? numbers.data ?? {});
      } catch (error) {
        // Auth is enforced by the layout guard; here we only surface API errors.
        if (active) {
          toast.error("Couldn't load statistics", {
            description: getApiErrorMessage(error),
          });
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadStats();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="px-10">
      <h1 className="text-3xl font-bold py-10">Welcome to dashboard</h1>
      <div className="flex gap-6 ">
        <Card
          title={"TOTAL STUDENTS"}
          icon={<PiStudentBold />}
          num={isLoading ? "…" : statique?.student}
          color={"purple"}
        />
        <Card
          title={"TOTAL TEACHERS"}
          icon={<FaChalkboardTeacher />}
          num={isLoading ? "…" : statique?.teacher}
          color={"blue"}
        />
        <Card
          title={"TOTAL PARENTS"}
          icon={<PiUserBold />}
          num={isLoading ? "…" : statique?.parent}
          color={"yellow"}
        />
        <Card
          title={"TOTAL ADMINS"}
          icon={<PiUserPlusBold />}
          num={isLoading ? "…" : statique?.admin}
          color={"red"}
        />
      </div>
    </main>
  );
}

export default Page;
