"use client";
import { useAuth } from "@/components/Context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Clientaxios } from "@/lib/axios";
import { router } from "@/components/Router/router";
import Card from "./(components)/card";
import { PiStudentBold } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiUserBold } from "react-icons/pi";
import { PiUserPlusBold } from "react-icons/pi";

function page() {
  const [isLoading, setIsLoading] = useState(false);
  const { checkAuth, isAuthenticated, SetIsAuthenticated } = useAuth();
  const route = useRouter();
  const [data, Setdata] = useState([]);
  const [user, SetUser] = useState([]);
  const [statique, Setstatique] = useState([]);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      const authenticated = localStorage.getItem("AUTHENTICATED") === "true";

      if (!authenticated) {
        route.replace("/login");
        setIsLoading(false);
        return;
      }

      try {
        const res = await checkAuth();
        const numbers = await Clientaxios.get("api/staticNumbers");
        Setstatique(numbers.data);
        if (res.role !== "admin") {
          route.replace("/login");
          return;
        }
        SetUser(res);
      } catch (error) {
        console.error(error);
        route.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (false) {
    return (
      <main className="flex justify-center items-center h-full min-h-[90vh]">
        <div className="w-10 h-10 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin"></div>
      </main>
    );
  } else {
    return (
      <main className="px-10">
        <h1 className="text-3xl font-bold py-10">Welcome to dashboard</h1>
        <div className="flex gap-6 ">
          <Card
            title={"TOTAL STUDENTS"}
            icon={<PiStudentBold />}
            num={statique?.student}
            color={"purple"}
          />
          <Card
            title={"TOTAL TEACHERS"}
            icon={<FaChalkboardTeacher />}
            num={statique?.teacher}
            color={"blue"}
          />
          <Card
            title={"TOTAL PARENTS"}
            icon={<PiUserBold />}
            num={statique?.parent}
            color={"yellow"}
          />
          <Card
            title={"TOTAL ADMINS"}
            icon={<PiUserPlusBold />}
            num={statique?.admin}
            color={"red"}
          />
        </div>
      </main>
    );
  }
}

export default page;
