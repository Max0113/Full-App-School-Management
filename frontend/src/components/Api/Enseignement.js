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
