"use client";

import { Clientaxios } from "@/lib/axios";

export const Connect_Teaching = {
  getallteaching: async () => {
    return await Clientaxios.get("api/teachings");
  },
  addteaching: async (data) => {
    return await Clientaxios.post("api/teachings", data);
  },
  Updateteaching: async (data) => {
    return await Clientaxios.put(`api/teachings/${data.id}`, data);
  },
  Deleteteaching: async (data) => {
    return await Clientaxios.delete(`api/teachings/${data.id}`);
  },
};
export const Connect_Sessions = {
  getallsessions: async () => {
    return await Clientaxios.get("api/sessions");
  },
   getbyclasse: async (data) => {
    return await Clientaxios.get(`api/sessions/${data.classe_id}`);
  },
  addsessions: async (data) => { 
    return await Clientaxios.post("api/sessions", data);
  },
  Updatesessions: async (data) => {
    return await Clientaxios.put(`api/sessions/${data.id}`, data);
  },
  Deletesessions: async (data) => {
    return await Clientaxios.delete(`api/sessions/${data.id}`);
  },
};
