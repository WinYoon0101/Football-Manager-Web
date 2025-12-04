import { api } from "./axios";
import type { Season, SeasonRanking } from "@/lib/types";

export type { Season, SeasonRanking };

export const seasonApi = {
  async getAll() {
    const res = await api.get<Season[]>("/seasons");
    return res;
  },

  async getRankings(seasonId: number) {
    const res = await api.get<SeasonRanking[]>(
      `/seasons/${seasonId}/rankings`
    );
    return res;
  },
};



