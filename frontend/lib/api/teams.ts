import type { Team } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const teamsAPI = {
  // Lấy tất cả teams
  async getAll(): Promise<Team[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Không thể tải danh sách đội bóng" }));
        throw new Error(error.message || "Không thể tải danh sách đội bóng");
      }
      return response.json();
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Lỗi kết nối đến server");
    }
  },

  // Lấy team theo id
  async getById(id: number): Promise<Team> {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${id}`);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Không thể tải thông tin đội bóng" }));
        throw new Error(error.message || "Không thể tải thông tin đội bóng");
      }
      return response.json();
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Lỗi kết nối đến server");
    }
  },

  // Tạo team mới
  async create(data: { name: string; homeStadium: string; logo?: File }): Promise<Team> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("homeStadium", data.homeStadium);
    
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Không thể tạo đội bóng" }));
      throw new Error(error.message || "Không thể tạo đội bóng");
    }

    return response.json();
  },

  // Cập nhật team
  async update(
    id: number,
    data: { name?: string; homeStadium?: string; logo?: File }
  ): Promise<Team> {
    const formData = new FormData();
    
    if (data.name !== undefined) {
      formData.append("name", data.name);
    }
    
    if (data.homeStadium !== undefined) {
      formData.append("homeStadium", data.homeStadium);
    }
    
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Không thể cập nhật đội bóng" }));
      throw new Error(error.message || "Không thể cập nhật đội bóng");
    }

    return response.json();
  },

  // Xóa team
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Không thể xóa đội bóng" }));
      throw new Error(error.message || "Không thể xóa đội bóng");
    }
  },
};

