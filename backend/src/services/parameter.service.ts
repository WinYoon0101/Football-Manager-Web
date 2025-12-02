import prisma from "../config/prisma";

class ParameterService {
  // Lấy tất cả parameters
  async getAll() {
    return prisma.parameter.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async getById(id: number) {
    return prisma.parameter.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: any) {
    return prisma.parameter.update({
      where: { id },
      data,
    });
  }
}

export default new ParameterService();
