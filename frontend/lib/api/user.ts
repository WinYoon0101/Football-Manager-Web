// src/lib/api/user.ts
import { api } from "./axios";

export interface User {
  id: number;
  name: string;
  email: string;
  teamId?: number | null;
  role?: string;
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
  // Lấy tất cả người dùng
  getAll: () => api.get<User[]>(`/users`),
  // Tạo người dùng mới
  create: (
    data: { name: string; email: string; password: string; role?: string; teamId?: number }
  ) => api.post<User>(`/users`, data),
  // Cập nhật thông tin người dùng
  update: (
    data: {id: number, name?: string; email?: string; password?: string; role?: string; teamId?: number }
  ) => api.patch<User>(`/users/me`, data),
  // Xóa người dùng
  delete: (id: number) => api.delete(`/users/${id}`
  )
};
