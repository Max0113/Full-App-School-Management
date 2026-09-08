"use client";
import React, { useEffect, useState } from "react";
import { Clientaxios } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api";
import Card from "./(components)/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PiStudentBold } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiUserBold } from "react-icons/pi";
import { PiUserPlusBold } from "react-icons/pi";
import { PiUsersThreeBold } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa6";
import { PiWarningCircleBold } from "react-icons/pi";
import { toast } from "sonner";

const MONTHS_FR = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];



const studentsChartConfig = {
  effectifs: {
    label: "Étudiants",
    color: "#a78bfa",
  },
};

const absencesChartConfig = {
  absences: {
    label: "Absences",
    color: "#f87171",
  },
};

function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const res = await Clientaxios.get("api/dashboard/stats");
        if (!active) return;
        setStats(res.data?.data ?? res.data ?? {});
      } catch (error) {
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

  const studentsPerClass = (stats.studentsPerClass ?? []).map((row) => ({
    name: row.classe_name ?? "—",
    effectifs: Number(row.total ?? 0),
  }));

  const absencesPerMonth = (stats.absencesPerMonth ?? []).map((row) => {
    const [, m] = String(row.month ?? "").split("-");
    return {
      month: MONTHS_FR[Number(m) - 1] ?? row.month,
      absences: Number(row.total ?? 0),
    };
  });

  const recentStudents = stats.recentStudents ?? [];
  const recentExams = stats.recentExams ?? [];
  const recentAbsences = stats.recentAbsences ?? [];

  return (
    <main className="px-10 py-5">
      <h1 className="text-3xl font-bold py-2 mb-6 text-white">
        Welcome to dashboard ⭐
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <Card
          title={"TOTAL STUDENTS"}
          icon={<PiStudentBold />}
          num={isLoading ? "…" : stats?.student}
          color={"purple"}
        />
        <Card
          title={"TOTAL TEACHERS"}
          icon={<FaChalkboardTeacher />}
          num={isLoading ? "…" : stats?.teacher}
          color={"blue"}
        />
        <Card
          title={"TOTAL PARENTS"}
          icon={<PiUserBold />}
          num={isLoading ? "…" : stats?.parent}
          color={"yellow"}
        />
        <Card
          title={"TOTAL ADMINS"}
          icon={<PiUserPlusBold />}
          num={isLoading ? "…" : stats?.admin}
          color={"red"}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#171717] border border-sidebar-border text-white p-5 rounded-md">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <PiUsersThreeBold className="text-purple-400" />
            Étudiants par classe
          </h2>
          {isLoading ? (
            <p className="text-white/40">Chargement…</p>
          ) : (
            <ChartContainer config={studentsChartConfig} className="h-72 w-full">
              <BarChart data={studentsPerClass}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="effectifs"
                  fill="var(--color-effectifs)"
                  radius={6}
                />
              </BarChart>
            </ChartContainer>
          )}
        </div>

        <div className="bg-[#171717] border border-sidebar-border text-white p-5 rounded-md">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <PiWarningCircleBold className="text-red-400" />
            Absences (6 derniers mois)
          </h2>
          {isLoading ? (
            <p className="text-white/40">Chargement…</p>
          ) : (
            <ChartContainer config={absencesChartConfig} className="h-72 w-full">
              <LineChart data={absencesPerMonth}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="absences"
                  type="monotone"
                  stroke="var(--color-absences)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          )}
          <div className="flex gap-6 mt-3 text-sm">
            <span className="text-white/60">
              Justifiées :{" "}
              <b className="text-emerald-400">{stats.justifiedAbsences ?? 0}</b>
            </span>
            <span className="text-white/60">
              Non justifiées :{" "}
              <b className="text-red-400">{stats.unjustifiedAbsences ?? 0}</b>
            </span>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#171717] border border-sidebar-border text-white p-5 rounded-md">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <PiStudentBold className="text-purple-400" />
            Derniers étudiants
          </h2>
          {isLoading ? (
            <p className="text-white/40">Chargement…</p>
          ) : recentStudents.length === 0 ? (
            <p className="text-white/40">Aucun étudiant.</p>
          ) : (
            <ul className="space-y-3">
              {recentStudents.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between text-sm px-4 py-2 rounded-md bg-white/5 transition-colors"
                >
                  <span className="text-white/80">
                    {s.firstname} {s.lastname}
                  </span>
                  <span className="text-white/40">{s.classe_name ?? "—"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-[#171717] border border-sidebar-border text-white p-5 rounded-md">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <FaBookOpen className="text-blue-400" />
            Derniers examens
          </h2>
          {isLoading ? (
            <p className="text-white/40">Chargement…</p>
          ) : recentExams.length === 0 ? (
            <p className="text-white/40">Aucun examen.</p>
          ) : (
            <ul className="space-y-3">
              {recentExams.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between text-sm gap-2  px-4 py-2 rounded-md bg-white/5 transition-colors"
                >
                  <span className="text-white/80">
                    {e.name}
                  </span>
                  <span className="text-white/40">{e.classe_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-[#171717] border border-sidebar-border text-white p-5 rounded-md">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <PiWarningCircleBold className="text-red-400" />
            Dernières absences
          </h2>
          {isLoading ? (
            <p className="text-white/40">Chargement…</p>
          ) : recentAbsences.length === 0 ? (
            <p className="text-white/40">Aucune absence.</p>
          ) : (
            <ul className="space-y-3">
              {recentAbsences.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between text-sm gap-2  px-4 py-2 rounded-md bg-white/5 transition-colors"
                >
                  <span className="text-white/80">
                    {a.student_firstname} {a.student_lastname}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-white/40">{a.classe_name}</span>
                    <span
                      className={
                        a.justified
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    >
                      {a.justified ? "Justifiée" : "Non justifiée"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

export default Page;