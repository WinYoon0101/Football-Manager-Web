import { api } from "./axios";
import type { Goal, GoalType } from "@/lib/types";

// Goal API
export const goalApi = {
  // Tạo bàn thắng mới
  create: (data: {
    matchId: number;
    teamId: number;
    playerId: number;
    goalTypeId: number;
    minute: number;
  }) => api.post<Goal>("/goals", data),

  // Cập nhật bàn thắng
  update: (
    id: number,
    data: Partial<{
      teamId: number;
      playerId: number;
      goalTypeId: number;
      minute: number;
    }>
  ) => api.put<Goal>(`/goals/${id}`, data),

  // Xóa bàn thắng
  delete: (id: number) => api.delete(`/goals/${id}`),

  // Lấy bàn thắng theo trận đấu
  getByMatch: (matchId: number) => api.get<Goal[]>(`/goals/match/${matchId}`),

  // Lấy tất cả loại bàn thắng
  getGoalTypes: () => api.get<GoalType[]>("/goals/types"),
};
