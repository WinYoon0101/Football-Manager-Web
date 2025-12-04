import type { Player, PlayerType } from "@/lib/types";
import { api } from "./axios";

export const playersAPI = {
  async getAll(): Promise<Player[]> {
    const res = await api.get<Player[]>("/players");
    return res.data;
  },

  async getPlayerTypes(): Promise<PlayerType[]> {
    const res = await api.get<PlayerType[]>("/players/types");
    return res.data;
  },
};


