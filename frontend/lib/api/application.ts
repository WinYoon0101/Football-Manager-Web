import { api } from "./axios";
import type { Team, Season } from "@/lib/types";

// Kiểu dữ liệu Application
export interface Application {
  id: number;
  teamId: number;
  seasonId: number;
  dateSignin: string;
  status?: string;
  team: Team;
  season: Season;
}

// Application API
export const applicationApi = {
  // Lấy tất cả applications
  getAll: () => api.get<Application[]>("/applications"),

  // Lấy application theo ID
  getById: (id: number) => api.get<Application>(`/applications/${id}`),

  // Lấy applications theo mùa giải
  getBySeason: (seasonId: number) =>
    api.get<Application[]>(`/applications/season/${seasonId}`),

    // Lấy danh sách teams được accepted của một season
  getAcceptedTeamsBySeason: (seasonId: number) =>
    api.get<Team[]>(`/applications/season/${seasonId}/accepted-teams`),

  // Tạo application mới
  create: (data: {
    teamId: number;
    seasonId: number;
    status?: string;
  }) => api.post<Application>("/applications", data),

  // Cập nhật application
  update: (
    id: number,
    data: Partial<{
      teamId: number;
      seasonId: number;
      status: string;
    }>
  ) => api.put<Application>(`/applications/${id}`, data),

  // Xóa application
  delete: (id: number) => api.delete(`/applications/${id}`),


  // Xóa application theo team và season
  removeTeam: (seasonId: number, teamId: number) =>
    api.delete(`/applications/team/${teamId}/season/${seasonId}`),
};
