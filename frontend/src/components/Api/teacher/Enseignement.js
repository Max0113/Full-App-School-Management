import { Clientaxios } from "@/lib/axios";

export const Connect_MyInfo = {
  getMyClasses: async () => {
    return await Clientaxios.get("api/teacher/my-classes");
  },
  getMyStudents: async () => {
    return await Clientaxios.get("api/teacher/my-students");
  }
};
