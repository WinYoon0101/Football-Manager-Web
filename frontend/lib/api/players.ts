import type { Player, PlayerType } from "@/lib/types";
import { api } from "./axios";

export const playersAPI = {
  // Lấy tất cả players
  async getAll(): Promise<Player[]> {
    const res = await api.get<Player[]>("/players");
    return res.data;
  },

  // Lấy player theo id
  async getById(id: number): Promise<Player> {
    const res = await api.get<Player>(`/players/${id}`);
    return res.data;
  },

  // Tạo player mới
  async create(data: {
    name: string;
    birthDate?: string;
    teamId: number;
    playerTypeId: number;
    notes?: string;
    image?: File;
  }): Promise<Player> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("teamId", data.teamId.toString());
    formData.append("playerTypeId", data.playerTypeId.toString());

    if (data.birthDate) {
      formData.append("birthDate", data.birthDate);
    }

    if (data.notes) {
      formData.append("notes", data.notes);
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    const res = await api.post<Player>("/players", formData);
    return res.data;
  },

  // Cập nhật player
  async update(
    id: number,
    data: {
      name?: string;
      birthDate?: string;
      teamId?: number;
      playerTypeId?: number;
      notes?: string;
      image?: File;
    }
  ): Promise<Player> {
    const formData = new FormData();

    if (data.name !== undefined) formData.append("name", data.name);
    if (data.birthDate !== undefined) formData.append("birthDate", data.birthDate);
    if (data.teamId !== undefined) formData.append("teamId", data.teamId.toString());
    if (data.playerTypeId !== undefined) formData.append("playerTypeId", data.playerTypeId.toString());
    if (data.notes !== undefined) formData.append("notes", data.notes || "");
    if (data.image) formData.append("image", data.image);

    const res = await api.put<Player>(`/players/${id}`, formData);
    return res.data;
  },

  // Xóa player
  async delete(id: number): Promise<void> {
    await api.delete(`/players/${id}`);
  },

  // Lấy tất cả player types
  async getPlayerTypes(): Promise<PlayerType[]> {
    const res = await api.get<PlayerType[]>("/players/types");
    return res.data;
  },
};


