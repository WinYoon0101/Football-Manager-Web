import { Request, Response } from "express";
import userService from "../services/user.service";

class UserController {
  // GET /users/:id (trả thẳng User)
  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) return res.status(400).json({ message: "ID không hợp lệ" });

      const user = await userService.getById(id);
      if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

      // Trả về trực tiếp user
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }

  // PATCH /users/me
  async updateProfile(req: any, res: Response) {
    try {
      // const userId = req.user?.id;
      const { id, name, email, role, teamId, password } = req.body;
      if (!id) return res.status(400).json({ message: "Auth token required" });
      const updated = await userService.updateProfile(Number(id), { name, email, role, teamId, password });

      // Trả về trực tiếp user
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }

  // PATCH /users/team
  async setTeam(req: any, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(400).json({ message: "Auth token required" });

      const { teamId } = req.body;
      const updated = await userService.setUserTeam(userId, Number(teamId));

      // Trả về trực tiếp user
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }

  // GET /users (admin)
  async listUsers(req: Request, res: Response) {
    try {
      const users = await userService.listUsers();

      // Trả về trực tiếp mảng user
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }

  // POST /users 
  async createUser(req: Request, res: Response) {
    try {
      const { email, password, name, role, teamId } = req.body;
      const teamIdNumber = Number(teamId) || null;
      const newUser = await userService.createUser({ email, password, name, role, teamId: teamIdNumber });

      // Trả về trực tiếp user
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
  

  // DELETE /users/:id
  async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id || id <= 0) return res.status(400).json({ message: "ID không hợp lệ" });

      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
}


export default new UserController();
