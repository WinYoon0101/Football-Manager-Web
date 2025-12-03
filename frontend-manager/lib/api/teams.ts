import type { Team } from "@/lib/types";
import { api } from "./axios";

export const teamsAPI = {
  // Lấy tất cả teams
  async getAll(): Promise<Team[]> {
    const res = await api.get<Team[]>("/teams");
    return res.data;
  },

  // Lấy team theo id
  async getById(id: number): Promise<Team> {
    const res = await api.get<Team>(`/teams/${id}`);
    return res.data;
  },

  // Tạo team mới
  async create(data: { name: string; homeStadium: string; logo?: File }): Promise<Team> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("homeStadium", data.homeStadium);

    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const res = await api.post<Team>("/teams", formData);
    return res.data;
  },

  // Cập nhật team
  async update(
    id: number,
    data: { name?: string; homeStadium?: string; logo?: File }
  ): Promise<Team> {
    const formData = new FormData();

    if (data.name !== undefined) formData.append("name", data.name);
    if (data.homeStadium !== undefined) formData.append("homeStadium", data.homeStadium);
    if (data.logo) formData.append("logo", data.logo);

    const res = await api.put<Team>(`/teams/${id}`, formData);
    return res.data;
  },

  // Xóa team
  async delete(id: number): Promise<void> {
    await api.delete(`/teams/${id}`);
  },
};
