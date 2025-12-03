import prisma from "../config/prisma";

interface UpdateProfileDTO {
  name?: string;
}

class UserService {
  // Lấy user theo id
  async getById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: { team: true },
    });
  }



  // Cập nhật profile
  async updateProfile(id: number, data: UpdateProfileDTO) {
    return prisma.user.update({
      where: { id },
      data,
      include: { team: true },
    });
  }

  // Cập nhật team của user
  async setUserTeam(id: number, teamId: number) {
    return prisma.user.update({
      where: { id },
      data: { teamId },
      include: { team: true },
    });
  }

  // Lấy tất cả users (admin)
  async listUsers() {
    return prisma.user.findMany({ include: { team: true } });
  }
}

export default new UserService();
