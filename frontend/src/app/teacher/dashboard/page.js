"use client";
import React, { useEffect, useState } from "react";
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
import { RoleGuard } from "@/components/RoleGuard";
import { toast } from "sonner";
import { PiBooksBold } from "react-icons/pi";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import { PiCalendarBlankBold } from "react-icons/pi";
import { PiStudentBold } from "react-icons/pi";
import { PiWarningCircleBold } from "react-icons/pi";
import { PiCalendarCheckBold } from "react-icons/pi";
import { PiClipboardTextBold } from "react-icons/pi";
import { GoHomeFill } from "react-icons/go";
import { Connect_Dashboard } from "@/components/Api/teacher/Dashboard";

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
        const res = await Connect_Dashboard.getDashboardData();
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
      month: MONTHS_FR[Number(m) - 1] ?? row.month ?? "—",
      absences: Number(row.total ?? 0),
    };
  });

  const upcomingSessions = stats.upcomingSessions ?? [];
  const recentExams = stats.recentExams ?? [];
  const recentAbsences = stats.recentAbsences ?? [];

  return (
    <main className="px-10 py-5">
      <h1 className="text-3xl font-bold py-2 mb-6 dark:text-white">
        Bienvenue sur votre tableau de bord ⭐
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <Card
          title={"MATIÈRES ENSEIGNÉES"}
          icon={<PiBooksBold />}
          num={isLoading ? "…" : stats.subjectsTaught}
          color={"blue"}
        />
        <Card
          title={"CLASSES ENSEIGNÉES"}
          icon={<PiStudentBold />}
          num={isLoading ? "…" : stats.classesTaught}
          color={"purple"}
        />
        <Card
          title={"SÉANCES TOTALES"}
          icon={<PiCalendarBlankBold />}
          num={isLoading ? "…" : stats.sessionTotal}
          color={"green"}
        />
        <Card
          title={"MES ÉLÈVES"}
          icon={<PiChalkboardTeacherBold />}
          num={isLoading ? "…" : stats.studentTotal}
          color={"yellow"}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="dark:bg-[#171717] border border-sidebar-border dark:text-white p-5 rounded-md">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <PiStudentBold className="text-purple-400" />
            Élèves par classe
          </h2>
          {isLoading ? (
            <p className="dark:text-white/40">Chargement…</p>
          ) : (
            <ChartContainer
              config={studentsChartConfig}
              className="h-72 w-full"
            >
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

        <div className="dark:bg-[#171717] border border-sidebar-border dark:text-white p-5 rounded-md">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <PiWarningCircleBold className="text-red-400" />
            Absences de mes élèves (6 derniers mois)
          </h2>
          {isLoading ? (
            <p className="dark:text-white/40">Chargement…</p>
          ) : (
            <ChartContainer
              config={absencesChartConfig}
              className="h-72 w-full"
            >
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
            <span className="dark:text-white/60">
              Justifiées :{" "}
              <b className="text-emerald-400">{stats.justifiedAbsences ?? 0}</b>
            </span>
            <span className="dark:text-white/60">
              Non justifiées :{" "}
              <b className="text-red-400">{stats.unjustifiedAbsences ?? 0}</b>
            </span>
          </div>
        </div>
      </div>

      {/* Next sessions */}
      <div className="dark:bg-[#171717] border border-sidebar-border dark:text-white p-5 rounded-md mb-6">
        <h2 className="flex items-center gap-2 font-bold mb-4">
          <PiCalendarCheckBold className="text-blue-400" />
          Prochaines séances
        </h2>
        {isLoading ? (
          <p className="dark:text-white/40">Chargement…</p>
        ) : upcomingSessions.length === 0 ? (
          <p className="dark:text-white/40">Aucune séance à venir.</p>
        ) : (
          <ul className="space-y-3">
            {upcomingSessions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between text-sm gap-2 px-4 py-2 rounded-md bg-black/5 dark:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-2 dark:text-white/80">
                  <GoHomeFill className="text-indigo-400" />
                  {s.classe_name}
                </span>
                <span className="dark:text-white/40">
                  {s.subject_name} · {s.room_name}
                </span>
                <span className="dark:text-white/60">
                  {s.day} {s.start_time}–{s.end_time}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent exams & absences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dark:bg-[#171717] border border-sidebar-border dark:text-white p-5 rounded-md">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <PiClipboardTextBold className="text-blue-400" />
            Derniers examens
          </h2>
          {isLoading ? (
            <p className="dark:text-white/40">Chargement…</p>
          ) : recentExams.length === 0 ? (
            <p className="dark:text-white/40">Aucun examen.</p>
          ) : (
            <ul className="space-y-3">
              {recentExams.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between text-sm gap-2 px-4 py-2 rounded-md bg-black/5 dark:bg-white/5 transition-colors"
                >
                  <span className="dark:text-white/80">{e.name}</span>
                  <span className="dark:text-white/40">{e.classe_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dark:bg-[#171717] border border-sidebar-border dark:text-white p-5 rounded-md">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <PiWarningCircleBold className="text-red-400" />
            Dernières absences
          </h2>
          {isLoading ? (
            <p className="dark:text-white/40">Chargement…</p>
          ) : recentAbsences.length === 0 ? (
            <p className="dark:text-white/40">Aucune absence.</p>
          ) : (
            <ul className="space-y-3">
              {recentAbsences.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between text-sm gap-2 px-4 py-2 rounded-md bg-black/5 dark:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="dark:text-white/80">
                      {a.student_firstname} {a.student_lastname}
                    </span>
                    <span className="dark:text-white/40">{a.classe_name}</span>
                  </span>
                  <span
                    className={
                      a.justified ? "text-emerald-400" : "text-red-400"
                    }
                  >
                    {a.justified ? "Justifiée" : "Non justifiée"}
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

function TeacherDashboard() {
  return (
    <RoleGuard role="teacher">
      <Page />
    </RoleGuard>
  );
}

export default TeacherDashboard;
