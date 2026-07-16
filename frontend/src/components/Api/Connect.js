"use client";

import { Clientaxios } from "@/lib/axios";

export const Connect = {
  postLogin: async (value) => {
    return await Clientaxios.post("api/login", value);
  },
  postLogout: async () => {
    return await Clientaxios.post("api/logout");
  },
  postRegister: async (value) => {
    return await Clientaxios.post("api/register", value);
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
  addparents: async (value) => {
    return await Clientaxios.post("api/parents", value);
  },
};
