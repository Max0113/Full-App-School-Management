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
  getallexams: async (params = {}) => list("api/exams", params),
  addexams: async (data) => Clientaxios.post("api/exams", data),
  Updateexams: async (data) => Clientaxios.put(`api/exams/${data.id}`, data),
  Deleteexams: async (id) => Clientaxios.delete(`api/exams/${id}`),
};

export const Connect_Grades = {
  getallgrades: async (params = {}) => list("api/grades", params),
  addgrades: async (data) => Clientaxios.post("api/grades", data),
  Updategrades: async (data) => Clientaxios.put(`api/grades/${data.id}`, data),
  Deletegrades: async (id) => Clientaxios.delete(`api/grades/${id}`),
};

export const Connect_Absences = {
  getallabsences: async (params = {}) => list("api/absences", params),
  addabsences: async (data) => Clientaxios.post("api/absences", data),
  justifyabsence: async (id, justified) =>
    Clientaxios.patch(`api/absences/${id}/justify`, { justified }),
  Updateabsences: async (data) =>
    Clientaxios.put(`api/absences/${data.id}`, data),
  Deleteabsences: async (id) => Clientaxios.delete(`api/absences/${id}`),
};

export const Connect_Lookups = {
  getTeachings: async () => list("api/teachings", { per_page: 1000 }),
  getStudents: async () => list("api/students", { per_page: 1000 }),
  getTeachers: async () => list("api/teachers", { per_page: 1000 }),
  getSessions: async () => list("api/sessions", { per_page: 1000 }),
  getExams: async () => list("api/exams", { per_page: 1000 }),
};
