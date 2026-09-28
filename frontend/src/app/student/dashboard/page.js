"use client";
import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/RoleGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CalendarDays, ClipboardX, GraduationCap } from "lucide-react";
import { Connect_Student } from "@/components/Api/student/Student";
import { toast } from "sonner";

function Page() {
  const [data, setData] = useState(null);
  useEffect(() => { Connect_Student.dashboard().then((r) => setData(r.data?.data ?? {})).catch(() => toast.error("Impossible de charger le tableau de bord.")); }, []);
  const stats = [{ label: "Examens à venir", value: data?.upcoming_exams?.length ?? 0, icon: CalendarDays }, { label: "Absences", value: data?.absence_total ?? 0, icon: ClipboardX }, { label: "Présence", value: data?.attendance_rate === null || data?.attendance_rate === undefined ? "—" : `${data.attendance_rate}%`, icon: GraduationCap }, { label: "Notifications", value: data?.notifications ?? 0, icon: Bell }];
  return <main className="space-y-6 px-4 py-5 sm:px-10"><div><h1 className="text-3xl font-bold">Tableau de bord</h1><p className="text-muted-foreground">Votre résumé scolaire en un coup d'œil.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <Card key={label}><CardHeader className="flex-row items-center justify-between"><CardDescription>{label}</CardDescription><Icon className="size-5 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-bold">{value}</p></CardContent></Card>)}</div><div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle>Prochaine séance</CardTitle></CardHeader><CardContent>{data?.next_session ? <div><p className="font-medium">{data.next_session.subject_name}</p><p className="text-sm text-muted-foreground">{data.next_session.day} · {data.next_session.start_time} – {data.next_session.end_time}{data.next_session.room_name ? ` · ${data.next_session.room_name}` : ""}</p></div> : <p className="text-sm text-muted-foreground">Aucune séance disponible.</p>}</CardContent></Card><Card><CardHeader><CardTitle>Examens à venir</CardTitle></CardHeader><CardContent className="space-y-3">{data?.upcoming_exams?.length ? data.upcoming_exams.map((exam) => <div key={exam.id} className="flex items-center justify-between rounded-lg border p-3"><div><p className="font-medium">{exam.name}</p><p className="text-sm text-muted-foreground">{exam.subject_name}</p></div><Badge variant="outline">{exam.exam_date}</Badge></div>) : <p className="text-sm text-muted-foreground">Aucun examen à venir.</p>}</CardContent></Card></div><Card><CardHeader><CardTitle>Notes récentes</CardTitle></CardHeader><CardContent className="space-y-3">{data?.recent_grades?.length ? data.recent_grades.map((grade) => <div key={grade.id} className="flex items-center justify-between rounded-lg border p-3"><div><p className="font-medium">{grade.subject_name} · {grade.exam_name}</p><p className="text-sm text-muted-foreground">{grade.appreciation || "Aucune appréciation"}</p></div><Badge>{grade.note}/20</Badge></div>) : <p className="text-sm text-muted-foreground">Aucune note récente.</p>}</CardContent></Card></main>;
}

export default function StudentDashboard() {
  return (
    <RoleGuard role="student">
      <Page />
    </RoleGuard>
  );
}
