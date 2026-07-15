"use client";
import { useAuth } from "@/components/Context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Clientaxios } from "@/lib/axios";
import { router } from "@/components/Router/router";

function page() {
  const [isLoading, setIsLoading] = useState(false);
  const { checkAuth, isAuthenticated, SetIsAuthenticated } = useAuth();
  const route = useRouter();
  const [data, Setdata] = useState([]);
  const [user, SetUser] = useState([]);

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
        const res_ = await checkAuth();
        if (res_.role !== "admin") {
          route.replace("/login");
          return; 
        }
        const res = await Clientaxios.get("api/getusers");
        if(res_.role != "admin") route.replace("/login");
        Setdata(res.data);
        SetUser(res_);
      } catch (error) {
        console.error(error);
        route.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return (
      <main className="flex justify-center items-center h-full min-h-[90vh]">
        <div className="w-10 h-10 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin"></div>
      </main>
    );
  } else {
    return (
      <main className="px-10">
        <h1 className="text-3xl font-bold py-10">Welcome to dashboard</h1>

        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full  shadow-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">ID</th>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
              </tr>
            </thead>
            <tbody>
              {data.map((element) => (
                <tr key={element.id} className="border-b transition">
                  <td className="px-6 py-4">{element?.id}</td>
                  <td className="px-6 py-4">{element?.name}</td>
                  <td className="px-6 py-4">{element?.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    );
  }
}

export default page;
