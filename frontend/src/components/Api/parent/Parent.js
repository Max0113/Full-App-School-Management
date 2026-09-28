import { Clientaxios } from "@/lib/axios";

export const Connect_Parent = {
  dashboard: () => Clientaxios.get("api/parent/dashboard"),
  children: () => Clientaxios.get("api/parent/children"),
  grades: (childId) =>
    Clientaxios.get("api/parent/grades", {
      params: childId ? { child_id: childId } : {},
    }),
  sessions: (childId) =>
    Clientaxios.get("api/parent/sessions", {
      params: childId ? { child_id: childId } : {},
    }),
  exams: (childId) =>
    Clientaxios.get("api/parent/exams", {
      params: childId ? { child_id: childId } : {},
    }),
  absences: (childId) =>
    Clientaxios.get("api/parent/absences", {
      params: childId ? { child_id: childId } : {},
    }),
  teachers: () => Clientaxios.get("api/parent/teachers"),
  schoolInfo: () => Clientaxios.get("api/parent/school-info"),
};
