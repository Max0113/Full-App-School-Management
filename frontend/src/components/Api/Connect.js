"use client";

import { Clientaxios } from "@/lib/axios";

const withParams = (url, params = {}) => {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  return Clientaxios.get(url + (query ? `?${query}` : ""));
};

export const Connect = {
  postLogin: async (data) => {
    return await Clientaxios.post("api/login", data);
  },
  postLogout: async () => {
    return await Clientaxios.post("api/logout");
  },
  postRegister: async (data) => {
    return await Clientaxios.post("api/register", data);
  },
  getUser: async () => {
    return await Clientaxios.get("api/user");
  },
  getStudents: async () => {
    return await Clientaxios.get("api/getstudents");
  },
};

export const Connect_Parents = {
  getallparents: async (params = {}) => withParams("api/parents", params),
  addparents: async (data) => {
    return await Clientaxios.post("api/parents", data);
  },
  Updateparents: async (data) => {
    return await Clientaxios.put(`api/parents/${data.id}`, data);
  },
  Deleteparents: async (data) => {
    return await Clientaxios.delete(`api/parents/${data.id}`);
  },
};

export const Connect_Students = {
  getallstudents: async (params = {}) => withParams("api/students", params),
  addstudents: async (data) => {
    return await Clientaxios.post("api/students", data);
  },
  Updatestudents: async (data) => {
    return await Clientaxios.put(`api/students/${data.id}`, data);
  },
  Deletestudents: async (data) => {
    return await Clientaxios.delete(`api/students/${data.id}`);
  },
};

export const Connect_Teachers = {
  getallteachers: async (params = {}) => withParams("api/teachers", params),
  addteachers: async (data) => {
    return await Clientaxios.post("api/teachers", data);
  },
  Updateteachers: async (data) => {
    return await Clientaxios.put(`api/teachers/${data.id}`, data);
  },
  Deleteteachers: async (data) => {
    return await Clientaxios.delete(`api/teachers/${data.id}`);
  },
};

export const Connect_Admins = {
  getalladmins: async (params = {}) => withParams("api/admins", params),
  addadmins: async (data) => {
    return await Clientaxios.post("api/admins", data);
  },
  Updateadmins: async (data) => {
    return await Clientaxios.put(`api/admins/${data.id}`, data);
  },
  Deleteadmins: async (data) => {
    return await Clientaxios.delete(`api/admins/${data.id}`);
  },
};
