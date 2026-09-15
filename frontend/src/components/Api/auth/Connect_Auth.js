"use client";
import { Clientaxios } from "@/lib/axios";


export const Connect_Auth = {
  postLogin: async (data) => {
    return await Clientaxios.post("api/login", data);
  },
  postLogout: async () => {
    return await Clientaxios.post("api/logout");
  },
  getUser: async () => {
    return await Clientaxios.get("api/user");
  },
};