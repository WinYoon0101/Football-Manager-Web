import { api } from "./axios";

export interface Season {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
}

export interface SeasonRanking {
  id: number;
  seasonId: number;
  teamId: number;
  win: number;
  lose: number;
  draw: number;
  points: number;
  goalDifference: number;
  team: {
    id: number;
    name: string;
    image: string | null;
  };
  season: {
    id: number;
    name: string;
  };
}

export const seasonApi = {
  // Lấy toàn bộ mùa giải (params: none; output: Season[]; dùng cho lọc theo mùa)
  getAll: () => api.get<Season[]>("/seasons"),

  // Lấy bảng xếp hạng theo mùa (params: seasonId; output: SeasonRanking[]; dùng cho tab standings)
  getRankings: (seasonId: number) =>
    api.get<SeasonRanking[]>(`/seasons/${seasonId}/rankings`),
};

