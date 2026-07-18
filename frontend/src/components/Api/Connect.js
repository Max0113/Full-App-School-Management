"use client";

import { Clientaxios } from "@/lib/axios";

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
  getUsers: async () => {
    return await Clientaxios.get("api/getusers");
  },
};

export const Connect_Parents = {
  getallparents: async () => {
    return await Clientaxios.get("api/getparents");
  },
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
