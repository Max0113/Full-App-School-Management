import { Clientaxios } from "@/lib/axios";

export const Connect_Dashboard = {
  getDashboardData: async () => {
    return await Clientaxios.get("api/teacher/dashboard/stats");
  },
};