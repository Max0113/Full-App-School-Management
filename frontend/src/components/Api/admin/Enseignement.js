"use client";

import { Clientaxios } from "@/lib/axios";

export const Connect_Teaching = {
  getallteaching: async () => {
    return await Clientaxios.get("api/admin/teachings");
  },
  addteaching: async (data) => {
    return await Clientaxios.post("api/admin/teachings", data);
  },
  Updateteaching: async (data) => {
    return await Clientaxios.put(`api/admin/teachings/${data.id}`, data);
  },
  Deleteteaching: async (data) => {
    return await Clientaxios.delete(`api/admin/teachings/${data.id}`);
  },
};
export const Connect_Sessions = {
  getallsessions: async () => {
    return await Clientaxios.get("api/admin/sessions");
  },
   getbyclasse: async (data) => {
    return await Clientaxios.get(`api/admin/sessions/classe/${data.classe_id}`);
  },
  addsessions: async (data) => { 
    return await Clientaxios.post("api/admin/sessions", data);
  },
  Updatesessions: async (data) => {
    return await Clientaxios.put(`api/admin/sessions/${data.id}`, data);
  },
  Deletesessions: async (data) => {
    return await Clientaxios.delete(`api/admin/sessions/${data.id}`);
  },
};
export const Connect_Rooms = {
  getallrooms: async () => {
    return await Clientaxios.get("api/admin/rooms");
  },
  addroom: async (data) => {
    return await Clientaxios.post("api/admin/rooms", data);
  },
  Updateroom: async (data) => {
    return await Clientaxios.put(`api/admin/rooms/${data.id}`, data);
  },
  Deleteroom: async (data) => {
    return await Clientaxios.delete(`api/admin/rooms/${data.id}`);
  },
};
