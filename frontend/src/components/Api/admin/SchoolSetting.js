"use client";

import { Clientaxios } from "@/lib/axios";

export const Connect_Level = {
  getalllevel: async () => {
    return await Clientaxios.get("api/admin/levels");
  },
  addlevel: async (data) => {
    return await Clientaxios.post("api/admin/levels", data);
  },
  Updatelevel: async (data) => {
    return await Clientaxios.put(`api/admin/levels/${data.id}`, data);
  },
  Deletelevel: async (data) => {
    return await Clientaxios.delete(`api/admin/levels/${data.id}`);
  },
};

export const Connect_SchoolYear = {
  getallschoolyear: async () => {
    return await Clientaxios.get("api/admin/schoolyears");
  },
  addschoolyear: async (data) => {
    return await Clientaxios.post("api/admin/schoolyears", data);
  },
  Updateschoolyear: async (data) => {
    return await Clientaxios.put(`api/admin/schoolyears/${data.id}`, data);
  },
  Deleteschoolyear: async (data) => {
    return await Clientaxios.delete(`api/admin/schoolyears/${data.id}`);
  },
};

export const Connect_Subject = {
  getallsubject: async () => {
    return await Clientaxios.get("api/admin/subjects");
  },
  addsubject: async (data) => {
    return await Clientaxios.post("api/admin/subjects", data);
  },
  Updatesubject: async (data) => {
    return await Clientaxios.put(`api/admin/subjects/${data.id}`, data);
  },
  Deletesubject: async (data) => {
    return await Clientaxios.delete(`api/admin/subjects/${data.id}`);
  },
};

export const Connect_Speialite = {
  getallspeialite: async () => {
    return await Clientaxios.get("api/admin/specialites");
  },
  addspeialite: async (data) => {
    return await Clientaxios.post("api/admin/specialites", data);
  },
  Updatespeialite: async (data) => {
    return await Clientaxios.put(`api/admin/specialites/${data.id}`, data);
  },
  Deletespeialite: async (data) => {
    return await Clientaxios.delete(`api/admin/specialites/${data.id}`);
  },
};

export const Connect_Classe = {
  getallclasse: async () => {
    return await Clientaxios.get("api/admin/classes");
  },
  addclasse: async (data) => {
    return await Clientaxios.post("api/admin/classes", data);
  },
  Updateclasse: async (data) => {
    return await Clientaxios.put(`api/admin/classes/${data.id}`, data);
  },
  Deleteclasse: async (data) => {
    return await Clientaxios.delete(`api/admin/classes/${data.id}`);
  },
};
