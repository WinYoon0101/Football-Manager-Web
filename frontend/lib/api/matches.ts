import { api } from "./axios";
import type { Match, Round } from "@/lib/types";

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

export interface StandingTeam {
  team: {
    id: number;
    name: string;
    image: string | null;
  };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

// Match API
export const matchApi = {
  // Lấy tất cả trận đấu
  getAll: () => api.get<Match[]>("/matches"),

  // Lấy trận đấu theo ID
  getById: (id: number) => api.get<Match>(`/matches/${id}`),

  // Tạo trận đấu mới
  create: (data: {
    roundId: number;
    team1Id: number;
    team2Id: number;
    matchTime: string;
    stadium?: string;
  }) => api.post<Match>("/matches", data),

  // Cập nhật trận đấu
  update: (
    id: number,
    data: Partial<{
      roundId: number;
      team1Id: number;
      team2Id: number;
      matchTime: string;
      stadium: string;
    }>
  ) => api.put<Match>(`/matches/${id}`, data),

  // Xóa trận đấu
  delete: (id: number) => api.delete(`/matches/${id}`),

  // Lấy danh sách vòng đấu
  getRounds: () => api.get<Round[]>("/matches/rounds"),
};

// Result API (now handled by match routes)
export const resultApi = {
  // Lấy kết quả tất cả trận đấu
  getAll: () => api.get<MatchResult[]>("/matches/results"),

  // Lấy kết quả trận đấu theo ID
  getById: (matchId: number) =>
    api.get<MatchResult>(`/matches/results/${matchId}`),

  // Lấy kết quả theo vòng đấu
  getByRound: (roundId: number) =>
    api.get<MatchResult[]>(`/matches/results/round/${roundId}`),

  // Lấy kết quả theo đội
  getByTeam: (teamId: number) =>
    api.get<MatchResult[]>(`/matches/results/team/${teamId}`),

  // Lấy bảng xếp hạng
  getStandings: () => api.get<StandingTeam[]>("/matches/results/standings"),
};

// Re-export goal API
export { goalApi } from "./goals";
