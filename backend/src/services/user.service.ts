import prisma from "../config/prisma";
import bcrypt from "bcryptjs";

interface UpdateProfileDTO {
  name?: string;
  email?: string;
  role?: string;
  teamId?: number | null;
  password?: string;
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
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        teamId: data.teamId,
        ...(data.password
          ? { password: await bcrypt.hash(data.password, 10) }
          : {}),
      },
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

  // Tạo user mới
  async createUser(data: { email: string, password: string, name?: string, role: string; teamId?: number | null }) {
    // check if user is existing
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error("Email is existing.");
    }

    // hash password
    const hashPassword = await bcrypt.hash(data.password, 10);
    // create new user
    const newUser = await prisma.user.create({
      data: { email: data.email, password: hashPassword, name: data.name, role: data.role, teamId: data.teamId },
    });

    return { id: newUser.id, email: newUser.email, name: newUser.name };
  }

  // Xóa user
  async deleteUser(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}

export default new UserService();
