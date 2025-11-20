import prisma from "../config/prisma";

class PlayerService {
  // Lấy tất cả players
  async getAll() {
    return prisma.player.findMany({
      include: {
        team: true,
        playerType: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  // Lấy 1 player theo id
  async getById(id: number) {
    return prisma.player.findUnique({
      where: { id },
      include: {
        team: true,
        playerType: true,
      },
    });
  }

  // Tạo player mới
  async create(data: {
    name: string;
    birthDate?: Date | null;
    teamId: number;
    playerTypeId: number;
    notes?: string | null;
    image?: string | null;
  }) {
    return prisma.player.create({
      data,
      include: {
        team: true,
        playerType: true,
      },
    });
  }

  // Cập nhật player
  async update(id: number, data: any) {
    return prisma.player.update({
      where: { id },
      data,
      include: {
        team: true,
        playerType: true,
      },
    });
  }

  // Xóa player
  async delete(id: number) {
    return prisma.player.delete({
      where: { id },
    });
  }

  // Lấy tất cả player types
  async getPlayerTypes() {
    return prisma.playerType.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }
}

export default new PlayerService();


