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
