// src/lib/api/user.ts
import { api } from "./axios";

export interface User {
  id: number;
  name: string;
  email: string;
  teamId?: number | null;
  team?: {
    id: number;
    name: string;
    homeStadium: string;
    playerCount: number;
    image?: string;
  };
}

export const userApi = {
  // Lấy thông tin user theo ID 
  getById: (id: number) => api.get<User>(`/users/${id}`),
};
