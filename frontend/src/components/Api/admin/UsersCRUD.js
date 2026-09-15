"use client";

import { Clientaxios } from "@/lib/axios";

const withParams = (url, params = {}) => {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  return Clientaxios.get(url + (query ? `?${query}` : ""));
};

export const Connect_Parents = {
  getallparents: async (params = {}) => withParams("api/admin/parents", params),
  addparents: async (data) => {
    return await Clientaxios.post("api/admin/parents", data);
  },
  Updateparents: async (data) => {
    return await Clientaxios.put(`api/admin/parents/${data.id}`, data);
  },
  Deleteparents: async (data) => {
    return await Clientaxios.delete(`api/admin/parents/${data.id}`);
  },
};

export const Connect_Students = {
  getallstudents: async (params = {}) => withParams("api/admin/students", params),
  addstudents: async (data) => {
    return await Clientaxios.post("api/admin/students", data);
  },
  Updatestudents: async (data) => {
    return await Clientaxios.put(`api/admin/students/${data.id}`, data);
  },
  Deletestudents: async (data) => {
    return await Clientaxios.delete(`api/admin/students/${data.id}`);
  },
};

export const Connect_Teachers = {
  getallteachers: async (params = {}) => withParams("api/admin/teachers", params),
  addteachers: async (data) => {
    return await Clientaxios.post("api/admin/teachers", data);
  },
  Updateteachers: async (data) => {
    return await Clientaxios.put(`api/admin/teachers/${data.id}`, data);
  },
  Deleteteachers: async (data) => {
    return await Clientaxios.delete(`api/admin/teachers/${data.id}`);
  },
};

export const Connect_Admins = {
  getalladmins: async (params = {}) => withParams("api/admin/admins", params),
  addadmins: async (data) => {
    return await Clientaxios.post("api/admin/admins", data);
  },
  Updateadmins: async (data) => {
    return await Clientaxios.put(`api/admin/admins/${data.id}`, data);
  },
  Deleteadmins: async (data) => {
    return await Clientaxios.delete(`api/admin/admins/${data.id}`);
  },
};
