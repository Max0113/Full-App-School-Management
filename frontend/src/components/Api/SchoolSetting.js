"use client";

import { Clientaxios } from "@/lib/axios";

export const Connect_Level = {
  getalllevel: async () => {
    return await Clientaxios.get("api/levels");
  },
  addlevel: async (data) => {
    return await Clientaxios.post("api/levels", data);
  },
  Updatelevel: async (data) => {
    return await Clientaxios.put(`api/levels/${data.id}`, data);
  },
  Deletelevel: async (data) => {
    return await Clientaxios.delete(`api/levels/${data.id}`);
  },
};

export const Connect_SchoolYear = {
  getallschoolyear: async () => {
    return await Clientaxios.get("api/schoolyears");
  },
  addschoolyear: async (data) => {
    return await Clientaxios.post("api/schoolyears", data);
  },
  Updateschoolyear: async (data) => {
    return await Clientaxios.put(`api/schoolyears/${data.id}`, data);
  },
  Deleteschoolyear: async (data) => {
    return await Clientaxios.delete(`api/schoolyears/${data.id}`);
  },
};

export const Connect_Subject = {
  getallsubject: async () => {
    return await Clientaxios.get("api/subjects");
  },
  addsubject: async (data) => {
    return await Clientaxios.post("api/subjects", data);
  },
  Updatesubject: async (data) => {
    return await Clientaxios.put(`api/subjects/${data.id}`, data);
  },
  Deletesubject: async (data) => {
    return await Clientaxios.delete(`api/subjects/${data.id}`);
  },
};

export const Connect_Speialite = {
  getallspeialite: async () => {
    return await Clientaxios.get("api/speialites");
  },
  addspeialite: async (data) => {
    return await Clientaxios.post("api/speialites", data);
  },
  Updatespeialite: async (data) => {
    return await Clientaxios.put(`api/speialites/${data.id}`, data);
  },
  Deletespeialite: async (data) => {
    return await Clientaxios.delete(`api/speialites/${data.id}`);
  },
};

export const Connect_Classe = {
  getallclasse: async () => {
    return await Clientaxios.get("api/classes");
  },
  addclasse: async (data) => {
    return await Clientaxios.post("api/classes", data);
  },
  Updateclasse: async (data) => {
    return await Clientaxios.put(`api/classes/${data.id}`, data);
  },
  Deleteclasse: async (data) => {
    return await Clientaxios.delete(`api/classes/${data.id}`);
  },
};
