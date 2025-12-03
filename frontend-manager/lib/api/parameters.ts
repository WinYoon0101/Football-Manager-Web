import { api } from "./axios";

export interface Parameter {
  id: number;
  minAge: number | null;
  maxAge: number | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  maxForeignPlayers: number | null;
  minGoalMinute: number | null;
  maxGoalMinute: number | null;
  categorySort: string[];
  drawScore: number;
  loseScore: number;
  winScore: number;
}

export interface UpdateParameterRequest {
  minAge?: number | null;
  maxAge?: number | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  maxForeignPlayers?: number | null;
  minGoalMinute?: number | null;
  maxGoalMinute?: number | null;
  categorySort?: string[];
  drawScore?: number;
  loseScore?: number;
  winScore?: number;
}

export const parametersAPI = {
  // Lấy tất cả parameters
  getAll: async (): Promise<Parameter[]> => {
    const res = await api.get<Parameter[]>("/parameters");
    return res.data;
  },

  // Lấy parameter theo id
  getById: async (id: number): Promise<Parameter> => {
    const res = await api.get<Parameter>(`/parameters/${id}`);
    return res.data;
  },

  // Cập nhật parameter
  update: async (
    id: number,
    data: UpdateParameterRequest
  ): Promise<Parameter> => {
    const res = await api.put<Parameter>(`/parameters/${id}`, data);
    return res.data;
  },
};
