import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-mac-dinh";
class AuthService {
  async register(email: string, password: string, name?: string) {
    // check if user is existing
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email is existing.");
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);
    // create new user
    const newUser = await prisma.user.create({
      data: { email, password: hashPassword, name },
    });

    return { id: newUser.id, email: newUser.email, name: newUser.name };
  }

 async login(email: string, password: string) {
  // Lấy user kèm team
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      team: true, // include team luôn
    },
  });

  if (!user) {
    throw new Error("Email or password is incorrect");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Email or password is incorrect");
  }

  // tạo JWT, có thể include teamId
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // trả về full user object, loại bỏ password
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword, // user kèm team
    token,
  };
}

}

export default new AuthService();
