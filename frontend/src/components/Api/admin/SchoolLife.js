"use client";

import { Clientaxios } from "@/lib/axios";

const list = (url, params = {}) => {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  return Clientaxios.get(url + (query ? `?${query}` : ""));
};

export const Connect_Exams = {
  getallexams: async (params = {}) => list("api/admin/exams", params),
  addexams: async (data) => Clientaxios.post("api/admin/exams", data),
  Updateexams: async (data) => Clientaxios.put(`api/admin/exams/${data.id}`, data),
  Deleteexams: async (id) => Clientaxios.delete(`api/admin/exams/${id}`),
};

export const Connect_Grades = {
  getallgrades: async (params = {}) => list("api/admin/grades", params),
  addgrades: async (data) => Clientaxios.post("api/admin/grades", data),
  Updategrades: async (data) => Clientaxios.put(`api/admin/grades/${data.id}`, data),
  Deletegrades: async (id) => Clientaxios.delete(`api/admin/grades/${id}`),
};

export const Connect_Absences = {
  getallabsences: async (params = {}) => list("api/admin/absences", params),
  addabsences: async (data) => Clientaxios.post("api/admin/absences", data),
  justifyabsence: async (id, justified) =>
    Clientaxios.patch(`api/admin/absences/${id}/justify`, { justified }),
  Updateabsences: async (data) =>
    Clientaxios.put(`api/admin/absences/${data.id}`, data),
  Deleteabsences: async (id) => Clientaxios.delete(`api/admin/absences/${id}`),
};

export const Connect_Lookups = {
  getTeachings: async (classeId) => list("api/admin/teachings", { per_page: 1000, ...(classeId ? { classe_id: classeId } : {}) }),
  getStudents: async (classeId) =>
    list("api/admin/students", {
      per_page: 1000,
      ...(classeId ? { classe_id: classeId } : {}),
    }),
  getTeachers: async () => list("api/admin/teachers", { per_page: 1000 }),
  getSessions: async () => list("api/admin/sessions", { per_page: 1000 }),
  getSessionsByClasse: async (classeId) =>
    Clientaxios.get(`api/admin/sessions/classe/${classeId}`),
  getClasses: async (classeId) => list("api/admin/classes", { per_page: 1000 , ...(classeId ? { classe_id: classeId } : {})  }),
  getExams: async (classeId) => list("api/admin/exams", { per_page: 1000, ...(classeId ? { classe_id: classeId } : {})  }),
};
