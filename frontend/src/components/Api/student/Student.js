import { Clientaxios } from "@/lib/axios";

export const Connect_Student = {
  dashboard: () => Clientaxios.get("api/student/dashboard"),
  grades: () => Clientaxios.get("api/student/grades"),
  sessions: () => Clientaxios.get("api/student/sessions"),
  exams: () => Clientaxios.get("api/student/exams"),
  absences: () => Clientaxios.get("api/student/absences"),
  teachers: () => Clientaxios.get("api/student/teachers"),
  schoolInfo: () => Clientaxios.get("api/student/school-info"),
};
