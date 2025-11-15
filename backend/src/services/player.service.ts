// src/services/player.service.ts

import prisma from "../config/prisma";

class PlayerService {
  // Lấy tất cả player
  async getAll() {
    return prisma.player.findMany({
      include: {
        team: true,
        player_type: true,
      },
    });
  }

  // Lấy player theo id
  async getById(id: number) {
    return prisma.player.findUnique({
      where: { id },
      include: {
        team: true,
        player_type: true,
      },
    });
  }

  // Tạo player mới
  async create(data: { name: string; team_id: number; player_type_id: number; birth_date?: Date; notes?: string }) {
    return prisma.player.create({
      data,
    });
  }

  // Cập nhật thông tin player
  async update(id: number, data: any) {
    return prisma.player.update({
      where: { id },
      data,
    });
  }

  // Xóa player
  async delete(id: number) {
    return prisma.player.delete({
      where: { id },
    });
  }
}

export default new PlayerService();
