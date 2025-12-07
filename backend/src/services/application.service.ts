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

  // Validate trước khi tạo application
async validateApplicationCreation(teamId: number) {
  // Lấy thông tin quy định
  const parameter = await prisma.parameter.findUnique({
    where: { id: 1 },
  });

  if (!parameter) {
    throw new Error("Không tìm thấy thông tin quy định");
  }

  // Lấy số lượng cầu thủ hiện tại của đội
  const playerCount = await prisma.player.count({
    where: { teamId },
  });

  // Kiểm tra số lượng tối thiểu
  if (parameter.minPlayers !== null && playerCount < parameter.minPlayers) {
    throw new Error(
      `Đội bóng chưa đủ số lượng cầu thủ tối thiểu để tham gia (${parameter.minPlayers} cầu thủ). Hiện có ${playerCount} cầu thủ.`
    );
  }
}

  // Tạo mới application
  async create(data: CreateApplicationDTO) {
    // Validate trước
  await this.validateApplicationCreation(data.teamId);
  
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
