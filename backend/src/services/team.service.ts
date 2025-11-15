import prisma from "../config/prisma";

class TeamService {
  // Lấy tất cả team
  async getAll() {
    return prisma.team.findMany({
      include: {
        players: true,
      },
    });
  }

  // Lấy 1 team theo id
  async getById(id: number) {
    return prisma.team.findUnique({
      where: { id },
      include: {
        players: true,
      },
    });
  }

  // Tạo team mới
  async create(data: {
    name: string;
    homeStadium?: string;
    playerCount?: number;
    image?: string;
  }) {
    return prisma.team.create({
      data,
      include: {
        players: true,
      },
    });
  }

  // Cập nhật team
  async update(id: number, data: any) {
    return prisma.team.update({
      where: { id },
      data,
      include: {
        players: true,
      },
    });
  }

  // Xóa team
  async delete(id: number) {
    return prisma.team.delete({
      where: { id },
    });
  }
}

export default new TeamService();
