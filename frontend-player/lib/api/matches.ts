import { api } from "./axios";

export interface MatchResult {
  matchId: number;
  match: {
    id: number;
    matchTime: Date | string;
    stadium: string | null;
    round: {
      id: number;
      name: string;
    };
    team1: {
      id: number;
      name: string;
      image: string | null;
    };
    team2: {
      id: number;
      name: string;
      image: string | null;
    };
  };
  team1Goals: number;
  team2Goals: number;
  winner: "team1" | "team2" | "draw";
  goals: Array<{
    id: number;
    minute: number;
    team: {
      id: number;
      name: string;
    };
    player: {
      id: number;
      name: string;
      image: string | null;
    };
    goalType: {
      id: number;
      name: string;
    };
  }>;
}

export const resultApi = {
  async getAll(seasonId?: number): Promise<MatchResult[]> {
    const params =
      seasonId !== undefined
        ? {
            seasonId,
          }
        : {};
    const res = await api.get<MatchResult[]>("/matches/results", {
      params,
    });
    return res.data;
  },
};


