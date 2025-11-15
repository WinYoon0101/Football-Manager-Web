import prisma from "../config/prisma";

class TeamService {
  // Lấy tất cả team
  async getAll() {
    return prisma.team.findMany();
  }

  // Lấy 1 team theo id
  async getById(id: number) {
    return prisma.team.findUnique({ where: { id } });
  }

  // Tạo team mới
  async create(data: { name: string; home_stadium?: string; player_count?: number }) {
    return prisma.team.create({ data });
  }

  // Cập nhật team
  async update(id: number, data: any) {
    return prisma.team.update({
      where: { id },
      data,
    });
  }

  // Xóa team
  async delete(id: number) {
    return prisma.team.delete({ where: { id } });
  }
}

export default new TeamService();
