import prisma from "../config/prisma";

class SeasonService {
  // Trả về toàn bộ mùa giải (params: none; output: Season[]; usage: dùng cho API hiển thị danh sách mùa giải)
  async getAll() {
    return prisma.season.findMany({
      orderBy: {
        startDate: "desc",
      },
    });
  }

  // Lấy mùa giải theo id (params: seasonId number; output: Season | null; usage: controllers cần map id -> name)
  async getById(id: number) {
    return prisma.season.findUnique({
      where: { id },
    });
  }

  // Trả về bảng xếp hạng theo mùa (params: seasonId number; output: Ranking[] với team/season; usage: GET /seasons/:id/rankings)
  async getRankingsBySeason(seasonId: number) {
    return prisma.ranking.findMany({
      where: {
        seasonId,
      },
      include: {
        team: true,
        season: true,
      },
      orderBy: [
        {
          points: "desc",
        },
        {
          goalDifference: "desc",
        },
        {
          win: "desc",
        },
      ],
    });
  }
  // Tạo mùa giải mới
  async create(data: {
    name: string;
    startDate: Date;
    endDate: Date;
  }) {
    return prisma.season.create({
      data,
    });
  }

  // Cập nhật mùa giải
  async update(id: number, data: {
    name?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return prisma.season.update({
      where: { id },
      data,
    });
  }

  // Xóa mùa giải (chú ý: nếu có rankings/applications liên kết cần xử lý cascade)
  async delete(id: number) {
    return prisma.season.delete({
      where: { id },
    });
  }
  
}




export default new SeasonService();

