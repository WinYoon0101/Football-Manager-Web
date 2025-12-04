import type { Team } from "@/lib/types";
import { api } from "./axios";

export const teamsAPI = {
  async getAll(): Promise<Team[]> {
    const res = await api.get<Team[]>("/teams");
    return res.data;
  },
};


