import { api } from "./axios";

export interface TeamStats {
  team: {
    id: number;
    name: string;
    homeStadium: string | null;
    playerCount: number | null;
    image: string | null;
  };
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  totalPlayers: number;
  domesticPlayers: number;
  foreignPlayers: number;
}

export interface PlayerStats {
  player: {
    id: number;
    name: string;
    image: string | null;
  };
  team: {
    id: number;
    name: string;
    image: string | null;
  };
  goals: number;
  matches: number;
}

export const reportsAPI = {
  async getTeamStats(seasonId?: number): Promise<TeamStats[]> {
    const params =
      seasonId !== undefined
        ? {
            seasonId,
          }
        : {};
    const res = await api.get<TeamStats[]>("/reports/teams/stats", { params });
    return res.data;
  },

  async getPlayerStats(seasonId?: number): Promise<PlayerStats[]> {
    const params =
      seasonId !== undefined
        ? {
            seasonId,
          }
        : {};
    const res = await api.get<PlayerStats[]>("/reports/players/stats", {
      params,
    });
    return res.data;
  },
};


