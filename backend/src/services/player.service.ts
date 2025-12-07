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

  // Validate player trước khi tạo
  async validatePlayerCreation(data: {
    birthDate?: Date | null;
    teamId: number;
    playerTypeId: number;
  }) {
    // Lấy thông tin quy định (thường là parameter id = 1)
    const parameter = await prisma.parameter.findUnique({
      where: { id: 1 },
    });

    if (!parameter) {
      throw new Error("Không tìm thấy thông tin quy định");
    }

    // Kiểm tra tuổi
    if (data.birthDate) {
      const today = new Date();
      const birthDate = new Date(data.birthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (parameter.minAge !== null && age < parameter.minAge) {
        throw new Error(
          `Tuổi cầu thủ phải từ ${parameter.minAge} tuổi trở lên. Cầu thủ hiện tại ${age} tuổi.`
        );
      }

      if (parameter.maxAge !== null && age > parameter.maxAge) {
        throw new Error(
          `Tuổi cầu thủ không được vượt quá ${parameter.maxAge} tuổi. Cầu thủ hiện tại ${age} tuổi.`
        );
      }
    }

    // Lấy thông tin playerType để kiểm tra có phải cầu thủ nước ngoài không
    const playerType = await prisma.playerType.findUnique({
      where: { id: data.playerTypeId },
    });

    if (!playerType) {
      throw new Error("Loại cầu thủ không tồn tại");
    }

    const isForeign = playerType.name.toLowerCase() === "foreign";

    // Lấy danh sách cầu thủ hiện tại trong team
    const currentPlayers = await prisma.player.findMany({
      where: { teamId: data.teamId },
      include: {
        playerType: true,
      },
    });

    // Kiểm tra số lượng cầu thủ tối đa
    if (parameter.maxPlayers !== null) {
      if (currentPlayers.length >= parameter.maxPlayers) {
        throw new Error(
          `Đội bóng đã đạt số lượng cầu thủ tối đa (${parameter.maxPlayers} cầu thủ).`
        );
      }
    }

    // Kiểm tra số lượng cầu thủ tối thiểu (chỉ kiểm tra khi thêm cầu thủ mới)
    // Không cần kiểm tra vì đây là thêm mới, không phải cập nhật

    // Kiểm tra số lượng cầu thủ nước ngoài tối đa
    if (isForeign && parameter.maxForeignPlayers !== null) {
      const currentForeignCount = currentPlayers.filter(
        (p) => p.playerType.name.toLowerCase() === "foreign"
      ).length;

      if (currentForeignCount >= parameter.maxForeignPlayers) {
        throw new Error(
          `Đội bóng đã đạt số lượng cầu thủ nước ngoài tối đa (${parameter.maxForeignPlayers} cầu thủ).`
        );
      }
    }
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
    // Validate trước khi tạo
    await this.validatePlayerCreation({
      birthDate: data.birthDate,
      teamId: data.teamId,
      playerTypeId: data.playerTypeId,
    });

    return prisma.player.create({
      data,
      include: {
        team: true,
        playerType: true,
      },
    });
  }

  async validatePlayerUpdate(id: number, newData: any) {
  const parameter = await prisma.parameter.findUnique({ where: { id: 1 } });

  if (!parameter) throw new Error("Không tìm thấy thông tin quy định");

  // Lấy player cũ
  const oldPlayer = await prisma.player.findUnique({
    where: { id },
    include: { playerType: true },
  });

  if (!oldPlayer) throw new Error("Cầu thủ không tồn tại");

  const finalTeamId = newData.teamId ?? oldPlayer.teamId;
  const finalPlayerTypeId = newData.playerTypeId ?? oldPlayer.playerTypeId;

  // Validate tuổi nếu có cập nhật
  if (newData.birthDate) {
    const today = new Date();
    const birthDate = new Date(newData.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (parameter.minAge !== null && age < parameter.minAge) {
      throw new Error(`Tuổi cầu thủ phải từ ${parameter.minAge} tuổi trở lên. Hiện tại ${age} tuổi.`);
    }

    if (parameter.maxAge !== null && age > parameter.maxAge) {
      throw new Error(`Tuổi cầu thủ không vượt quá ${parameter.maxAge}. Hiện tại ${age} tuổi.`);
    }
  }

  // Lấy loại cầu thủ mới
  const newPlayerType = await prisma.playerType.findUnique({
    where: { id: finalPlayerTypeId },
  });

  if (!newPlayerType) throw new Error("Loại cầu thủ không tồn tại");

  const isForeignNew = newPlayerType.name.toLowerCase() === "foreign";
  const isForeignOld = oldPlayer.playerType.name.toLowerCase() === "foreign";

  // Lấy danh sách team mới
  const playersInTeam = await prisma.player.findMany({
    where: { teamId: finalTeamId },
    include: { playerType: true },
  });

  // Nếu đổi team → phải check maxPlayers
  if (finalTeamId !== oldPlayer.teamId && parameter.maxPlayers !== null) {
    if (playersInTeam.length >= parameter.maxPlayers) {
      throw new Error(
        `Đội bóng đã đạt số lượng cầu thủ tối đa (${parameter.maxPlayers}).`
      );
    }
  }

  // Check foreign players
  if (parameter.maxForeignPlayers !== null) {
    const foreignCount = playersInTeam.filter(
      (p) => p.playerType.name.toLowerCase() === "foreign"
    ).length;

    // Trường hợp: chuyển từ local → foreign hoặc đổi team mà là foreign
    const addingForeign =
      (!isForeignOld && isForeignNew) || // đổi loại
      (finalTeamId !== oldPlayer.teamId && isForeignNew); // đổi team

    if (addingForeign && foreignCount >= parameter.maxForeignPlayers) {
      throw new Error(
        `Số lượng cầu thủ nước ngoài đã đạt tối đa (${parameter.maxForeignPlayers}).`
      );
    }
  }
}


  // Cập nhật player
  async update(id: number, data: any) {
    await this.validatePlayerUpdate(id, data);
    
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

  // Lấy tất cả players theo team
  async getByTeam(teamId: number) {
    return prisma.player.findMany({
      where: { teamId },
      include: {
        team: true,
        playerType: true,
      },
      orderBy: { name: "asc" },
    });
  }
}

export default new PlayerService();


