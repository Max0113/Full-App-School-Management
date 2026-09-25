import { Clientaxios } from "@/lib/axios";

const list = (url, params = {}) => {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  return Clientaxios.get(url + (query ? `?${query}` : ""));
};


export const Connect_General = {
  getClasseSelect: async (params = {}) => {
    return await list("api/teacher/teacher-classes", params);
  },
};

export const Connect_MyInfo = {
  getMyClasses: async () => {
    return await Clientaxios.get("api/teacher/my-classes");
  },
  getMyStudents: async (params = {}) => {
    return await list("api/teacher/my-students", params);
  }
};

export const Connect_MySessions = {
  getMySessions: async (teacherId) => {
    return await Clientaxios.get(`api/teacher/sessions/classe/${teacherId}`);
  },
};

export const Connect_MyAssessments = {
  getMyExams: async (params = {}) => {
    return await list("api/teacher/exams", params);
  },
  getMyGrades: async (params = {}) => {
    return await list("api/teacher/grades", params);
  },
  getMyParents: async (params = {}) => {
    return await list("api/teacher/parents", params);
  },
  createExam: async (data) => Clientaxios.post("api/teacher/exams", data),
  updateExam: async (id, data) => Clientaxios.patch(`api/teacher/exams/${id}`, data),
  deleteExam: async (id) => Clientaxios.delete(`api/teacher/exams/${id}`),
  getExamStudents: async (id) => Clientaxios.get(`api/teacher/exams/${id}/students`),
  createGrade: async (data) => Clientaxios.post("api/teacher/grades", data),
  updateGrade: async (id, data) => Clientaxios.patch(`api/teacher/grades/${id}`, data),
  deleteGrade: async (id) => Clientaxios.delete(`api/teacher/grades/${id}`),
};
