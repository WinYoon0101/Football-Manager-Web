// src/services/application.service.ts
import prisma from "../config/prisma";

interface CreateApplicationDTO {
  teamId: number;
  seasonId: number;
  status?: string;
}

class ApplicationService {
  // Lấy tất cả applications
  async getAll() {
    return prisma.application.findMany({
      include: {
        team: true,
        season: true,
      },
      orderBy: { dateSignin: "desc" },
    });
  }

  // Lấy application theo ID
  async getById(id: number) {
    return prisma.application.findUnique({
      where: { id },
      include: {
        team: true,
        season: true,
      },
    });
  }

  // Lấy tất cả applications của một season, không phân biệt status
async getAllBySeason(seasonId: number) {
  return prisma.application.findMany({
    where: { seasonId }, // không filter status
    include: {
      team: true,
      season: true,
    },
    orderBy: { dateSignin: "asc" },
  });
}

  // Lấy applications theo season chờ duyệt
  async getBySeason(seasonId: number) {
    return prisma.application.findMany({
      where: { seasonId, status: "pending", },
      include: {
        team: true,
        season: true,
      },
      orderBy: { dateSignin: "asc" },
    });
  }

  // Lấy applications theo team
  async getByTeam(teamId: number) {
    return prisma.application.findMany({
      where: { teamId },
      include: {
        team: true,
        season: true,
      },
      orderBy: { dateSignin: "asc" },
    });
  }

  // Tạo mới application
  async create(data: CreateApplicationDTO) {
    return prisma.application.create({
      data: {
        teamId: data.teamId,
        seasonId: data.seasonId,
        status: data.status ?? "pending",
      },
      include: {
        team: true,
        season: true,
      },
    });
  }

  // Cập nhật application
  async update(id: number, data: Partial<CreateApplicationDTO>) {
    return prisma.application.update({
      where: { id },
      data,
      include: {
        team: true,
        season: true,
      },
    });
  }

  // Xóa application
  async delete(id: number) {
    return prisma.application.delete({
      where: { id },
    });
  }

  // Lấy danh sách đội đã được chấp nhận theo mùa giải
  async getAcceptedTeamsBySeason(seasonId: number) {
    const applications = await prisma.application.findMany({
      where: { seasonId, status: "accepted" },
      include: { team: true }, // chỉ cần team thôi, season có thể bỏ
      orderBy: { dateSignin: "asc" },
    });

    // Trả về danh sách team (loại trùng nếu cần)
    const teams = applications.map(app => app.team);

    return teams;
  }

}

export default new ApplicationService();
