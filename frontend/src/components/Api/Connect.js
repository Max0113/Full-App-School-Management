"use client";

import { Clientaxios } from "@/lib/axios";

export const Connect = {
  getToken: async () => {
    return await Clientaxios.get("/sanctum/csrf-cookie");
  },
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
