import prisma from "../config/prisma";

class GoalService {
  // Lấy tất cả goals
  async getAll() {
    return prisma.goal.findMany({
      include: {
        match: {
          include: {
            round: true,
            team1: true,
            team2: true,
          },
        },
        team: true,
        player: true,
        goalType: true,
      },
      orderBy: {
        minute: "asc",
      },
    });
  }

  // Lấy 1 goal theo id
  async getById(id: number) {
    return prisma.goal.findUnique({
      where: { id },
      include: {
        match: {
          include: {
            round: true,
            team1: true,
            team2: true,
          },
        },
        team: true,
        player: true,
        goalType: true,
      },
    });
  }

  // Lấy goals theo match
  async getByMatch(matchId: number) {
    return prisma.goal.findMany({
      where: { matchId },
      include: {
        team: true,
        player: true,
        goalType: true,
      },
      orderBy: {
        minute: "asc",
      },
    });
  }

  // Tạo goal mới
  async create(data: {
    matchId: number;
    teamId: number;
    playerId: number;
    goalTypeId: number;
    minute: number;
  }) {
    return prisma.goal.create({
      data,
      include: {
        match: {
          include: {
            round: true,
            team1: true,
            team2: true,
          },
        },
        team: true,
        player: true,
        goalType: true,
      },
    });
  }

  // Cập nhật goal
  async update(
    id: number,
    data: Partial<{
      teamId: number;
      playerId: number;
      goalTypeId: number;
      minute: number;
    }>
  ) {
    return prisma.goal.update({
      where: { id },
      data,
      include: {
        match: {
          include: {
            round: true,
            team1: true,
            team2: true,
          },
        },
        team: true,
        player: true,
        goalType: true,
      },
    });
  }

  // Xóa goal
  async delete(id: number) {
    return prisma.goal.delete({
      where: { id },
    });
  }

  // Lấy tất cả goal types
  async getGoalTypes() {
    return prisma.goalType.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }
}

export default new GoalService();
